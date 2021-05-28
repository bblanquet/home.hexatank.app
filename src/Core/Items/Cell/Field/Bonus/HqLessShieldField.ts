import { Identity } from './../../../Identity';
import { ICellEnergyProvider } from './../Hq/ICellEnergyProvider';
import { BonusValueProvider } from './BonusValueProvider';
import { ShieldAppearance } from './ShieldAppearance';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveBonusField } from './AliveBonusField';
import { AliveItem } from '../../../AliveItem';
import { ITimer } from '../../../../Utils/Timer/ITimer';
import { TimeTimer } from '../../../../Utils/Timer/TimeTimer';
import { BouncingScaleDownAnimator } from '../../../Animator/BouncingScaleDownAnimator';
import { BouncingScaleUpAnimator } from '../../../Animator/BouncingScaleUpAnimator';

export class HqLessShieldField extends AliveBonusField {
	private _shieldAppearance: ShieldAppearance;
	private _fixTimer: ITimer;

	constructor(cell: Cell, id: Identity, energy: ICellEnergyProvider) {
		super(cell, [], id, energy);
		this._fixTimer = new TimeTimer(1000);
		this._shieldAppearance = new ShieldAppearance(this);
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

	Support(vehicule: Vehicle): void {}

	public IsEnemy(item: AliveItem): boolean {
		return !(item.Identity && item.Identity.Name === this.Identity.Name);
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsAlive()) {
			this.GetCell().DestroyField();
			this.Destroy();
			return;
		} else {
			if (this._fixTimer.IsElapsed()) {
				if (this.HasDamage()) {
					const fixValue = new BonusValueProvider().GetFixValue(5);
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