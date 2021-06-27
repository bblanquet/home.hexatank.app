import { RecordCell } from './Model/Item/RecordCell';
import { Tank } from '../../Items/Unit/Tank';
import { RecordUnit } from './Model/Item/RecordUnit';
import { RecordKind } from './Model/Item/State/RecordKind';
import { RecordAny } from './Model/RecordAny';
import { GameContext } from '../../Framework/Context/GameContext';
import { GameBlueprint } from '../../Framework/Blueprint/Game/GameBlueprint';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { RecordHq } from './Model/RecordHq';
import { Cell } from '../../Items/Cell/Cell';
import { RecordVehicleState } from './Model/Item/State/RecordVehicleState';
import { Item } from '../../Items/Item';
import { FieldTypeHelper } from '../FieldTypeHelper';
import { RecordCellState } from './Model/Item/State/RecordCellState';
import { RecordContent } from './Model/RecordContent';
import { IRecordContext } from './IRecordContext';
import { StaticLogger } from '../../Utils/Logger/StaticLogger';
import { LogMessage } from '../../Utils/Logger/LogMessage';

export class RecordContext implements IRecordContext {
	private _record: RecordContent;
	private _handleVehicle: any = this.HandleVehicleCreated.bind(this);
	private _handleField: any = this.HandleFieldChanged.bind(this);
	private _handleLog: any = this.HandleLogs.bind(this);

	constructor(mapContext: GameBlueprint, private _gameContext: GameContext) {
		this._record = new RecordContent();
		this._record.PlayerName = this._gameContext.GetPlayer().Identity.Name;
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
		StaticLogger.OnMessage.On(this._handleLog);
	}

	private HandleLogs(src: any, log: LogMessage): void {
		this._record.Messages.push(log);
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

	public Stop(isVictory: boolean): void {
		StaticLogger.OnMessage.Off(this._handleLog);
		this._record.EndDate = Date.now();
		this._record.IsVictory = isVictory;
	}
}
