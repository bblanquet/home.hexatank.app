import { SimpleEvent } from './../Utils/Events/SimpleEvent';
import { SpriteProvider } from './../Framework/SpriteProvider';
import * as PIXI from 'pixi.js';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { IUpdatable } from '../IUpdatable';
import { Point } from '../Utils/Geometry/Point';
import { IBoundingBoxContainer } from '../IBoundingBoxContainer';
import { GameHelper } from '../Framework/GameHelper';
import { IInteractionContext } from '../Interaction/IInteractionContext';

export abstract class Item implements IUpdatable, IBoundingBoxContainer {
	private DisplayObjects: Array<PIXI.DisplayObject>;
	private _sprites: { [id: string]: PIXI.Sprite } = {};
	protected Accuracy: number = 0.5;
	public OnDestroyed: SimpleEvent = new SimpleEvent();

	public Z: number;
	public IsUpdatable: Boolean;
	protected IsCentralRef: boolean = false;

	constructor(isUpdatable: boolean = true) {
		this.DisplayObjects = new Array<PIXI.DisplayObject>();
		this.IsUpdatable = isUpdatable;
		if (this.IsUpdatable) {
			GameHelper.Updater.Items.push(this);
		}
	}

	public GetCurrentSprites(): { [id: string]: PIXI.Sprite } {
		return this._sprites;
	}

	public GetDisplayObjects(): Array<PIXI.DisplayObject> {
		return this.DisplayObjects;
	}
	public Clear(): void {
		this.DisplayObjects = [];
	}

	protected GetBothSprites(name: string): Array<PIXI.Sprite> {
		return [ this._sprites[name] ];
	}

	protected SetProperty(name: string, func: (sprite: PIXI.Sprite) => void) {
		func(this.GetCurrentSprites()[name]);
	}

	protected SetProperties(names: string[], func: (sprite: PIXI.Sprite) => void) {
		names.forEach((name) => func(this.GetCurrentSprites()[name]));
	}

	protected SetBothProperty(name: string, func: (sprite: PIXI.Sprite) => void) {
		func(this._sprites[name]);
	}

	public Push(blop: PIXI.Graphics): void {
		this.DisplayObjects.push(blop);
	}

	protected GenerateSprite(name: string, func?: (sprite: PIXI.Sprite) => void): void {
		this._sprites[name] = new SpriteProvider().GetSprite(name, this.Accuracy);

		this.DisplayObjects.push(this._sprites[name]);
		this._sprites[name].alpha = 1;

		if (func) {
			this.SetBothProperty(name, func);
		}
	}

	public Destroy(): void {
		this.IsUpdatable = false;
		GameHelper.Render.Remove(this);
		this.OnDestroyed.Invoke();
	}

	public abstract GetBoundingBox(): BoundingBox;

	public InitPosition(pos: { X: number; Y: number }): void {
		this.GetBoundingBox().X = pos.X;
		this.GetBoundingBox().Y = pos.Y;
		const ref = this.GetRef();
		this.DisplayObjects.forEach((obj) => {
			obj.x = ref.X + GameHelper.ViewContext.GetX();
			obj.y = ref.Y + GameHelper.ViewContext.GetY();
		});
		this.GetSprites().forEach((sprite) => {
			sprite.width = this.GetBoundingBox().Width;
			sprite.height = this.GetBoundingBox().Height;
		});
		GameHelper.Render.Add(this);
	}

	public Update(viewX: number, viewY: number): void {
		const ref = this.GetRef();
		this.DisplayObjects.forEach((obj) => {
			obj.x = ref.X + viewX;
			obj.y = ref.Y + viewY;
		});
		this.GetSprites().forEach((sprite) => {
			sprite.width = this.GetBoundingBox().Width;
			sprite.height = this.GetBoundingBox().Height;
		});
	}

	public GetRef(): Point {
		if (this.IsCentralRef) {
			return this.GetBoundingBox().GetCentralPoint();
		}
		return this.GetBoundingBox().GetPosition();
	}

	public ExistsSprite(sprite: string): boolean {
		return sprite in this._sprites;
	}

	public GetSprites(): Array<PIXI.Sprite> {
		var sprites = new Array<PIXI.Sprite>();
		this.DisplayObjects.filter((d) => d instanceof PIXI.Sprite).forEach((item) => {
			sprites.push(<PIXI.Sprite>item);
		});
		return sprites;
	}

	public abstract Select(context: IInteractionContext): boolean;
}
