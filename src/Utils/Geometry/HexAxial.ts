import { ISpot } from './ISpot';
import { HexCube } from './HexCube';
import { Point } from './Point';
/* See   */

/* Using flat-topped hexagons, "odd-q" vertical layout
 *    __    __
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 */

export class HexAxial implements ISpot<HexAxial> {
	Q: number; //column
	R: number; //row

	constructor(q: number, r: number) {
		this.Q = q;
		this.R = r;
	}
	IsEqualed(item: HexAxial): boolean {
		return item.Q === this.Q && item.R === this.R;
	}

	GetUnblockedRange(): HexAxial[] {
		return this.GetSpecificRange(1);
	}

	GetFilteredNearby(filter: (hex: HexAxial) => boolean): HexAxial[] {
		return this.GetSpecificRange(1).filter(filter);
	}

	ToString(): string {
		return `${this.Q}.${this.R}`;
	}

	ToCube(): HexCube {
		return new HexCube(this.Q, -this.Q - this.R, this.R);
	}

	ToAxial(): HexAxial {
		return new HexAxial(this.Q, this.R);
	}

	ToOffset() {
		return this.ToCube().ToOffset();
	}

	GetDistance(compare: HexAxial): number {
		return this.ToCube().GetDistance(compare.ToCube());
	}

	GetNeighbour(direction: number): HexAxial {
		var deltas = [ [ +1, -1 ], [ +1, 0 ], [ 0, +1 ], [ -1, +1 ], [ -1, 0 ], [ 0, -1 ] ];
		return new HexAxial(this.Q + deltas[direction][0], this.R + deltas[direction][1]);
	}

	GetNeighbours(range: number = 1): HexAxial[] {
		var results = new Array<HexAxial>();
		var cube = this.ToCube();
		for (let x = -range; x <= range; x++) {
			for (let y = Math.max(-range, -x - range); y <= Math.min(range, -x + range); y++) {
				var z = -x - y;
				const coordinate = new HexCube(cube.X + x, cube.Y + y, cube.Z + z);
				if (cube.X !== coordinate.X || cube.Y !== coordinate.Y || cube.Z !== coordinate.Z) {
					results.push(coordinate.ToAxial());
				}
			}
		}
		return results;
	}

	GetSpecificRange(range: number = 1): HexAxial[] {
		if (range === 0) {
			return [ this ];
		}

		var results = new Array<HexCube>();
		var cube = this.ToCube();

		//this code doesn't work for radius == 0; can you see why?
		for (let i = 0; i < range; i++) {
			cube = cube.GetNeighbour(4);
		}

		for (let x = 0; x < 6; x++) {
			for (let j = 0; j < range; j++) {
				results.push(cube);
				cube = cube.GetNeighbour(x);
			}
		}
		return results.map((v) => v.ToAxial());
	}

	ToPixel(size: number): Point {
		// size is option, see HexCube method
		return this.ToCube().ToPixel(size);
	}
}
