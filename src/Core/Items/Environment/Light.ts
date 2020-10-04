import { ZKind } from './../ZKind';
import { Item } from '../Item';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { Archive } from '../../Framework/ResourceArchiver';

export class Light extends Item {
	private _boundingBox: BoundingBox;
	private _isVisible: boolean;
	private _lightIndex: number;

	constructor(boundingBox: BoundingBox) {
		super();
		this.Z = ZKind.AboveCell;
		this._boundingBox = boundingBox;
		this._lightIndex = 0;
		Archive.lights.forEach((light) => {
			this.GenerateSprite(light, (s) => {
				s.alpha = 0;
			});
		});
		this._isVisible = false;
		this.InitPosition(boundingBox);
	}

	public Destroy(): void {
		super.Destroy();
		this.IsUpdatable = false;
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}

	public IsVisible(): boolean {
		return this._isVisible;
	}

	public Display(): void {
		this._isVisible = true;
		Archive.lights.forEach((l) => this.SetProperty(l, (s) => (s.alpha = 0)));
		this.SetProperty(Archive.lights[0], (e) => (e.alpha = 1));
		this._lightIndex = 0;
	}

	public Hide() {
		this._isVisible = false;
		Archive.lights.forEach((l) => this.SetProperty(l, (s) => (s.alpha = 0)));
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (this._isVisible) {
			this.SetProperty(Archive.lights[this._lightIndex], (s) => {
				if (s.alpha > 0) {
					s.alpha -= 0.02;
				} else {
					this.SetProperty(Archive.lights[this._lightIndex], (s) => (s.alpha = 0));
					this._lightIndex = (this._lightIndex + 1) % Archive.lights.length;
					this.SetProperty(Archive.lights[this._lightIndex], (s) => (s.alpha = 1));
				}
			});
		}
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}
}
