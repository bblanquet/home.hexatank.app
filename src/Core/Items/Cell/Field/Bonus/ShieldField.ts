import { IHeadquarter } from '../Hq/IHeadquarter';
import { Identity, Relationship } from './../../../Identity';
import { UpCalculator } from './UpCalculator';
import { ShieldAppearance } from './ShieldAppearance';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveBonusField } from './AliveBonusField';
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

	constructor(cell: Cell, id: Identity, protected Hq: IHeadquarter) {
		super(cell, [], id, Hq);
		this._fixTimer = new TimeTimer(1000);
		if (isNullOrUndefined(this.Hq)) {
			throw `ShieldField not supposed to be there`;
		}
		this._shieldAppearance = new ShieldAppearance(this);
		this.Hq.AddField(this, cell);
		if (!this.Hq.IsCovered(cell)) {
			this.Destroy();
			if (cell.IsVisible()) {
				new Explosion(cell.GetBoundingBox(), SvgArchive.constructionEffects, ZKind.Sky, false, 5);
			}
		}
	}

	public ChangeEnergy(isUp: boolean): void {
		if (this.IsUpdatable) {
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
	}

	public GetHq(): IHeadquarter {
		if (isNullOrUndefined(this.Hq)) {
			throw `ShieldField not supposed to be there`;
		}
		return this.Hq;
	}

	Support(vehicule: Vehicle): void {}

	public GetRelation(item: Identity): Relationship {
		return this.GetIdentity().GetRelation(item);
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsAlive()) {
			this.Destroy();
			return;
		} else {
			if (this._fixTimer.IsElapsed()) {
				if (this.HasDamage()) {
					const fixValue = new UpCalculator().GetHeal(this.GetReactorsPower(this.Hq));
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
