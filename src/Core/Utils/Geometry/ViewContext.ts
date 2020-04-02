import { BoundingBox } from './BoundingBox';

export class ViewContext {
	public BoundingBox: BoundingBox;
	public Scale: number;
	constructor() {
		this.BoundingBox = new BoundingBox();
		this.Scale = 1;
	}

	public GetX(): number {
		return this.BoundingBox.X;
	}

	public GetY(): number {
		return this.BoundingBox.Y;
	}

	public SetX(x: number): void {
		this.BoundingBox.X = x;
	}

	public SetY(y: number): void {
		this.BoundingBox.Y = y;
	}
}
