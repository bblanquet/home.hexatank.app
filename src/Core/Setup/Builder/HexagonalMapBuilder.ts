import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { CellProperties } from '../../Items/Cell/CellProperties';

export class HexagonalMapBuilder implements IPlaygroundBuilder {
	private GetIgnoredcell(n: number): Array<number> {
		const result = new Array<number>();

		const leftEdge = n / 2 - 1;
		for (let index = 0; index <= leftEdge; index++) {
			result.push(index);
		}

		const rightEdge = n + n / 2 + 1;
		for (let index = rightEdge; index <= n * 2; index++) {
			result.push(index);
		}

		return result;
	}

	public GetAreaMiddlecell(n: number): Array<HexAxial> {
		return [
			new HexAxial(1, n / 2),
			new HexAxial(n - 1, n / 2), //column,row
			new HexAxial(n / 2, 1),
			new HexAxial(n - 1, 1),
			new HexAxial(1, n - 1),
			new HexAxial(n / 2, n - 1)
		];
	}

	public GetMidle(n: number): HexAxial {
		return new HexAxial(n / 2, n / 2);
	}

	public Build(n: number): HexAxial[] {
		if (n < 2) {
			throw new Error();
		}

		if (n % 2 !== 0) {
			throw new Error();
		}

		var cells = new Array<HexAxial>();
		const ignoredCoordinates = this.GetIgnoredcell(n);

		for (let row = 0; row <= n; row++) {
			for (let column = 0; column <= n; column++) {
				if (ignoredCoordinates.indexOf(row + column) === -1) {
					var hexAxial = new HexAxial(column, row);
					cells.push(hexAxial);
				}
			}
		}

		return cells;
	}
}
