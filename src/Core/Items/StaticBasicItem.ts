import { Item } from './Item';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../Interaction/InteractionContext';
import { GameHelper } from '../Framework/GameHelper';

export class StaticBasicItem extends Item {
	private _isVisible: { (): boolean };
	private _isAlive: { (): boolean };
	private _spriteName: string;
	private _hover: string;
	public IsHover: boolean;
	constructor(
		private _boundingBox: BoundingBox,
		sprite: string,
		hoverSprite: string,
		z: number = 0,
		accuracy: number = 0.5
	) {
		super();
		this.Z = z;
		this._spriteName = sprite;
		this._hover = hoverSprite;
		this.Accuracy = accuracy;
		this.GenerateSprite(sprite, (e) => {
			e.anchor.set(0.5);
			e.alpha = 0;
		});
		this.GenerateSprite(this._hover, (e) => {
			e.anchor.set(0.5);
			e.alpha = 0;
		});
		this.InitPosition(this._boundingBox);
		this.IsCentralRef = true;
	}

	public SetRotation(radius: number): void {
		this.SetProperty(this._spriteName, (e) => (e.rotation = radius));
	}

	public SetVisible(show: () => boolean): void {
		this._isVisible = show;
	}

	public SetAlive(show: () => boolean): void {
		this._isAlive = show;
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		let ref = this.GetRef();
		this.GetDisplayObjects().forEach((obj) => {
			obj.x = ref.X;
			obj.y = ref.Y;
		});
		this.GetSprites().forEach((sprite) => {
			sprite.width = this.GetBoundingBox().Width;
			sprite.height = this.GetBoundingBox().Height;
		});

		if (!this._isAlive()) {
			this.Destroy();
		}

		const visible = this._isVisible();

		if (this.IsHover) {
			this.SetProperty(this._hover, (e) => (e.alpha = visible ? 1 : 0));
			this.SetProperty(this._spriteName, (e) => (e.alpha = 0));
		} else {
			this.SetProperty(this._hover, (e) => (e.alpha = 0));
			this.SetProperty(this._spriteName, (e) => (e.alpha = visible ? 1 : 0));
		}
	}

	public Destroy(): void {
		super.Destroy();
		this.IsUpdatable = false;
		GameHelper.Render.Remove(this);
	}
}
