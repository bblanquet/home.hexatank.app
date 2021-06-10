import { UpAnimation } from './UpAnimation';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Vehicle } from '../Vehicle';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { BonusValueProvider } from '../../Cell/Field/Bonus/BonusValueProvider';

export class SpeedUp extends Up {
	private _bonus: BonusValueProvider = new BonusValueProvider();
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
			this._vehicle.SetTranslationDuration(-this._bonus.GetSpeedTranslation(this._energy));
			this._vehicle.SetRotatingDuration(-this._bonus.GetSpeedRotation(this._energy));
			this._vehicle.PowerUps = this._vehicle.PowerUps.filter((p) => p !== this);
		});

		if (this._energyChanged) {
			this._ref = this.EnergyChanged.bind(this);
			this._energyChanged.On(this._ref);
		}

		this._vehicle.OnDestroyed.On(() => {
			if (this._energyChanged) {
				this._energyChanged.Off(this._ref);
			}
			condition.Done.Clear();
			this.Animation.Destroy();
		});

		if (this._energy) {
			this.Animation = new UpAnimation(this._vehicle, SvgArchive.speedUp, SvgArchive.speedUp);
			this._vehicle.SetTranslationDuration(this._bonus.GetSpeedTranslation(this._energy));
			this._vehicle.SetRotatingDuration(this._bonus.GetSpeedRotation(this._energy));
		}
	}

	private EnergyChanged(src: any, energy: number): void {
		if (this._energy === 0 && 0 < energy) {
			this.Animation = new UpAnimation(this._vehicle, SvgArchive.speedUp, SvgArchive.speedUp);
		} else if (energy === 0 && 0 < this._energy) {
			this.Animation.Destroy();
		}

		this._vehicle.SetTranslationDuration(-this._bonus.GetSpeedTranslation(this._energy));
		this._vehicle.SetRotatingDuration(-this._bonus.GetSpeedRotation(this._energy));
		this._energy = energy;
		this._vehicle.SetTranslationDuration(this._bonus.GetSpeedTranslation(this._energy));
		this._vehicle.SetRotatingDuration(this._bonus.GetSpeedRotation(this._energy));
	}
}
