import { HexCube } from './HexCube';
import { HexAxial } from './HexAxial';
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

export class HexOffset {
	M: number;
	N: number;

	constructor(m: number, n: number) {
		this.M = m;
		this.N = n;
	}

	ToString(): string {
		return 'HexOffset(' + [ this.M, this.N ].toString() + ')';
	}

	ToCube(): HexCube {
		var x = this.N;
		var z = this.M - (this.N - Math.abs(this.N) % 2) / 2;
		var y = -x - z;
		return new HexCube(x, y, z);
	}

	ToAxial(): HexAxial {
		return this.ToCube().ToAxial();
	}

	ToOffset(): HexOffset {
		return new HexOffset(this.M, this.N);
	}

	GetNeighbour(direction: number): HexOffset {
		// Offset coordinates has different sub type, convert to cube for agnostic method
		return this.ToCube().GetNeighbour(direction).ToOffset();
	}

	ToPixel(size: number): Point {
		// size is option, see HexCube method
		return this.ToCube().ToPixel(size);
	}
}
