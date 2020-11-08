import { ShieldAppearance } from './ShieldAppearance';
import { Headquarter } from './../Hq/Headquarter';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveBonusField } from './AliveBonusField';
import { AliveItem } from '../../../AliveItem';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { ITimer } from '../../../../Utils/Timer/ITimer';
import { TimeTimer } from '../../../../Utils/Timer/TimeTimer';
import { BouncingScaleDownAnimator } from '../../../Animator/BouncingScaleDownAnimator';
import { BouncingScaleUpAnimator } from '../../../Animator/BouncingScaleUpAnimator';

export class ShieldField extends AliveBonusField {
	private _shieldAppearance: ShieldAppearance;
	private _timer: ITimer;

	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [], hq);
		this._timer = new TimeTimer(3000);
		if (isNullOrUndefined(hq)) {
			throw 'not supposed to be there';
		}
		this._shieldAppearance = new ShieldAppearance(this);
		hq.AddField(this);
	}

	public EnergyChanged(isUp: boolean): void {
		const formerEnergy = this.Energy;

		this.Energy = isUp ? this.Energy + 1 : this.Energy - 1;

		if (this.Energy === 1 && formerEnergy === 0) {
			this._shieldAppearance.Animator = new BouncingScaleUpAnimator(this._shieldAppearance, [
				Archive.bonus.shieldLight,
				Archive.bonus.shield
			]);
		} else if (this.Energy === 0 && formerEnergy === 1) {
			this._shieldAppearance.Animator = new BouncingScaleDownAnimator(this._shieldAppearance, [
				Archive.bonus.shieldLight,
				Archive.bonus.shield
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
			if (this._timer.IsElapsed()) {
				if (this.HasDamage()) {
					const bonus = 0.5 * this.GetReactorsPower(this.Hq);
					this.SetDamage(-(0.5 + bonus));
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
