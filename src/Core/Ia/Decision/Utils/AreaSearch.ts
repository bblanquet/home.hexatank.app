import { HexAxial } from './../../../../Utils/Geometry/HexAxial';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { ErrorHandler } from '../../../../Utils/Exceptions/ErrorHandler';

export class AreaSearch {
	constructor(private _hexCoos: Dictionary<HexAxial>) {}

	public GetAreas(coordinate: HexAxial): Array<HexAxial> {
		ErrorHandler.ThrowNullOrUndefined(coordinate);

		var result = new Array<HexAxial>();
		this.GetAllAreas(coordinate, result);
		return result;
	}

	private GetAllAreas(currentCoo: HexAxial, result: Array<HexAxial>): void {
		ErrorHandler.ThrowNullOrUndefined(currentCoo);
		if (result.every((a) => !a.IsEqualed(currentCoo))) {
			result.push(currentCoo);
		}

		if (currentCoo.Q === 2 && currentCoo.R === 10) {
			const b = 0;
		}

		this.GetRangeOne(currentCoo).forEach((neigh) => {
			if (result.every((a) => !a.IsEqualed(neigh))) {
				this.GetAllAreas(neigh, result);
			}
		});
	}

	static IsBorder(coo: HexAxial, cells: Dictionary<HexAxial>): boolean {
		var shifts = [
			{ Q: -1, R: -2 },
			{ Q: 2, R: -3 },
			{ Q: 3, R: -1 },
			{ Q: 1, R: 2 },
			{ Q: -2, R: 3 },
			{ Q: -3, R: 1 }
		];
		return !shifts.every((c) => cells.Exist(new HexAxial(coo.Q + c.Q, coo.R + c.R).ToString()));
	}

	private GetRangeOne(coordinate: HexAxial): Array<HexAxial> {
		var result = new Array<HexAxial>();
		var shifts = [
			{ Q: -1, R: -2 },
			{ Q: 2, R: -3 },
			{ Q: 3, R: -1 },
			{ Q: 1, R: 2 },
			{ Q: -2, R: 3 },
			{ Q: -3, R: 1 }
		];

		shifts.forEach((shift) => {
			const key = new HexAxial(coordinate.Q + shift.Q, coordinate.R + shift.R).ToString();
			let ngCoo = this._hexCoos.Get(key);
			if (!isNullOrUndefined(ngCoo)) {
				result.push(ngCoo);
			}
		});

		return result;
	}

	public GetAreaRange(center: HexAxial, range: number): Array<HexAxial> {
		let outer = new Dictionary<HexAxial>();
		let ignored = new Dictionary<HexAxial>();
		let inner = Dictionary.To<HexAxial>((e) => e.ToString(), this.GetRangeOne(center));
		let currentRange = 1;

		if (range === currentRange) {
			return inner.Values();
		}

		inner.Add(center.ToString(), center);

		while (outer.Values().length === 0) {
			inner.Values().forEach((i) => {
				if (!ignored.Exist(i.ToString())) {
					ignored.Add(i.ToString(), i);
				}
			});

			inner.Values().forEach((innercell) => {
				this.GetRangeOne(innercell).forEach((outcell) => {
					if (!ignored.Exist(outcell.ToString())) {
						outer.Add(outcell.ToString(), outcell);
					}
				});
			});

			currentRange += 1;

			if (outer.IsEmpty()) {
				return [];
			}

			if (currentRange < range) {
				inner = outer;
				outer = new Dictionary<HexAxial>();
			}
		}

		return outer.Values();
	}

	public GetIncludedFirstRange(center: HexAxial): Array<HexAxial> {
		let innerCircle = this.GetRangeOne(center);
		innerCircle.push(center);
		return innerCircle;
	}

	public GetIncludedSecondRange(center: HexAxial): Array<HexAxial> {
		let outerCircle = new Array<HexAxial>();
		let innerCircle = this.GetRangeOne(center);

		innerCircle.forEach((innercell) => {
			this.GetRangeOne(innercell).forEach((outcell) => {
				outerCircle.push(outcell);
			});
		});

		return outerCircle.filter((v) => innerCircle.indexOf(v) === -1);
	}
}
