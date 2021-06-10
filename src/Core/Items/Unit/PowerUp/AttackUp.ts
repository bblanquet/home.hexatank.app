import { LiteEvent } from './../../../Utils/Events/LiteEvent';
import { UpAnimation } from './UpAnimation';
import { Tank } from '../Tank';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { BonusValueProvider } from '../../Cell/Field/Bonus/BonusValueProvider';

export class AttackUp extends Up {
	private _bonusValueProvider: BonusValueProvider = new BonusValueProvider();
	private _ref: any;

	constructor(
		private _tank: Tank,
		condition: UpCondition,
		private _energy: number,
		private _energyChanged: LiteEvent<number> = null
	) {
		super(condition);
		this._tank.Attack += this._bonusValueProvider.GetPower(this._energy);
		condition.Done.On(() => {
			if (this._energyChanged) {
				this._energyChanged.Off(this._ref);
			}
			condition.Done.Clear();
			this.Animation.Destroy();
			this._tank.Attack -= this._bonusValueProvider.GetPower(this._energy);
			this._tank.PowerUps = this._tank.PowerUps.filter((p) => p !== this);
		});

		if (this._energyChanged) {
			this._ref = this.EnergyChanged.bind(this);
			this._energyChanged.On(this._ref);
		}

		this._tank.OnDestroyed.On(() => {
			if (this._energyChanged) {
				this._energyChanged.Off(this._ref);
			}
			condition.Done.Clear();
			this.Animation.Destroy();
		});

		if (0 < this._energy) {
			this.Animation = new UpAnimation(this._tank, SvgArchive.powerUp, SvgArchive.powerUpR);
		}
	}

	private EnergyChanged(src: any, energy: number): void {
		if (this._energy === 0 && 0 < energy) {
			this.Animation = new UpAnimation(this._tank, SvgArchive.powerUp, SvgArchive.powerUpR);
		} else if (energy === 0 && 0 < this._energy) {
			this.Animation.Destroy();
		}

		this._tank.Attack -= this._bonusValueProvider.GetPower(this._energy);
		this._tank.Attack += this._bonusValueProvider.GetPower(energy);
		this._energy = energy;
	}
}
