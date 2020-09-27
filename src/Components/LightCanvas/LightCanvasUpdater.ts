import { isNullOrUndefined } from 'util';
import { FieldTypeHelper } from './../../Core/Framework/Packets/FieldTypeHelper';
import { TrackingKind } from './../../Core/Framework/Tracking/TrackingKind';
import { IField } from './../../Core/Items/Cell/Field/IField';
import { TrackingData } from './../../Core/Framework/Tracking/TrackingData';
import { Headquarter } from './../../Core/Items/Cell/Field/Hq/Headquarter';
import { GameContext } from './../../Core/Framework/GameContext';
import { HexAxial } from './../../Core/Utils/Geometry/HexAxial';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
export class LightCanvasUpdater {
	private _displayedUnits: Dictionnary<Vehicle>;
	private _displayedFields: Dictionnary<IField>;

	constructor(private _ref: TrackingData, private _gameContext: GameContext) {
		this._displayedUnits = new Dictionnary<Vehicle>();
		this._displayedFields = new Dictionnary<IField>();
		this._gameContext.GetCells().forEach((c) => {
			this._displayedFields.Add(c.Coo(), c.GetField());
		});
	}

	public SetDate(date: number): void {
		const coos = this.GetActiveUnits(date);
		this.UpdateActiveUnits(coos);

		const fieldCoos = this.GetActiveFields(date);
		this.UpdateActiveField(fieldCoos);
	}

	private UpdateActiveUnits(coos: Dictionnary<{ Axial: HexAxial; Hq: Headquarter; IsTank: boolean; Life: number }>) {
		this._displayedUnits.Keys().forEach((key) => {
			if (!coos.Exist(key)) {
				this._displayedUnits.Get(key).Destroy();
				this._displayedUnits.Remove(key);
			}
		});

		coos.Keys().forEach((key) => {
			const cell = this._gameContext.GetCell(coos.Get(key).Axial.ToString());
			if (this._displayedUnits.Exist(key)) {
				this._displayedUnits.Get(key).Destroy();
				this._displayedUnits.Remove(key);
			}
			let v: Vehicle = null;
			if (coos.Get(key).IsTank) {
				v = new Tank(coos.Get(key).Hq, this._gameContext, true);
				v.SetCurrentLife(coos.Get(key).Life);
			} else {
				v = new Truck(coos.Get(key).Hq, this._gameContext, true);
				v.SetCurrentLife(coos.Get(key).Life);
			}
			v.Id = key;
			v.SetPosition(cell);
			this._displayedUnits.Add(key, v);
		});
	}

	private GetActiveUnits(date: number) {
		const coos = new Dictionnary<{ Axial: HexAxial; Hq: Headquarter; IsTank: boolean; Life: number }>();
		this._ref.Hqs.Values().forEach((hq) => {
			hq.Units.Keys().forEach((key) => {
				const dates = hq.Units.Get(key).Actions.map((a) => a.X);
				const dateIndex = this.GetIndex(date, dates);
				if (!isNullOrUndefined(dateIndex)) {
					const action = hq.Units.Get(key).Actions[dateIndex];
					if (+action.kind !== +TrackingKind.Destroyed) {
						coos.Add(key, {
							Axial: new HexAxial(action.Amount.Q, action.Amount.R),
							Hq: this._gameContext.GetHqs().find((c) => c.PlayerName === hq.Name),
							IsTank: hq.Units.Get(key).IsTank,
							Life: action.life
						});
					}
				}
			});
		});
		return coos;
	}

	private GetActiveFields(date: number) {
		const coos = new Dictionnary<{ Axial: HexAxial; Action: TrackingKind }>();
		this._ref.Cells.Keys().forEach((coo) => {
			const cell = this._ref.Cells.Get(coo);
			const dates = cell.Actions.map((a) => a.X);
			const dateIndex = this.GetIndex(date, dates);
			if (!isNullOrUndefined(dateIndex)) {
				const action = cell.Actions[dateIndex];
				coos.Add(coo, {
					Axial: this._gameContext.GetCell(coo).GetCoordinate(),
					Action: action.kind
				});
			}
		});
		return coos;
	}

	private UpdateActiveField(coos: Dictionnary<{ Axial: HexAxial; Action: TrackingKind }>) {
		coos.Keys().forEach((key) => {
			const fieldAction = FieldTypeHelper.GetTrackingDescription(this._displayedFields.Get(key));
			if (fieldAction !== coos.Get(key).Action) {
				const field = FieldTypeHelper.CreateTrackingField(
					coos.Get(key).Action,
					this._gameContext.GetCell(key),
					this._gameContext.GetMainHq(),
					this._gameContext
				);
				this._displayedFields.Add(key, field);
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
