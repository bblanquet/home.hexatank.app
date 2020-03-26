import { LiteEvent } from '../Utils/Events/LiteEvent';
import { ViewContext } from '../Utils/Geometry/ViewContext';

export class ScaleHandler {
	private _viewContext: ViewContext = new ViewContext();
	public ScaleChanged: LiteEvent<boolean> = new LiteEvent<boolean>();

	public isZoomIn(): boolean {
		return this._viewContext.Scale > 1.4;
	}

	public GetX(): number {
		return this._viewContext.BoundingBox.X;
	}

	public GetY(): number {
		return this._viewContext.BoundingBox.Y;
	}

	public SetX(x: number): void {
		this._viewContext.BoundingBox.X = x;
	}

	public SetY(y: number): void {
		this._viewContext.BoundingBox.Y = y;
	}

	public ChangeScale(scale: number) {
		const previousScale = this._viewContext.Scale;
		this._viewContext.Scale = scale;
		console.log('scale ' + scale);
		if (previousScale > 1.4 !== this._viewContext.Scale > 1.4) {
			this.ScaleChanged.Invoke((this, this.isZoomIn()));
		}
	}
}
