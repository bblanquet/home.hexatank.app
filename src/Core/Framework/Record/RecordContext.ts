import { InteractionContext } from './../../Interaction/InteractionContext';
import { RecordCell } from './RecordCell';
import { Tank } from '../../Items/Unit/Tank';
import { RecordUnit } from './RecordUnit';
import { RecordKind } from './RecordKind';
import { RecordJson } from './RecordJson';
import { GameContext } from '../../Setup/Context/GameContext';
import { GameBlueprint } from '../../Setup/Blueprint/Game/GameBlueprint';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { RecordHq } from './RecordHq';
import { Cell } from '../../Items/Cell/Cell';
import { RecordAction } from './RecordAction';
import { Item } from '../../Items/Item';
import { FieldTypeHelper } from '../Packets/FieldTypeHelper';
import { RecordField } from './RecordField';
import { RecordData } from './RecordData';
import { InteractionInfo } from '../../Interaction/InteractionInfo';

export class RecordContext {
	private _data: RecordData;

	constructor(
		mapContext: GameBlueprint,
		private _gameContext: GameContext,
		private _interactionContext: InteractionContext
	) {
		this._data = new RecordData();
		this._data.MapContext = mapContext;
		this._data.RefDate = this.GetDate();
		this._gameContext.GetHqs().forEach((hq) => {
			this._data.Hqs.Add(hq.Identity.Name, new RecordHq(hq.Identity.Name, hq.Identity.Skin.GetColor()));
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});

		this._data.Dates.push(this._data.RefDate);
		this._gameContext.GetCells().forEach((cell) => {
			const action = new RecordField(this._data.RefDate, FieldTypeHelper.GetRecordDescription(cell.GetField()));
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

	private HandleInteractionChanged(src: any, message: InteractionInfo): void {
		this._data.Interactions.push(message);
	}

	private GetDate(): number {
		return Date.now();
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		const time = this.GetDate();
		this._data.Dates.push(time);
		const action = new RecordField(time, FieldTypeHelper.GetRecordDescription(cell.GetField()));
		this._data.Cells.Get(cell.Coo()).Actions.push(action);
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		const time = this.GetDate();
		const trackingUnit = new RecordUnit();
		trackingUnit.Id = vehicule.Id;
		trackingUnit.IsTank = vehicule instanceof Tank;
		this._data.Dates.push(time);
		trackingUnit.Actions.push(
			new RecordAction(time, vehicule.GetCurrentCell().GetHexCoo(), RecordKind.Created, src.GetCurrentLife())
		);
		this._data.Hqs.Get(src.Identity.Name).Units.Add(vehicule.Id, trackingUnit);
		vehicule.OnCellChanged.On(this.HandleVehicleCellChanged.bind(this));
		vehicule.OnDamageReceived.On(this.HandleVehicleDamaged.bind(this));
		vehicule.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
	}

	private HandleVehicleDestroyed(src: Vehicle, formerCell: Item): void {
		const time = this.GetDate();
		this._data.Dates.push(time);
		this._data.Hqs
			.Get(src.Identity.Name)
			.Units.Get(src.Id)
			.Actions.push(
				new RecordAction(time, src.GetCurrentCell().GetHexCoo(), RecordKind.Destroyed, src.GetCurrentLife())
			);
	}

	private HandleVehicleDamaged(src: Vehicle, formerCell: Cell): void {
		if (src.IsAlive()) {
			const time = this.GetDate();
			this._data.Dates.push(time);
			this._data.Hqs
				.Get(src.Identity.Name)
				.Units.Get(src.Id)
				.Actions.push(
					new RecordAction(time, src.GetCurrentCell().GetHexCoo(), RecordKind.Damage, src.GetCurrentLife())
				);
		}
	}

	private HandleVehicleCellChanged(src: Vehicle, formerCell: Cell): void {
		if (src.IsAlive()) {
			const time = this.GetDate();
			this._data.Dates.push(time);
			this._data.Hqs
				.Get(src.Identity.Name)
				.Units.Get(src.Id)
				.Actions.push(
					new RecordAction(time, src.GetCurrentCell().GetHexCoo(), RecordKind.Moved, src.GetCurrentLife())
				);
		}
	}

	public GetRecord(): RecordJson {
		return RecordJson.To(this._data);
	}
}
