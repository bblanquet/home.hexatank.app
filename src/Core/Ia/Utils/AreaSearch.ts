import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { isNullOrUndefined } from 'util';

export class AreaSearch {
	public GetAreas(coordinates: Dictionnary<HexAxial>, coordinate: HexAxial): Array<HexAxial> {
		var result = new Array<HexAxial>();
		this.GetAllAreas(coordinates, coordinate, result);
		return result;
	}

	private GetAllAreas(
		coordinates: Dictionnary<HexAxial>,
		currentCoordinate: HexAxial,
		result: Array<HexAxial>
	): void {
		if (result.filter((a) => a === currentCoordinate).length === 0) {
			result.push(currentCoordinate);
			var neighs = this.GetExcludedFirstRange(coordinates, currentCoordinate);
			neighs.forEach((neigh) => {
				this.GetAllAreas(coordinates, neigh, result);
			});
		}
	}

	public GetExcludedFirstRange(coordinates: Dictionnary<HexAxial>, coordinate: HexAxial): Array<HexAxial> {
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
			let ngcell = coordinates.Get(new HexAxial(coordinate.Q + shift.Q, coordinate.R + shift.R).ToString());
			if (!isNullOrUndefined(ngcell)) {
				result.push(ngcell);
			}
		});

		return result;
	}

	public GetIncludedFirstRange(container: Dictionnary<HexAxial>, center: HexAxial): Array<HexAxial> {
		let innerCircle = this.GetExcludedFirstRange(container, center);
		innerCircle.push(center);
		return innerCircle;
	}

	public GetIncludedSecondRange(container: Dictionnary<HexAxial>, center: HexAxial): Array<HexAxial> {
		let outerCircle = new Array<HexAxial>();
		let innerCircle = this.GetExcludedFirstRange(container, center);

		innerCircle.forEach((innercell) => {
			this.GetExcludedFirstRange(container, innercell).forEach((outcell) => {
				outerCircle.push(outcell);
			});
		});

		return outerCircle.filter((v) => innerCircle.indexOf(v) === -1);
	}
}
