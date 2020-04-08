import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { isNullOrUndefined } from 'util';

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
			var neighs = this.GetExcludedFirstRange(currentCoordinate);
			neighs.forEach((neigh) => {
				this.GetAllAreas(neigh, result);
			});
		}
	}

	public GetExcludedFirstRange(coordinate: HexAxial): Array<HexAxial> {
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

	public GetIncludedFirstRange(center: HexAxial): Array<HexAxial> {
		let innerCircle = this.GetExcludedFirstRange(center);
		innerCircle.push(center);
		return innerCircle;
	}

	public GetIncludedSecondRange(center: HexAxial): Array<HexAxial> {
		let outerCircle = new Array<HexAxial>();
		let innerCircle = this.GetExcludedFirstRange(center);

		innerCircle.forEach((innercell) => {
			this.GetExcludedFirstRange(innercell).forEach((outcell) => {
				outerCircle.push(outcell);
			});
		});

		return outerCircle.filter((v) => innerCircle.indexOf(v) === -1);
	}
}
