import { Factory, FactoryKey } from './../../Factory';
import { ILayerService } from './../../Services/Layer/ILayerService';
import { IUpdateService } from './../../Services/Update/IUpdateService';
import { LiteEvent } from './../Utils/Events/LiteEvent';
import { SpriteManager } from './../Framework/SpriteManager';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import * as PIXI from 'pixi.js';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { IUpdatable } from '../IUpdatable';
import { Point } from '../Utils/Geometry/Point';
import { IBoundingBoxContainer } from '../IBoundingBoxContainer';
import { IInteractionContext } from '../Interaction/IInteractionContext';

export abstract class Item implements IUpdatable, IBoundingBoxContainer {
	private _updateService: IUpdateService;
	protected _layerService: ILayerService;

	private DisplayObjects: Array<PIXI.DisplayObject>;
	private _spriteManager: SpriteManager;
	public OnDestroyed: LiteEvent<Item> = new LiteEvent();

	public Z: number;
	public IsUpdatable: boolean;
	public IsCentralRef: boolean = false;

	constructor(isUpdatable: boolean = true) {
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
		this._updateService = Factory.Load<IUpdateService>(FactoryKey.Update);
		this._spriteManager = new SpriteManager();
		this.DisplayObjects = new Array<PIXI.DisplayObject>();
		this.IsUpdatable = isUpdatable;
		if (this.IsUpdatable) {
			this._updateService.Publish().Items.push(this);
		}
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

	public SetProperty(name: string, func: (sprite: PIXI.Sprite) => void) {
		this._spriteManager.SetProperty(name, func);
	}

	public SetProperties(names: string[], func: (sprite: PIXI.Sprite) => void) {
		this._spriteManager.SetProperties(names, func);
	}

	protected Push(blop: PIXI.Graphics): void {
		this.DisplayObjects.push(blop);
	}

	protected GenerateSprite(name: string, func?: (sprite: PIXI.Sprite) => void): void {
		this._spriteManager.GenerateSprite(name, func);
	}

	public Destroy(): void {
		this.IsUpdatable = false;
		this._layerService.Publish().Remove(this);
		this._spriteManager.Destroyed();
		this.OnDestroyed.Invoke(this, this);
		this.OnDestroyed.Clear();
	}

	public abstract GetBoundingBox(): BoundingBox;

	public InitPosition(pos: { X: number; Y: number }): void {
		this.GetBoundingBox().X = pos.X;
		this.GetBoundingBox().Y = pos.Y;
		const ref = this.GetRef();
		this.DisplayObjects.forEach((obj) => {
			obj.x = ref.X + this._updateService.Publish().ViewContext.GetX();
			obj.y = ref.Y + this._updateService.Publish().ViewContext.GetY();
		});
		this.GetSprites().forEach((sprite) => {
			sprite.x = ref.X + this._updateService.Publish().ViewContext.GetX();
			sprite.y = ref.Y + this._updateService.Publish().ViewContext.GetY();
			sprite.width = this.GetBoundingBox().Width;
			sprite.height = this.GetBoundingBox().Height;
		});
		this._layerService.Publish().Add(this);
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
