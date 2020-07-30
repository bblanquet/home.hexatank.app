import { UpAnimation } from './UpAnimation';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { Archive } from '../../../Framework/ResourceArchiver';
import { Vehicle } from '../Vehicle';

export class SpeedUp extends Up {
	constructor(
		private _vehicle: Vehicle,
		condition: UpCondition,
		private _transationUp: number,
		private _rotationUp: number
	) {
		super(condition, new UpAnimation(_vehicle, Archive.powerUp, Archive.powerUpR));
		this._vehicle.TranslationSpeed += this._transationUp;
		this._vehicle.RotationSpeed += this._rotationUp;
		condition.Done.On(() => {
			condition.Done.Clear();
			this.Animation.Destroy();
			this._vehicle.TranslationSpeed -= this._transationUp;
			this._vehicle.RotationSpeed -= this._rotationUp;
			this._vehicle.PowerUps = this._vehicle.PowerUps.filter((p) => p !== this);
		});

		this._vehicle.OnDestroyed.On(() => {
			condition.Done.Clear();
			this.Animation.Destroy();
		});
	}
}
