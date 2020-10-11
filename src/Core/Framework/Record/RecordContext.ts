import { InteractionContext } from './../../Interaction/InteractionContext';
import { RecordCell } from './RecordCell';
import { Tank } from '../../Items/Unit/Tank';
import { RecordUnit } from './RecordUnit';
import { RecordKind } from './RecordKind';
import { RecordObject } from './RecordObject';
import { GameContext } from '../GameContext';
import { MapContext } from '../../Setup/Generator/MapContext';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { RecordHq } from './RecordHq';
import { Cell } from '../../Items/Cell/Cell';
import { RecordAction } from './RecordAction';
import { Item } from '../../Items/Item';
import { FieldTypeHelper } from '../Packets/FieldTypeHelper';
import { RecordField } from './RecordField';
import { RecordData } from './RecordData';

export class RecordContext {
	private _data: RecordData;
	private _refDate: number;

	constructor(
		private _mapContext: MapContext,
		private _gameContext: GameContext,
		private _interactionContext: InteractionContext
	) {
		this._refDate = new Date().getTime();
		this._data = new RecordData();

		this._gameContext.GetHqs().forEach((hq) => {
			this._data.Hqs.Add(hq.PlayerName, new RecordHq(hq.PlayerName, hq.GetSkin().GetColor()));
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});

		const time = this.GetTime();
		this._data.Dates.push(time);
		this._gameContext.GetCells().forEach((cell) => {
			const action = new RecordField(time, FieldTypeHelper.GetTrackingDescription(cell.GetField()));
			if (action.kind !== RecordKind.None) {
				const trackingCell = new RecordCell();
				trackingCell.Actions = new Array<RecordField>();
				trackingCell.Actions.push(action);
				this._data.Cells.Add(cell.Coo(), trackingCell);
				cell.OnFieldChanged.On(this.HandleFieldChanged.bind(this));
			}
		});

		this._interactionContext.OnInteractionChanged.On(this.HandleInteractionChanged.bind(this));
	}

	private HandleInteractionChanged(src: any, message: string): void {
		this._data.Interactions.push(message);
	}

	private GetTime(): number {
		return new Date().getTime() - this._refDate;
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		const time = this.GetTime();
		this._data.Dates.push(time);
		const action = new RecordField(time, FieldTypeHelper.GetTrackingDescription(cell.GetField()));
		this._data.Cells.Get(cell.Coo()).Actions.push(action);
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		const time = this.GetTime();
		const trackingUnit = new RecordUnit();
		trackingUnit.Id = vehicule.Id;
		trackingUnit.IsTank = vehicule instanceof Tank;
		this._data.Dates.push(time);
		trackingUnit.Actions.push(
			new RecordAction(time, vehicule.GetCurrentCell().GetCoordinate(), RecordKind.Created, src.GetCurrentLife())
		);
		this._data.Hqs.Get(src.PlayerName).Units.Add(vehicule.Id, trackingUnit);
		vehicule.OnCellChanged.On(this.HandleVehicleCellChanged.bind(this));
		vehicule.OnDamageReceived.On(this.HandleVehicleCellChanged.bind(this));
		vehicule.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
	}

	private HandleVehicleDestroyed(src: Vehicle, formerCell: Item): void {
		const time = this.GetTime();
		this._data.Dates.push(time);
		this._data.Hqs
			.Get(src.Hq.PlayerName)
			.Units.Get(src.Id)
			.Actions.push(
				new RecordAction(time, src.GetCurrentCell().GetCoordinate(), RecordKind.Destroyed, src.GetCurrentLife())
			);
	}

	private HandleVehicleCellChanged(src: Vehicle, formerCell: Cell): void {
		if (src.IsAlive()) {
			const time = this.GetTime();
			this._data.Dates.push(time);
			this._data.Hqs
				.Get(src.Hq.PlayerName)
				.Units.Get(src.Id)
				.Actions.push(
					new RecordAction(time, src.GetCurrentCell().GetCoordinate(), RecordKind.Moved, src.GetCurrentLife())
				);
		}
	}

	public GetTrackingObject(): RecordObject {
		const players: any = {};
		this._data.Hqs.Keys().map((key) => {
			players[key] = this._data.Hqs.Get(key).GetJsonObject();
		});

		const obj = new RecordObject();
		obj.Title = `save_${new Date().toLocaleTimeString()}`;
		obj.MapContext = this._mapContext;
		obj.Cells = this._data.Cells.GetValues();
		obj.Hqs = players;
		obj.Interactions = this._data.Interactions;
		obj.Points = this._data.Dates;
		return obj;
	}
}
