import { TrackingData } from './../../Core/Framework/Tracking/TrackingData';
import { Headquarter } from './../../Core/Items/Cell/Field/Hq/Headquarter';
import { GameContext } from './../../Core/Framework/GameContext';
import { HexAxial } from './../../Core/Utils/Geometry/HexAxial';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Tank } from '../../Core/Items/Unit/Tank';
import { TrackingKind } from '../../Core/Framework/Tracking/TrackingKind';
import { Truck } from '../../Core/Items/Unit/Truck';
export class LightCanvasUpdater {
	private _displayedUnits: Dictionnary<Vehicle>;

	constructor(private _trackingRef: TrackingData, private _gameContext: GameContext) {
		this._displayedUnits = new Dictionnary<Vehicle>();
	}

	public SetDate(date: number): void {
		const coos = new Dictionnary<{ Axial: HexAxial; Hq: Headquarter; IsTank: boolean }>();
		this._trackingRef.TrackingHq.Values().forEach((hq) => {
			hq.Units.Keys().forEach((key) => {
				const dates = hq.Units.Get(key).Actions.map((a) => a.X);
				const dateIndex = this.GetIndex(date, dates);
				if (dateIndex) {
					const action = hq.Units.Get(key).Actions[dateIndex];
					if (+action.kind !== +TrackingKind.Destroyed) {
						coos.Add(key, {
							Axial: new HexAxial(action.Amount.Q, action.Amount.R),
							Hq: this._gameContext.GetHqs().find((c) => c.PlayerName === hq.Name),
							IsTank: hq.Units.Get(key).IsTank
						});
					}
				}
			});
		});

		this._displayedUnits.Keys().forEach((key) => {
			if (!coos.Exist(key)) {
				this._displayedUnits.Get(key).Destroy();
				this._displayedUnits.Remove(key);
			}
		});

		coos.Keys().forEach((key) => {
			const cell = this._gameContext.GetCell(coos.Get(key).Axial.ToString());
			if (this._displayedUnits.Exist(key)) {
				this._displayedUnits.Get(key).SetPosition(cell);
			} else {
				let v: Vehicle = null;
				if (coos.Get(key).IsTank) {
					v = new Tank(coos.Get(key).Hq, this._gameContext, true);
				} else {
					v = new Truck(coos.Get(key).Hq, this._gameContext, true);
				}
				v.Id = key;
				v.SetPosition(cell);
				this._displayedUnits.Add(key, v);
			}
		});
	}

	public GetIndex(value: number, list: number[]): number {
		var mid;
		var low = 0;
		var high = list.length - 1;
		while (1 < high - low) {
			mid = Math.floor((low + high) / 2);
			if (list[mid] < value) {
				low = mid;
			} else {
				high = mid;
			}
		}

		if (list[high] < value) {
			return high;
		}

		return low;
	}
}
