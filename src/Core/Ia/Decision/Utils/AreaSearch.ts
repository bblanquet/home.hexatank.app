import { HexAxial } from './../../../Utils/Geometry/HexAxial';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class AreaSearch {
	constructor(private _coordinates: Dictionnary<HexAxial>) {}

	public GetAreas(coordinate: HexAxial): Array<HexAxial> {
		var result = new Array<HexAxial>();
		this.GetAllAreas(coordinate, result);
		return result;
	}

	private GetAllAreas(currentCoordinate: HexAxial, result: Array<HexAxial>): void {
		if (result.filter((a) => a === currentCoordinate).length === 0) {
			result.push(currentCoordinate);
			var neighs = this.GetRangeOne(currentCoordinate);
			neighs.forEach((neigh) => {
				this.GetAllAreas(neigh, result);
			});
		}
	}

	static IsBorder(coo: HexAxial, cells: Dictionnary<HexAxial>): boolean {
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
			let ngcell = this._coordinates.Get(new HexAxial(coordinate.Q + shift.Q, coordinate.R + shift.R).ToString());
			if (!isNullOrUndefined(ngcell)) {
				result.push(ngcell);
			}
		});

		return result;
	}

	public GetAreaRange(center: HexAxial, range: number): Array<HexAxial> {
		let outer = new Dictionnary<HexAxial>();
		let ignored = new Dictionnary<HexAxial>();
		let inner = Dictionnary.To<HexAxial>((e) => e.ToString(), this.GetRangeOne(center));
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
				outer = new Dictionnary<HexAxial>();
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
