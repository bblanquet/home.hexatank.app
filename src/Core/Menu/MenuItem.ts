import { Item } from '../Items/Item';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../Interaction/InteractionContext';
import { isNullOrUndefined } from 'util';
import { PlaygroundHelper } from '../Utils/PlaygroundHelper';

export abstract class MenuItem extends Item {
	BoundingBox: BoundingBox;
	constructor() {
		super();
		this.Hide();
		this.Accuracy = 1;
	}

	public Hide() {
		this.GetSprites().forEach((item) => {
			item.alpha = 0;
		});
	}

	public abstract Show(): void;

	public SetBoundingBox(boundingbox: { x: number; y: number; width: number; height: number }): void {
		if (isNullOrUndefined(this.BoundingBox)) {
			this.BoundingBox = new BoundingBox();
		}
		this.BoundingBox.X = boundingbox.x;
		this.BoundingBox.Y = boundingbox.y;
		this.BoundingBox.Width = boundingbox.width;
		this.BoundingBox.Height = boundingbox.height;
	}

	public Destroy(): void {
		PlaygroundHelper.Render.Remove(this);
	}

	public Update(viewX: number, viewY: number): void {
		this.GetSprites().forEach((sprite) => {
			sprite.x = this.GetBoundingBox().X;
			sprite.y = this.GetBoundingBox().Y;
			sprite.width = this.GetBoundingBox().Width;
			sprite.height = this.GetBoundingBox().Height;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.BoundingBox;
	}

	public abstract Select(context: InteractionContext): boolean;
}
