import { TrackingObject } from './TrackingObject';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { GameContext } from './../GameContext';
import { MapContext } from './../../Setup/Generator/MapContext';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { TrackingHqValue } from './TrackingHqValue';
import { Cell } from '../../Items/Cell/Cell';
import { TrackingUnitValue } from './TrackingUnitValue';

export class TrackingContext {
	private _hqsTracking: Dictionnary<TrackingHqValue> = new Dictionnary<TrackingHqValue>();
	private _refDate: number;

	constructor(private _mapContext: MapContext, private _gameContext: GameContext) {
		this._refDate = new Date().getTime();
		this._gameContext.GetHqs().forEach((hq) => {
			this._hqsTracking.Add(hq.PlayerName, new TrackingHqValue(hq.PlayerName, hq.GetSkin().GetColor()));
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});
	}

	private GetTime(): number {
		return new Date().getTime() - this._refDate;
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		this._hqsTracking
			.Get(src.PlayerName)
			.Units.Add(vehicule.Id, [
				new TrackingUnitValue(this.GetTime(), vehicule.GetCurrentCell().GetCoordinate())
			]);
		vehicule.OnCellChanged.On(this.HandleVehicleCellChanged.bind(this));
	}

	private HandleVehicleCellChanged(src: Vehicle, formerCell: Cell): void {
		const time = this.GetTime();
		this._hqsTracking.Values().forEach((hq) => {
			hq.Units.Keys().forEach((unitKey) => {
				hq.Units
					.Get(unitKey)
					.push(
						new TrackingUnitValue(time, this._gameContext.GetUnit(unitKey).GetCurrentCell().GetCoordinate())
					);
			});
		});
	}

	public GetTrackingObject(): TrackingObject {
		const players: any = {};
		this._hqsTracking.Keys().map((key) => {
			players[key] = this._hqsTracking.Get(key).GetJsonObject();
		});

		const obj = new TrackingObject();
		obj.Title = `save_${new Date().toLocaleTimeString()}`;
		obj.MapContext = this._mapContext;
		obj.Players = players;
		return obj;
	}
}
