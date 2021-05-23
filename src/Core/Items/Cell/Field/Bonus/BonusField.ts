import { Headquarter } from './../Hq/Headquarter';
import { Field } from '../Field';
import { Vehicle } from '../../../Unit/Vehicle';
import { IAnimator } from '../../../Animator/IAnimator';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { CellState } from '../../CellState';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { IActiveContainer } from '../IActiveContainer';
import { AliveItem } from '../../../AliveItem';
import { ZKind } from '../../../ZKind';
import { Explosion } from '../../../Unit/Explosion';

export abstract class BonusField extends Field implements IActiveContainer {
	private _animator: IAnimator;
	private _isIncreasingOpacity: boolean = false;
	public Energy: number = 0;

	constructor(cell: Cell, private _bonus: string[], protected hq: Headquarter, override: boolean = true) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = ZKind.Field;
		this.GenerateSprite(Archive.bonus.coverBottom);
		this._bonus.forEach((b) => {
			this.GenerateSprite(b);
		});
		this.GenerateSprite(this.hq.GetSkin().GetLight());
		this.Energy = this.hq.GetCellEnergy(cell.GetHexCoo());
		this.hq.AddField(this, cell);
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		if (override) {
			this.InitPosition(cell.GetBoundingBox());
		}
		this._animator = new BouncingScaleAnimator(this);
		if (!hq.IsCovered(cell)) {
			cell.DestroyField();
			if (cell.IsVisible()) {
				new Explosion(cell.GetBoundingBox(), Archive.constructionEffects, ZKind.Sky, false, 5);
			}
		}
	}

	public GetHq(): Headquarter {
		return this.hq;
	}

	EnergyChanged(isUp: boolean): void {
		this.Energy = isUp ? this.Energy + 1 : this.Energy - 1;
	}

	public IsAlly(aliveItem: AliveItem): boolean {
		return !this.hq.IsEnemy(aliveItem);
	}

	protected OnCellStateChanged(cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
		} else {
			super.Update(viewX, viewY);
		}
		if (0 < this.Energy) {
			this.SetProperty(this.hq.GetSkin().GetLight(), (s) => {
				if (s.alpha < 0.1) {
					this._isIncreasingOpacity = true;
				}

				if (1 <= s.alpha) {
					this._isIncreasingOpacity = false;
				}

				s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
			});
		} else {
			this.SetProperty(this.hq.GetSkin().GetLight(), (e) => (e.alpha = 0));
		}
	}

	abstract Support(vehicule: Vehicle): void;

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return false;
	}
}
