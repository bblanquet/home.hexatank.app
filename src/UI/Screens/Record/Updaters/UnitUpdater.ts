import { IndexFinder } from './IndexFinder';
import { RecordKind } from '../../../../Core/Framework/Record/Model/Item/State/RecordKind';
import { Headquarter } from '../../../../Core/Items/Cell/Field/Hq/Headquarter';
import { HexAxial } from '../../../../Core/Utils/Geometry/HexAxial';
import { Vehicle } from '../../../../Core/Items/Unit/Vehicle';
import { Dictionary } from '../../../../Core/Utils/Collections/Dictionary';
import { Tank } from '../../../../Core/Items/Unit/Tank';
import { Truck } from '../../../../Core/Items/Unit/Truck';
import { GameContext } from '../../../../Core/Framework/Context/GameContext';
import { RecordContent } from '../../../../Core/Framework/Record/Model/RecordContent';
import { isNullOrUndefined } from '../../../../Core/Utils/ToolBox';

export class UnitUpdater {
	private _displayedUnits: Dictionary<Vehicle>;
	private _indexFinder: IndexFinder;

	constructor(private _ref: RecordContent, private _gameContext: GameContext) {
		this._indexFinder = new IndexFinder();
		this._displayedUnits = new Dictionary<Vehicle>();
	}

	public Update(date: number) {
		const unitDeltas = this.GetActiveUnits(date);
		this.UpdateActiveUnits(unitDeltas);
	}

	private UpdateActiveUnits(units: Dictionary<{ Axial: HexAxial; Hq: Headquarter; IsTank: boolean; Life: number }>) {
		units.Keys().forEach((unitId) => {
			const coo = units.Get(unitId).Axial.ToString();
			const cell = this._gameContext.GetCell(coo);
			if (this._displayedUnits.Exist(unitId)) {
				if (this._displayedUnits.Get(unitId).GetCurrentCell().Coo() !== coo) {
					this._displayedUnits.Get(unitId).SetPosition(cell);
				}
			} else {
				let v: Vehicle = units.Get(unitId).IsTank
					? new Tank(units.Get(unitId).Hq.Identity, true)
					: new Truck(units.Get(unitId).Hq.Identity, true);
				v.Id = unitId;
				v.SetPosition(cell);
				this._displayedUnits.Add(unitId, v);
			}
			if (0 < units.Get(unitId).Life) {
				if (this._displayedUnits.Get(unitId).GetCurrentLife() !== units.Get(unitId).Life) {
					this._displayedUnits.Get(unitId).SetCurrentLife(units.Get(unitId).Life);
				}
			}
			this._displayedUnits.Get(unitId).SetVisible(true);
		});

		this._displayedUnits.Keys().forEach((unitId) => {
			if (!units.Exist(unitId)) {
				const unit = this._displayedUnits.Get(unitId);
				unit.SetVisible(false);
			}
		});
	}

	private GetActiveUnits(date: number) {
		const coos = new Dictionary<{
			Axial: HexAxial;
			Hq: Headquarter;
			IsTank: boolean;
			Life: number;
		}>();
		this._ref.Hqs.Values().forEach((hq) => {
			hq.Units.Keys().forEach((key) => {
				if (hq.Units.Get(key).States) {
					const dates = hq.Units.Get(key).States.map((a) => a.X);
					const dateIndex = this._indexFinder.GetIndex(date, dates);
					if (!isNullOrUndefined(dateIndex)) {
						const action = hq.Units.Get(key).States[dateIndex];
						if (+action.kind !== RecordKind.Destroyed) {
							coos.Add(key, {
								Axial: new HexAxial(action.Amount.Q, action.Amount.R),
								Hq: this._gameContext.GetHqs().find((c) => c.Identity.Name === hq.Name),
								IsTank: hq.Units.Get(key).IsTank,
								Life: action.life
							});
						}
					}
				}
			});
		});
		return coos;
	}
}
