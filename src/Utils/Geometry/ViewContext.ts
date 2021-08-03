import { BoundingBox } from './BoundingBox';

export class ViewContext {
	public BoundingBox: BoundingBox;
	public Scale: number;
	constructor() {
		this.BoundingBox = new BoundingBox();
		this.Scale = 1;
	}

	public GetX(): number {
		return this.BoundingBox.GetX();
	}

	public GetY(): number {
		return this.BoundingBox.GetY();
	}

	public SetX(x: number): void {
		this.BoundingBox.SetX(x);
	}

	public SetY(y: number): void {
		this.BoundingBox.SetY(y);
	}
}
