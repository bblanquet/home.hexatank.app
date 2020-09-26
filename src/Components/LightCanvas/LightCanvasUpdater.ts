import { Headquarter } from './../../Core/Items/Cell/Field/Hq/Headquarter';
import { GameContext } from './../../Core/Framework/GameContext';
import { isNullOrUndefined } from 'util';
import { HexAxial } from './../../Core/Utils/Geometry/HexAxial';
import { TrackingHqValue } from '../../Core/Framework/Tracking/TrackingHqValue';
import { Cell } from '../../Core/Items/Cell/Cell';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Tank } from '../../Core/Items/Unit/Tank';
export class LightCanvasUpdater {
	private _displayedUnits: Dictionnary<Vehicle>;
	private _displayedCells: Dictionnary<Cell>;
	constructor(private _trackingRef: Dictionnary<TrackingHqValue>, private _gameContext: GameContext) {
		this._displayedUnits = new Dictionnary<Vehicle>();
	}

	public SetDate(date: number) {
		const coos = new Dictionnary<{ Axial: HexAxial; Hq: Headquarter }>();
		this._trackingRef.Values().forEach((hq) => {
			hq.Units.Keys().forEach((key) => {
				const position = hq.Units.Get(key).find((d) => d.X === +date);
				if (!isNullOrUndefined(position)) {
					coos.Add(key, {
						Axial: new HexAxial(position.Amount.Q, position.Amount.R),
						Hq: this._gameContext.GetHqs().find((c) => c.PlayerName === hq.Name)
					});
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
				const tank = new Tank(coos.Get(key).Hq, this._gameContext);
				tank.Id = key;
				tank.SetPosition(cell);
				this._displayedUnits.Add(key, tank);
			}
		});
	}
}
