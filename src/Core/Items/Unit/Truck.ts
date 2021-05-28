import { Identity } from './../Identity';
import { TimeTimer } from './../../Utils/Timer/TimeTimer';
import { GameSettings } from './../../Framework/GameSettings';
import { Vehicle } from './Vehicle';
import { AliveItem } from '../AliveItem';
import { Light } from '../Environment/Light';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { CellState } from '../Cell/CellState';
import { ITimer } from '../../Utils/Timer/ITimer';

export class Truck extends Vehicle {
	private _light: Light;
	private _gatheredDiamonds: Array<string>;
	private _dimaondTimer: ITimer;
	private _diamondsCount: number = 0;

	constructor(identity: Identity, isPacific: boolean = false) {
		super(identity);
		this.IsPacific = isPacific;
		this._dimaondTimer = new TimeTimer(GameSettings.DiamondLoading);

		this._gatheredDiamonds = SvgArchive.diamonds;

		this.GenerateSprite(this.Identity.Skin.GetTruck());
		this.RootSprites.push(this.Identity.Skin.GetTruck());

		this._gatheredDiamonds.forEach((diamond) => {
			this.GenerateSprite(diamond, (e) => (e.alpha = 0));
			this.RootSprites.push(diamond);
		});

		this._light = new Light(this.BoundingBox);

		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.BoundingBox.Width), (sprite.height = this.BoundingBox.Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
	}

	public IsLoaded(): boolean {
		return this._diamondsCount === 5;
	}

	public Destroy(): void {
		super.Destroy();
		this._light.Destroy();
	}

	public IsEnemy(item: AliveItem): boolean {
		return !(item.Identity && item.Identity.Name === this.Identity.Name);
	}

	public Load(): boolean {
		if (this.IsPacific) {
			return false;
		}
		if (this._dimaondTimer.IsElapsed()) {
			if (!this.IsLoaded()) {
				this.SetProperty(this._gatheredDiamonds[this._diamondsCount], (e) => (e.alpha = 1));
				this._diamondsCount = (this._diamondsCount + 1) % this._gatheredDiamonds.length;
				return true;
			}
		}
		return false;
	}

	public Unload(): number {
		var diamonds = this._diamondsCount;
		this._diamondsCount = 0;
		this._gatheredDiamonds.forEach((sprite) => {
			this.SetProperty(sprite, (e) => (e.alpha = 0));
		});
		return diamonds;
	}

	protected HandleCellStateChanged(obj: any, cellState: CellState): void {
		this.SetVisible(cellState === CellState.Visible);
	}
	public SetVisible(isVisible: boolean) {
		super.SetVisible(isVisible);
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = isVisible;
		});
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		if (0 < this._diamondsCount) {
			if (!this._light.IsVisible()) {
				this._light.Display();
			}
		} else {
			if (this._light.IsVisible()) {
				this._light.Hide();
			}
		}

		this._light.GetSprites().forEach((s) => (s.visible = this.GetCurrentCell().IsVisible()));
		this._light.Update(viewX, viewY);
	}
	protected RemoveCamouflage(): void {}
}
