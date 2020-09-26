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
			.Units.Add(vehicule.Id, new TrackingUnitValue(this.GetTime(), vehicule.GetCurrentCell().GetCoordinate()));
		vehicule.OnCellChanged.On(this.HandleVehicleCellChanged.bind(this));
	}

	private HandleVehicleCellChanged(src: Vehicle, formerCell: Cell): void {
		const time = this.GetTime();
		this._hqsTracking.Values().forEach((hqTracking) => {
			hqTracking.Units.Keys().forEach((id) => {
				this._hqsTracking
					.Get(hqTracking.Name)
					.Units.Add(
						id,
						new TrackingUnitValue(time, this._gameContext.GetUnit(id).GetCurrentCell().GetCoordinate())
					);
			});
		});
	}

	public GetTrackingObject(): any {
		const obj: any = {
			Title: `save_${new Date().toLocaleTimeString()}`,
			MapContext: this._mapContext
		};
		this._hqsTracking.Keys().forEach((key) => {
			obj[key] = this._hqsTracking.Get(key).GetJsonObject;
		});
		return obj;
	}
}
