import { SpriteManager } from './../Framework/SpriteManager';
import { SpriteAccuracy } from './../Framework/SpriteAccuracy';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { SimpleEvent } from './../Utils/Events/SimpleEvent';
import * as PIXI from 'pixi.js';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { IUpdatable } from '../IUpdatable';
import { Point } from '../Utils/Geometry/Point';
import { IBoundingBoxContainer } from '../IBoundingBoxContainer';
import { GameHelper } from '../Framework/GameHelper';
import { IInteractionContext } from '../Interaction/IInteractionContext';

export abstract class Item implements IUpdatable, IBoundingBoxContainer {
	private DisplayObjects: Array<PIXI.DisplayObject>;
	private _spriteManager: SpriteManager;
	public OnDestroyed: SimpleEvent = new SimpleEvent();

	public Z: number;
	public IsUpdatable: boolean;
	public IsCentralRef: boolean = false;

	constructor(isUpdatable: boolean = true) {
		this._spriteManager = new SpriteManager();
		this.DisplayObjects = new Array<PIXI.DisplayObject>();
		this.IsUpdatable = isUpdatable;
		if (this.IsUpdatable) {
			GameHelper.Updater.Items.push(this);
		}
	}

	UpdateZoom(accuracy: SpriteAccuracy) {
		this._spriteManager.Update(accuracy);
	}

	public GetCurrentSprites(): Dictionnary<PIXI.Sprite> {
		return this._spriteManager.GetCurrentSprites();
	}

	public GetAllDisplayable(): Array<PIXI.DisplayObject> {
		const result = new Array<PIXI.DisplayObject>();
		this.DisplayObjects.forEach((d) => {
			result.push(d);
		});
		this._spriteManager.GetAll().forEach((d) => {
			result.push(d);
		});
		return result;
	}

	public Clear(): void {
		this.DisplayObjects = [];
	}

	protected SetProperty(name: string, func: (sprite: PIXI.Sprite) => void) {
		this._spriteManager.SetProperty(name, func);
	}

	public SetProperties(names: string[], func: (sprite: PIXI.Sprite) => void) {
		this._spriteManager.SetProperties(names, func);
	}

	public Push(blop: PIXI.Graphics): void {
		this.DisplayObjects.push(blop);
	}

	protected GenerateSprite(name: string, func?: (sprite: PIXI.Sprite) => void): void {
		this._spriteManager.GenerateSprite(name, func);
	}

	public Destroy(): void {
		this.IsUpdatable = false;
		GameHelper.Render.Remove(this);
		this._spriteManager.Destroyed();
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
			sprite.x = ref.X + GameHelper.ViewContext.GetX();
			sprite.y = ref.Y + GameHelper.ViewContext.GetY();
			sprite.width = this.GetBoundingBox().Width;
			sprite.height = this.GetBoundingBox().Height;
		});
		this._spriteManager.Init();
		GameHelper.Render.Add(this);
	}

	public Update(viewX: number, viewY: number): void {
		const ref = this.GetRef();
		this.DisplayObjects.forEach((obj) => {
			obj.x = ref.X + viewX;
			obj.y = ref.Y + viewY;
		});
		this.GetSprites().forEach((sprite) => {
			sprite.x = ref.X + viewX;
			sprite.y = ref.Y + viewY;
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

	public GetSprites(): Array<PIXI.Sprite> {
		return this._spriteManager.GetAll();
	}

	public abstract Select(context: IInteractionContext): boolean;
}
