import { Item } from './Item';
import { Cell } from './Cell/Cell';
import * as PIXI from 'pixi.js';

export abstract class AliveItem extends Item {
	private _z: number;
	protected Life: number = 100;
	protected TotalLife: number = 100;
	private _totalLifeBar: PIXI.Graphics;
	private _borderBar: PIXI.Graphics;
	private _currentLifeBar: PIXI.Graphics;
	private _lifeBars: Array<PIXI.Graphics>;
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

	public abstract IsEnemy(item: AliveItem): boolean;

	public abstract GetCurrentCell(): Cell;
}
