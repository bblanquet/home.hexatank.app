import { Identity, Relationship } from './Identity';
import { DamageText } from './Unit/DamageText';
import { GameSettings } from './../Framework/GameSettings';
import { Item } from './Item';
import { Cell } from './Cell/Cell';
import * as PIXI from 'pixi.js';
import { LiteEvent } from '../Utils/Events/LiteEvent';

export abstract class AliveItem extends Item {
	public OnDamageReceived: LiteEvent<number> = new LiteEvent<number>();

	private _damageText: DamageText;
	protected Life: number = GameSettings.UnitLife;
	protected TotalLife: number = GameSettings.UnitLife;
	private _totalLifeBar: PIXI.Graphics;
	private _borderBar: PIXI.Graphics;
	private _currentLifeBar: PIXI.Graphics;
	private _lifeBars: Array<PIXI.Graphics>;
	public Identity: Identity;

	constructor() {
		super();
		this._totalLifeBar = new PIXI.Graphics();
		this._currentLifeBar = new PIXI.Graphics();
		this._borderBar = new PIXI.Graphics();
		this._totalLifeBar.beginFill(0xdc2929, 1);
		this._totalLifeBar.alpha = 0;
		this._currentLifeBar.beginFill(0x35dc29, 1);
		this._currentLifeBar.alpha = 0;
		this._borderBar.beginFill(0x252525, 1);
		this._borderBar.alpha = 0;

		this._totalLifeBar.drawRect(0, 0, 10, 10);
		this._currentLifeBar.drawRect(0, 0, 10, 10);
		this._borderBar.drawRect(0, 0, 15, 15);

		this.Push(this._borderBar);
		this.Push(this._totalLifeBar);
		this.Push(this._currentLifeBar);

		this._lifeBars = new Array<PIXI.Graphics>();
		this._lifeBars.push(this._borderBar);
		this._lifeBars.push(this._totalLifeBar);
		this._lifeBars.push(this._currentLifeBar);
		this._damageText = new DamageText(this);
	}

	public HasDamage(): boolean {
		return this.Life < this.TotalLife;
	}

	private Show(): void {
		this._totalLifeBar.alpha = 1;
		this._currentLifeBar.alpha = 1;
		this._borderBar.alpha = 1;
	}

	private Hide(): void {
		this._totalLifeBar.alpha = 0;
		this._currentLifeBar.alpha = 0;
		this._borderBar.alpha = 0;
	}

	public SetDamage(damage: number): void {
		this.Life -= damage;
		this.UpdateDamage();
		this.OnDamageReceived.Invoke(this, damage);
	}

	public SetVisible(isVisible: boolean): void {
		this._totalLifeBar.visible = isVisible;
		this._currentLifeBar.visible = isVisible;
		this._borderBar.visible = isVisible;
	}

	protected UpdateDamage() {
		if (0 < this.Life && this.Life < this.TotalLife) {
			this.Show();
		} else {
			this.Hide();
		}
		if (this.Life < 0) {
			this.Life = 0;
		}

		if (this.TotalLife < this.Life) {
			this.Life = this.TotalLife;
		}
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this._lifeBars.forEach((element) => {
			element.x = this.GetBoundingBox().X + viewX + 20;
			element.y = this.GetBoundingBox().Y + viewY + 10;
			element.height = 4;
			element.width = this.GetBoundingBox().Width - 40;
		});

		this._borderBar.x = this.GetBoundingBox().X + viewX + 18;
		this._borderBar.y = this.GetBoundingBox().Y + viewY + 8;
		this._borderBar.height = 8;
		this._borderBar.width = this.GetBoundingBox().Width - 36;

		this._currentLifeBar.width = (this.GetBoundingBox().Width - 40) * (this.Life / this.TotalLife);
	}

	public IsAlive(): boolean {
		return 0 < this.Life;
	}

	public GetCurrentLife(): number {
		return this.Life;
	}

	public SetCurrentLife(life: number): void {
		this.Life = life;
		this.UpdateDamage();
	}

	public OverrideLife(life: number): void {
		this.Life = life;
		this.TotalLife = life;
	}

	public abstract GetRelation(id: Identity): Relationship;

	public abstract GetCurrentCell(): Cell;
}
