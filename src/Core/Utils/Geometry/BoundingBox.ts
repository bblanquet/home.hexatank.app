import { Point } from './Point';

export class BoundingBox {
	X: number;
	Y: number;
	Width: number;
	Height: number;

	constructor() {
		this.X = 0;
		this.Y = 0;
		this.Width = 0;
		this.Height = 0;
	}

	public static Create(x: number, y: number, width: number, height: number): BoundingBox {
		let b = new BoundingBox();
		b.X = x;
		b.Y = y;
		b.Width = width;
		b.Height = height;
		return b;
	}

	public static CreateFromBox(a: BoundingBox): BoundingBox {
		let b = new BoundingBox();
		b.X = a.X;
		b.Y = a.Y;
		b.Width = a.Width;
		b.Height = a.Height;
		return b;
	}

	public SetPosition(point: Point): void {
		this.X = point.X;
		this.Y = point.Y;
	}

	public GetCenter(): number {
		return this.X + this.Width / 2;
	}

	public GetMiddle(): number {
		return this.Y + this.Height / 2;
	}

	public GetPosition(): Point {
		return new Point(this.X, this.Y);
	}

	public GetCentralPoint(): Point {
		return new Point(this.GetCenter(), this.GetMiddle());
	}

	public Contains(point: { X: number; Y: number }): boolean {
		return (
			this.X <= point.X && point.X <= this.X + this.Width && this.Y <= point.Y && point.Y <= this.Y + this.Height
		);
	}

	public ToString(): String {
		return `x${this.X} y${this.Y} w${this.Width} h${this.Height}`;
	}
}
