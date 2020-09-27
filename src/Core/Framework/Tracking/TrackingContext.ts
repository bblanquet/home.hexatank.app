import { TrackingCell } from './TrackingCell';
import { Tank } from './../../Items/Unit/Tank';
import { TrackingUnit } from './TrackingUnit';
import { TrackingKind } from './TrackingKind';
import { TrackingObject } from './TrackingObject';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
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

export class TrackingContext {
	private _trackingHqs: Dictionnary<TrackingHq> = new Dictionnary<TrackingHq>();
	private _trackingCells: Dictionnary<TrackingCell> = new Dictionnary<TrackingCell>();
	private _points: number[] = [];
	private _refDate: number;

	constructor(private _mapContext: MapContext, private _gameContext: GameContext) {
		this._refDate = new Date().getTime();
		this._gameContext.GetHqs().forEach((hq) => {
			this._trackingHqs.Add(hq.PlayerName, new TrackingHq(hq.PlayerName, hq.GetSkin().GetColor()));
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});

		this._gameContext.GetCells().forEach((cell) => {
			const trackingCell = new TrackingCell();
			trackingCell.Coo = cell.GetCoordinate();
			trackingCell.Actions = new Array<TrackingField>();
			const action = new TrackingField(this._refDate, FieldTypeHelper.GetTrackingDescription(cell.GetField()));
			trackingCell.Actions.push(action);
			this._trackingCells.Add(cell.Coo(), trackingCell);
			cell.OnFieldChanged.On(this.HandleFieldChanged.bind(this));
		});
	}

	private GetTime(): number {
		return new Date().getTime() - this._refDate;
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		const time = this.GetTime();
		this._points.push(time);
		const action = new TrackingField(this._refDate, FieldTypeHelper.GetTrackingDescription(cell.GetField()));
		this._trackingCells.Get(cell.Coo()).Actions.push(action);
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		const time = this.GetTime();
		const trackingUnit = new TrackingUnit();
		trackingUnit.Id = vehicule.Id;
		trackingUnit.IsTank = vehicule instanceof Tank;
		this._points.push(time);
		trackingUnit.Actions.push(
			new TrackingAction(time, vehicule.GetCurrentCell().GetCoordinate(), TrackingKind.Created)
		);
		this._trackingHqs.Get(src.PlayerName).Units.Add(vehicule.Id, trackingUnit);
		vehicule.OnCellChanged.On(this.HandleVehicleCellChanged.bind(this));
		vehicule.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
	}

	private HandleVehicleDestroyed(src: Vehicle, formerCell: Item): void {
		const time = this.GetTime();
		this._points.push(time);
		this._trackingHqs
			.Get(src.Hq.PlayerName)
			.Units.Get(src.Id)
			.Actions.push(new TrackingAction(time, src.GetCurrentCell().GetCoordinate(), TrackingKind.Destroyed));
	}

	private HandleVehicleCellChanged(src: Vehicle, formerCell: Cell): void {
		const time = this.GetTime();
		this._points.push(time);
		this._trackingHqs
			.Get(src.Hq.PlayerName)
			.Units.Get(src.Id)
			.Actions.push(new TrackingAction(time, src.GetCurrentCell().GetCoordinate(), TrackingKind.Moved));
	}

	public GetTrackingObject(): TrackingObject {
		const players: any = {};
		this._trackingHqs.Keys().map((key) => {
			players[key] = this._trackingHqs.Get(key).GetJsonObject();
		});

		const obj = new TrackingObject();
		obj.Title = `save_${new Date().toLocaleTimeString()}`;
		obj.MapContext = this._mapContext;
		obj.Cells = this._trackingCells.GetValues();
		obj.Hqs = players;
		obj.Points = this._points;
		return obj;
	}
}
