import { HexAxial } from './HexAxial';
import { HexOffset } from './HexOffset';
import { Point } from './Point';

/* See http://www.redblobgames.com/grids/hexagons/ */

/* Using flat-topped hexagons, "odd-q" vertical layout
 *    __    __
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 */

export class HexCube {
	X: number;
	Y: number;
	Z: number;

	constructor(x: number, y: number, z: number) {
		this.X = x;
		this.Y = y;
		this.Z = z;
	}

	ToString(): string {
		return 'HexCube(' + [ this.X, this.Y, this.Z ].toString() + ')';
	}

	ToCube(): HexCube {
		return new HexCube(this.X, this.Y, this.Z);
	}

	ToAxial(): HexAxial {
		return new HexAxial(this.X, this.Y);
	}

	ToOffset(): HexOffset {
		var m = this.Z + (this.Y - Math.abs(this.X) % 2) / 2;
		var n = this.X;
		return new HexOffset(m, n);
	}

	Abs(): number {
		return Math.abs(this.X) + Math.abs(this.Y) + Math.abs(this.Z);
	}

	IsLegal(): Boolean {
		// better name?
		// the sum of the coordinates must be zero
		return this.X + this.Y + this.Z === 0 ? true : false;
	}

	Round(): HexCube {
		var rx = Math.round(this.X);
		var ry = Math.round(this.Y);
		var rz = Math.round(this.Z);

		var dx = Math.abs(rx - this.X);
		var dy = Math.abs(ry - this.Y);
		var dz = Math.abs(rz - this.Z);

		if (dx > dy && dx > dz) {
			rx = -ry - rz;
		} else if (dy > dz) {
			ry = -rx - rz;
		} else {
			rz = -rx - ry;
		}

		return new HexCube(rx, ry, rz);
	}

	GetNeighbour(direction: number): HexCube {
		var deltas = [ [ +1, -1, 0 ], [ +1, 0, -1 ], [ 0, +1, -1 ], [ -1, +1, 0 ], [ -1, 0, +1 ], [ 0, -1, +1 ] ];
		return new HexCube(this.X + deltas[direction][0], this.Y + deltas[direction][1], this.Z + deltas[direction][2]);
	}

	GetNeighbours(): Array<HexCube> {
		var result = new Array<HexCube>();
		var deltas = [ [ +1, -1, 0 ], [ +1, 0, -1 ], [ 0, +1, -1 ], [ -1, +1, 0 ], [ -1, 0, +1 ], [ 0, -1, +1 ] ];
		deltas.forEach((delta) => {
			result.push(new HexCube(this.X + delta[0], this.Y + delta[1], this.Z + delta[2]));
		});

		return result;
	}

	ToPixel(size: number): Point {
		// size is the distance between the center and a corner.
		// Default is 1 if not given
		if (!size) {
			size = 1;
		}

		const x = size * 3 / 2 * this.X;
		const y = size * Math.sqrt(3) * (this.Y + this.X / 2);
		return new Point(x, y);
	}

	GetDistance(b: HexCube): number {
		return (Math.abs(this.X - b.X) + Math.abs(this.Y - b.Y) + Math.abs(this.Z - b.Z)) / 2;
	}
}
