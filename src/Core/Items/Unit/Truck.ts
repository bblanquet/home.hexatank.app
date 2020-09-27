import { GameSettings } from './../../Framework/GameSettings';
import { Vehicle } from './Vehicle';
import { IHqContainer } from './IHqContainer';
import { AliveItem } from '../AliveItem';
import { Headquarter } from '../Cell/Field/Hq/Headquarter';
import { Light } from '../Environment/Light';
import { Archive } from '../../Framework/ResourceArchiver';
import { TickTimer } from '../../Utils/Timer/TickTimer';
import { CellState } from '../Cell/CellState';
import { ITimer } from '../../Utils/Timer/ITimer';
import { GameContext } from '../../Framework/GameContext';

export class Truck extends Vehicle implements IHqContainer {
	private _light: Light;
	private _gatheredDiamonds: Array<string>;
	private _dimaondTimer: ITimer;
	private _diamondsCount: number = 0;

	constructor(hq: Headquarter, gameContext: GameContext, public IsPacific: boolean = false) {
		super(hq, gameContext);
		this._dimaondTimer = new TickTimer(GameSettings.DiamondLoadingSpeed);

		this._gatheredDiamonds = Archive.diamonds;

		this.GenerateSprite(this.Hq.GetSkin().GetTruck());
		this.RootSprites.push(this.Hq.GetSkin().GetTruck());

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

	private IsHqContainer(item: any): item is IHqContainer {
		return 'Hq' in item;
	}

	public IsEnemy(item: AliveItem): boolean {
		if (this.IsHqContainer(item as any)) {
			return (<IHqContainer>(item as any)).Hq !== this.Hq;
		} else if (item instanceof Headquarter) {
			return <Headquarter>(item as any) !== this.Hq;
		}
		return false;
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
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState === CellState.Visible;
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
