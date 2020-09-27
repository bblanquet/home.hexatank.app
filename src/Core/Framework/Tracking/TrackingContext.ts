import { TrackingCell } from './TrackingCell';
import { Tank } from './../../Items/Unit/Tank';
import { TrackingUnit } from './TrackingUnit';
import { TrackingKind } from './TrackingKind';
import { TrackingObject } from './TrackingObject';
import { GameContext } from './../GameContext';
import { MapContext } from './../../Setup/Generator/MapContext';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { TrackingHq } from './TrackingHq';
import { Cell } from '../../Items/Cell/Cell';
import { TrackingAction } from './TrackingAction';
import { Item } from '../../Items/Item';
import { FieldTypeHelper } from '../Packets/FieldTypeHelper';
import { TrackingField } from './TrackingField';
import { TrackingData } from './TrackingData';

export class TrackingContext {
	private _data: TrackingData;
	private _refDate: number;

	constructor(private _mapContext: MapContext, private _gameContext: GameContext) {
		this._refDate = new Date().getTime();
		this._data = new TrackingData();

		this._gameContext.GetHqs().forEach((hq) => {
			this._data.Hqs.Add(hq.PlayerName, new TrackingHq(hq.PlayerName, hq.GetSkin().GetColor()));
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});

		const time = this.GetTime();
		this._data.Dates.push(time);
		this._gameContext.GetCells().forEach((cell) => {
			const action = new TrackingField(time, FieldTypeHelper.GetTrackingDescription(cell.GetField()));
			if (action.kind !== TrackingKind.None) {
				const trackingCell = new TrackingCell();
				trackingCell.Actions = new Array<TrackingField>();
				trackingCell.Actions.push(action);
				this._data.Cells.Add(cell.Coo(), trackingCell);
				cell.OnFieldChanged.On(this.HandleFieldChanged.bind(this));
			}
		});
	}

	private GetTime(): number {
		return new Date().getTime() - this._refDate;
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		const time = this.GetTime();
		this._data.Dates.push(time);
		const action = new TrackingField(time, FieldTypeHelper.GetTrackingDescription(cell.GetField()));
		this._data.Cells.Get(cell.Coo()).Actions.push(action);
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		const time = this.GetTime();
		const trackingUnit = new TrackingUnit();
		trackingUnit.Id = vehicule.Id;
		trackingUnit.IsTank = vehicule instanceof Tank;
		this._data.Dates.push(time);
		trackingUnit.Actions.push(
			new TrackingAction(
				time,
				vehicule.GetCurrentCell().GetCoordinate(),
				TrackingKind.Created,
				src.GetCurrentLife()
			)
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
				new TrackingAction(
					time,
					src.GetCurrentCell().GetCoordinate(),
					TrackingKind.Destroyed,
					src.GetCurrentLife()
				)
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
					new TrackingAction(
						time,
						src.GetCurrentCell().GetCoordinate(),
						TrackingKind.Moved,
						src.GetCurrentLife()
					)
				);
		}
	}

	public GetTrackingObject(): TrackingObject {
		const players: any = {};
		this._data.Hqs.Keys().map((key) => {
			players[key] = this._data.Hqs.Get(key).GetJsonObject();
		});

		const obj = new TrackingObject();
		obj.Title = `save_${new Date().toLocaleTimeString()}`;
		obj.MapContext = this._mapContext;
		obj.Cells = this._data.Cells.GetValues();
		obj.Hqs = players;
		obj.Points = this._data.Dates;
		return obj;
	}
}
