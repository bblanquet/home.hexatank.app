import { LiteEvent } from '../Events/LiteEvent';
import { Point } from './Point';

export class BoundingBox {
	private X: number;
	private Y: number;
	private Width: number;
	private Height: number;

	public OnXChanged: LiteEvent<number>;
	public OnYChanged: LiteEvent<number>;

	constructor() {
		this.X = 0;
		this.Y = 0;
		this.Width = 0;
		this.Height = 0;
		this.OnXChanged = new LiteEvent<number>();
		this.OnYChanged = new LiteEvent<number>();
	}

	GetX(): number {
		return this.X;
	}

	GetY(): number {
		return this.Y;
	}

	GetWidth(): number {
		return this.Width;
	}

	GetHeight(): number {
		return this.Height;
	}

	public static New(x: number, y: number, width: number, height: number): BoundingBox {
		let b = new BoundingBox();
		b.X = x;
		b.Y = y;
		b.Width = width;
		b.Height = height;
		return b;
	}

	public static NewFromBox(a: BoundingBox): BoundingBox {
		let b = new BoundingBox();
		b.X = a.X;
		b.Y = a.Y;
		b.Width = a.Width;
		b.Height = a.Height;
		return b;
	}

	public static NewFromBoxAndPoint(a: BoundingBox, x: number, y: number): BoundingBox {
		let b = new BoundingBox();
		b.X = a.X + x;
		b.Y = a.Y + y;
		b.Width = a.Width;
		b.Height = a.Height;
		return b;
	}

	public SetPosition(point: Point): void {
		this.SetX(point.X);
		this.SetY(point.Y);
	}

	public SetX(x: number): void {
		const formerX = this.X;
		this.X = x;
		this.OnXChanged.Invoke(this, formerX);
	}

	public SetY(y: number): void {
		const formerY = this.Y;
		this.Y = y;
		this.OnYChanged.Invoke(this, formerY);
	}

	SetWidth(width: number): void {
		this.Width = width;
	}

	SetHeight(height: number): void {
		this.Height = height;
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
