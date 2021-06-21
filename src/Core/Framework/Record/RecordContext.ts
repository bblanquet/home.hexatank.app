import { InteractionContext } from './../../Interaction/InteractionContext';
import { RecordCell } from './Model/Item/RecordCell';
import { Tank } from '../../Items/Unit/Tank';
import { RecordUnit } from './Model/Item/RecordUnit';
import { RecordKind } from './Model/Item/State/RecordKind';
import { RecordAny } from './Model/RecordAny';
import { GameContext } from '../../Setup/Context/GameContext';
import { GameBlueprint } from '../../Setup/Blueprint/Game/GameBlueprint';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { RecordHq } from './Model/RecordHq';
import { Cell } from '../../Items/Cell/Cell';
import { RecordVehicleState } from './Model/Item/State/RecordVehicleState';
import { Item } from '../../Items/Item';
import { FieldTypeHelper } from '../Packets/FieldTypeHelper';
import { RecordCellState } from './Model/Item/State/RecordCellState';
import { RecordContent } from './Model/RecordContent';
import { IRecordContext } from './IRecordContext';
import { InteractionInfo } from '../../Interaction/InteractionInfo';

export class RecordContext implements IRecordContext {
	private _record: RecordContent;
	private _handleVehicle: any = this.HandleVehicleCreated.bind(this);
	private _handleField: any = this.HandleFieldChanged.bind(this);
	private _handleInteraction: any = this.HandleInteractionChanged.bind(this);

	constructor(
		mapContext: GameBlueprint,
		private _gameContext: GameContext,
		private _interactionContext: InteractionContext
	) {
		this._record = new RecordContent();
		this._record.MapContext = mapContext;
		this._record.StartDate = Date.now();
		this._gameContext.GetHqs().forEach((hq) => {
			this._record.Hqs.Add(hq.Identity.Name, new RecordHq(hq.Identity.Name, hq.Identity.Skin.GetColor()));
			hq.OnVehicleCreated.On(this._handleVehicle);
		});

		this._record.Dates.push(this._record.StartDate);
		this._gameContext.GetCells().forEach((cell) => {
			const action = new RecordCellState(
				this._record.StartDate,
				FieldTypeHelper.GetRecordDescription(cell.GetField())
			);
			if (action.kind !== RecordKind.None) {
				const trackingCell = new RecordCell();
				trackingCell.States = new Array<RecordCellState>();
				trackingCell.States.push(action);
				this._record.Cells.Add(cell.Coo(), trackingCell);
				cell.OnFieldChanged.On(this._handleField);
			}
		});

		this._interactionContext.OnInteractionChanged.On(this._handleInteraction);
	}

	private HandleInteractionChanged(src: any, message: InteractionInfo): void {
		this._record.Interactions.push(message);
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		if (this.IsRecording()) {
			const time = Date.now();
			const actions = this._record.Cells.Get(cell.Coo());
			const action = new RecordCellState(time, FieldTypeHelper.GetRecordDescription(cell.GetField()));
			if (actions && actions.States[actions.States.length]) this._record.Dates.push(time);
			this._record.Cells.Get(cell.Coo()).States.push(action);
		}
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		if (this.IsRecording()) {
			const time = Date.now();
			const trackingUnit = new RecordUnit();
			trackingUnit.Id = vehicule.Id;
			trackingUnit.IsTank = vehicule instanceof Tank;
			this._record.Dates.push(time);
			trackingUnit.States.push(
				new RecordVehicleState(
					time,
					vehicule.GetCurrentCell().GetHexCoo(),
					RecordKind.Created,
					src.GetCurrentLife()
				)
			);
			this._record.Hqs.Get(src.Identity.Name).Units.Add(vehicule.Id, trackingUnit);
			vehicule.OnCellChanged.On(this.HandleVehicleCellChanged.bind(this));
			vehicule.OnDamageReceived.On(this.HandleVehicleDamaged.bind(this));
			vehicule.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
		}
	}

	private HandleVehicleDestroyed(src: Vehicle, formerCell: Item): void {
		if (this.IsRecording()) {
			const time = Date.now();
			this._record.Dates.push(time);
			this._record.Hqs
				.Get(src.Identity.Name)
				.Units.Get(src.Id)
				.States.push(
					new RecordVehicleState(
						time,
						src.GetCurrentCell().GetHexCoo(),
						RecordKind.Destroyed,
						src.GetCurrentLife()
					)
				);
		}
	}

	private HandleVehicleDamaged(src: Vehicle, formerCell: Cell): void {
		if (this.IsRecording()) {
			if (src.IsAlive()) {
				const time = Date.now();
				this._record.Dates.push(time);
				this._record.Hqs
					.Get(src.Identity.Name)
					.Units.Get(src.Id)
					.States.push(
						new RecordVehicleState(
							time,
							src.GetCurrentCell().GetHexCoo(),
							RecordKind.Damage,
							src.GetCurrentLife()
						)
					);
			}
		}
	}

	private HandleVehicleCellChanged(src: Vehicle, formerCell: Cell): void {
		if (this.IsRecording()) {
			if (src.IsAlive()) {
				const time = Date.now();
				this._record.Dates.push(time);
				this._record.Hqs
					.Get(src.Identity.Name)
					.Units.Get(src.Id)
					.States.push(
						new RecordVehicleState(
							time,
							src.GetCurrentCell().GetHexCoo(),
							RecordKind.Moved,
							src.GetCurrentLife()
						)
					);
			}
		}
	}

	public GetRecord(): RecordAny {
		return RecordAny.To(this._record);
	}

	public IsRecording(): boolean {
		return this._record.EndDate === null || this._record.EndDate === undefined;
	}

	public Stop(): void {
		this._record.EndDate = Date.now();
	}
}
