import { PoisonField } from '../../Items/Cell/Field/PoisonField';
import { SlowField } from '../../Items/Cell/Field/SlowField';
import { AttackField } from '../../Items/Cell/Field/AttackField';
import { HealField } from '../../Items/Cell/Field/HealField';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { HexAxial } from '../Geometry/HexAxial';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { route } from 'preact-router';
import { GameMessage } from './GameMessage';
import { MessageProgess } from './MessageProgess';
import { MapContext } from '../../Setup/Generator/MapContext';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { IaHeadquarter } from '../../Ia/Hq/IaHeadquarter';
import { AliveField } from '../../Items/Cell/Field/AliveField';
import { Tank } from '../../Items/Unit/Tank';
import { MoneyField } from '../../Items/Cell/Field/MoneyField';
import { FastField } from '../../Items/Cell/Field/FastField';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { GameHelper } from '../../Framework/GameHelper';

export class MessageDispatcher {
	private _isClient: boolean = false;

	public Init(isClient: boolean): void {
		this._isClient = isClient;

		if (this._isClient) {
			PeerHandler.Subscribe({
				type: PacketKind.Map,
				func: (e: any) => this.GetMap(e)
			});
		}
		PeerHandler.Subscribe({
			type: PacketKind.Create,
			func: (e: any) => this.CreateVehicle(e)
		});
		PeerHandler.Subscribe({
			type: PacketKind.Next,
			func: (e: any) => this.ReceiveNextPosition(e)
		});
		PeerHandler.Subscribe({
			type: PacketKind.Destroyed,
			func: (e: any) => this.Destroyed(e)
		});
		PeerHandler.Subscribe({
			type: PacketKind.Target,
			func: (e: any) => this.Target(e)
		});
		PeerHandler.Subscribe({
			type: PacketKind.Field,
			func: (e: any) => this.Field(e)
		});
		PeerHandler.Subscribe({
			type: PacketKind.Camouflage,
			func: (e: any) => this.Camouflage(e)
		});
		PeerHandler.Subscribe({
			type: PacketKind.Influence,
			func: (e: any) => this.Influence(e)
		});
	}

	private Field(e: any): void {
		if (this.IsListenedHq(e)) {
			const pos = new HexAxial(e.cell.Q, e.cell.R);
			const cell = GameHelper.Cells.Get(pos);
			const type = e.Type;
			if (type === 'Heal') {
				let field = new HealField(cell);
				GameHelper.Playground.Items.push(field);
			} else if (type === 'Attack') {
				let field = new AttackField(cell);
				GameHelper.Playground.Items.push(field);
			} else if (type === 'Money') {
				let field = new MoneyField(cell);
				GameHelper.Playground.Items.push(field);
			} else if (type === 'Fast') {
				let field = new FastField(cell);
				GameHelper.Playground.Items.push(field);
			} else if (type === 'Slow') {
				let field = new SlowField(cell);
				GameHelper.Playground.Items.push(field);
			} else if (type === 'Poison') {
				let field = new PoisonField(cell);
				GameHelper.Playground.Items.push(field);
			} else if (type === 'Influence') {
				const hqPos = new HexAxial(e.Hq.Q, e.Hq.R);
				const hq = GameHelper.Cells.Get(hqPos).GetField() as Headquarter;
				let field = new InfluenceField(cell, hq);
				GameHelper.Playground.Items.push(field);
			}
		}
	}

	private Target(e: any): void {
		if (this.IsListenedHq(e)) {
			const pos = new HexAxial(e.cell.Q, e.cell.R);
			const tank = GameHelper.Cells.Get(pos).GetOccupier() as Tank;
			if (e.TarGetCell) {
				const tarGetCell = new HexAxial(e.TarGetCell.Q, e.TarGetCell.R);
				tank.SetMainTarget(GameHelper.Cells.Get(tarGetCell).GetShootableEntity());
			} else {
				tank.SetMainTarget(null);
			}
		}
	}

	private Camouflage(e: any): void {
		if (this.IsListenedHq(e)) {
			const pos = new HexAxial(e.cell.Q, e.cell.R);
			const tank = GameHelper.Cells.Get(pos).GetOccupier() as Tank;
			tank.SetCamouflage();
		}
	}

	private Influence(e: any): void {
		if (this.IsListenedHq(e)) {
			const pos = new HexAxial(e.cell.Q, e.cell.R);
			const cell = GameHelper.Cells.Get(pos);
			const influenceField = cell.GetField() as InfluenceField;
			const type = e.Type;

			if (type === 'PowerUp') {
				influenceField.PowerUp();
			} else if (type === 'PowerDown') {
				influenceField.PowerDown();
			} else if (type === 'RangeUp') {
				influenceField.RangeUp();
			} else if (type === 'RangeDown') {
				influenceField.RangeDown();
			}
		}
	}

	private Destroyed(e: any): void {
		const pos = new HexAxial(e.cell.Q, e.cell.R);
		const cell = GameHelper.Cells.Get(pos);
		const destroyedItemName = e.Name;

		if (cell.HasOccupier() && 'vehicle' === destroyedItemName) {
			const vehicle = cell.GetOccupier() as Vehicle;
			vehicle.Destroy();
			return;
		} else if (cell.GetField().IsDesctrutible() && 'field' === destroyedItemName) {
			(<AliveField>cell.GetField()).Destroy();
		}
	}

	private ReceiveNextPosition(e: any): void {
		if (this.IsListenedHq(e)) {
			const nextPos = new HexAxial(e.Nextcell.Q, e.Nextcell.R);
			const vehicle = GameHelper.VehiclesContainer.Get(e.Id);
			vehicle.SetNextCell(GameHelper.Cells.Get(nextPos));
		}
	}

	private IsListenedHq(e: any): boolean {
		const coordinate = new HexAxial(e.Hq.Q, e.Hq.R);
		const hq = GameHelper.Cells.Get(coordinate).GetField() as Headquarter;
		return hq && hq.PlayerName !== GameHelper.PlayerName && hq.constructor.name !== IaHeadquarter.name; //find a way to fix it
	}

	private CreateVehicle(e: any): void {
		if (this.IsListenedHq(e)) {
			if (!GameHelper.VehiclesContainer.Exist(e.Id)) {
				const hqPos = new HexAxial(e.Hq.Q, e.Hq.R);
				const hq = GameHelper.Cells.Get(hqPos).GetField() as Headquarter;
				const pos = GameHelper.Cells.Get(new HexAxial(e.cell.Q, e.cell.R));
				if (e.Type === 'Tank') {
					hq.CreateTank(pos);
				} else if (e.Type === 'Truck') {
					hq.CreateTruck(pos);
				}
			}
		}
	}

	private GetMap(content: GameMessage<MapContext>): void {
		//isntantiate coordinate
		content.Message.Items.forEach((item) => {
			item.Position = new HexAxial(item.Position.Q, item.Position.R);
		});
		content.Message.CenterItem.Position = new HexAxial(
			content.Message.CenterItem.Position.Q,
			content.Message.CenterItem.Position.R
		);

		content.Message.Hqs.forEach((hq) => {
			hq.Diamond.Position = new HexAxial(hq.Diamond.Position.Q, hq.Diamond.Position.R);
			hq.Hq.Position = new HexAxial(hq.Hq.Position.Q, hq.Hq.Position.R);
		});

		GameHelper.MapContext = content.Message;
		if (content.Status == MessageProgess.end) {
			route('/Canvas', true);
			PeerHandler.CloseRoom();
		}
	}
}
