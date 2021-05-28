import { ICellEnergyProvider } from './../Hq/ICellEnergyProvider';
import { Identity } from './../../../Identity';
import { BonusValueProvider } from './BonusValueProvider';
import { ShieldAppearance } from './ShieldAppearance';
import { Headquarter } from './../Hq/Headquarter';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveBonusField } from './AliveBonusField';
import { AliveItem } from '../../../AliveItem';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { ITimer } from '../../../../Utils/Timer/ITimer';
import { TimeTimer } from '../../../../Utils/Timer/TimeTimer';
import { BouncingScaleDownAnimator } from '../../../Animator/BouncingScaleDownAnimator';
import { BouncingScaleUpAnimator } from '../../../Animator/BouncingScaleUpAnimator';
import { Explosion } from '../../../Unit/Explosion';
import { ZKind } from '../../../ZKind';

export class ShieldField extends AliveBonusField {
	private _shieldAppearance: ShieldAppearance;
	private _fixTimer: ITimer;

	constructor(cell: Cell, id: Identity, protected Hq: Headquarter) {
		super(cell, [], id, Hq);
		this._fixTimer = new TimeTimer(1000);
		if (isNullOrUndefined(Hq)) {
			throw 'not supposed to be there';
		}
		this._shieldAppearance = new ShieldAppearance(this);
		Hq.AddField(this, cell);
		if (!Hq.IsCovered(cell)) {
			cell.DestroyField();
			if (cell.IsVisible()) {
				new Explosion(cell.GetBoundingBox(), SvgArchive.constructionEffects, ZKind.Sky, false, 5);
			}
		}
	}

	public EnergyChanged(isUp: boolean): void {
		const formerEnergy = this.Energy;

		this.Energy = isUp ? this.Energy + 1 : this.Energy - 1;

		if (this.Energy === 1 && formerEnergy === 0) {
			this._shieldAppearance.Animator = new BouncingScaleUpAnimator(this._shieldAppearance, [
				SvgArchive.bonus.shieldLight,
				SvgArchive.bonus.shield
			]);
		} else if (this.Energy === 0 && formerEnergy === 1) {
			this._shieldAppearance.Animator = new BouncingScaleDownAnimator(this._shieldAppearance, [
				SvgArchive.bonus.shieldLight,
				SvgArchive.bonus.shield
			]);
		}
	}

	public GetHq(): Headquarter {
		return this.Hq;
	}

	Support(vehicule: Vehicle): void {}

	public IsEnemy(item: AliveItem): boolean {
		return this.Hq.IsEnemy(item);
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsAlive()) {
			this.GetCell().DestroyField();
			this.Destroy();
			return;
		} else {
			if (this._fixTimer.IsElapsed()) {
				if (this.HasDamage()) {
					const fixValue = new BonusValueProvider().GetFixValue(this.GetReactorsPower(this.Hq));
					this.SetDamage(-fixValue);
				}
			}
			super.Update(viewX, viewY);
		}
	}

	public Destroy() {
		this.Life = 0;
		super.Destroy();
	}
}
