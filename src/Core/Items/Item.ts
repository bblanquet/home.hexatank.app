import { Singletons, SingletonKey } from '../../Singletons';
import { ILayerService } from './../../Services/Layer/ILayerService';
import { IUpdateService } from './../../Services/Update/IUpdateService';
import { LiteEvent } from './../../Utils/Events/LiteEvent';
import { SpriteManager } from './../Framework/SpriteManager';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import * as PIXI from 'pixi.js';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { IUpdatable } from '../IUpdatable';
import { Point } from '../../Utils/Geometry/Point';
import { IBoundingBoxContainer } from '../IBoundingBoxContainer';
import { IInteractionContext } from '../Interaction/IInteractionContext';

export abstract class Item implements IUpdatable, IBoundingBoxContainer {
	private _updateService: IUpdateService;
	protected _layerService: ILayerService;
	private DisplayObjects: Array<PIXI.DisplayObject>;
	private _spriteManager: SpriteManager;

	public Z: number;
	public IsUpdatable: boolean;
	public IsCentralRef: boolean = false;

	public OnDestroyed: LiteEvent<Item> = new LiteEvent();

	constructor(isUpdatable: boolean = true) {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._spriteManager = new SpriteManager();
		this.DisplayObjects = new Array<PIXI.DisplayObject>();
		this.IsUpdatable = isUpdatable;
		if (this.IsUpdatable) {
			this._updateService.Publish().Items.push(this);
		}
	}

	public GetCurrentSprites(): Dictionary<PIXI.Sprite> {
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

	protected Push(blop: PIXI.DisplayObject): void {
		this.DisplayObjects.push(blop);
	}

	protected AddSprite(key: string, sprite: PIXI.Sprite, func?: (sprite: PIXI.Sprite) => void): void {
		this._spriteManager.AddSprite(key, sprite, func);
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
		this.InitCell(pos);
		this._layerService.Publish().Add(this);
	}

	protected InitCell(pos: { X: number; Y: number }) {
		this.GetBoundingBox().SetX(pos.X);
		this.GetBoundingBox().SetY(pos.Y);
		const ref = this.GetRef();
		this.DisplayObjects.forEach((obj) => {
			obj.x = ref.X;
			obj.y = ref.Y;
		});
		this.GetSprites().forEach((sprite) => {
			sprite.x = ref.X;
			sprite.y = ref.Y;
			sprite.width = this.GetBoundingBox().GetWidth();
			sprite.height = this.GetBoundingBox().GetHeight();
		});
	}

	public Init(): void {
		this._layerService.Publish().Add(this);
	}

	public Update(): void {
		const ref = this.GetRef();
		this.DisplayObjects.forEach((obj) => {
			obj.x = ref.X;
			obj.y = ref.Y;
		});
		this.GetSprites().forEach((sprite) => {
			sprite.x = ref.X;
			sprite.y = ref.Y;
			sprite.width = this.GetBoundingBox().GetWidth();
			sprite.height = this.GetBoundingBox().GetHeight();
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
