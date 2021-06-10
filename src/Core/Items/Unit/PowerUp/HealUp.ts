import { UpAnimation } from './UpAnimation';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Vehicle } from '../Vehicle';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { BonusValueProvider } from '../../Cell/Field/Bonus/BonusValueProvider';

export class HealUp extends Up {
	private _isDone: boolean = false;
	private _bonusValueProvider: BonusValueProvider = new BonusValueProvider();
	private _ref: any;

	constructor(
		private _vehicle: Vehicle,
		condition: UpCondition,
		private _energy: number,
		private _energyChanged: LiteEvent<number> = null
	) {
		super(condition);
		condition.Done.On(() => {
			if (this._energyChanged) {
				this._energyChanged.Off(this._ref);
			}
			condition.Done.Clear();
			this.Animation.Destroy();
			this._vehicle.PowerUps = this._vehicle.PowerUps.filter((p) => p !== this);
			this._isDone = true;
		});

		this._vehicle.OnDestroyed.On(() => {
			if (this._energyChanged) {
				this._energyChanged.Off(this._ref);
			}
			this._energyChanged.Off(this._ref);
			condition.Done.Clear();
			this.Animation.Destroy();
			this._isDone = true;
		});
		if (this._energyChanged) {
			this._ref = this.EnergyChanged.bind(this);
			this._energyChanged.On(this._ref);
		}

		if (0 < this._energy) {
			this.Animation = new UpAnimation(this._vehicle, SvgArchive.healUp, SvgArchive.healUp);
		}
		this.Heal();
	}
	private Heal(): void {
		setTimeout(() => {
			if (!this._isDone) {
				this._vehicle.SetDamage(-Math.abs(this._bonusValueProvider.GetFixValue(this._energy)));
				this.Heal();
			}
		}, 1000);
	}

	private EnergyChanged(src: any, energy: number): void {
		if (this._energy === 0 && 0 < energy) {
			this.Animation = new UpAnimation(this._vehicle, SvgArchive.healUp, SvgArchive.healUp);
		} else if (energy === 0 && 0 < this._energy) {
			this.Animation.Destroy();
		}
		this._energy = energy;
	}
}
