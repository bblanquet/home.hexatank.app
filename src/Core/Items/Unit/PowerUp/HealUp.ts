import { UpAnimation } from './UpAnimation';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Vehicle } from '../Vehicle';

export class HealUp extends Up {
	private _isDone: boolean = false;

	constructor(private _vehicle: Vehicle, condition: UpCondition, private _healing: number) {
		super(condition, new UpAnimation(_vehicle, SvgArchive.healUp, SvgArchive.healUp));
		condition.Done.On(() => {
			condition.Done.Clear();
			this.Animation.Destroy();
			this._vehicle.PowerUps = this._vehicle.PowerUps.filter((p) => p !== this);
			this._isDone = true;
		});

		this._vehicle.OnDestroyed.On(() => {
			condition.Done.Clear();
			this.Animation.Destroy();
			this._isDone = true;
		});

		this.Heal();
	}
	private Heal(): void {
		setTimeout(() => {
			if (!this._isDone) {
				this._vehicle.SetDamage(-Math.abs(this._healing));
				this.Heal();
			}
		}, 1000);
	}
}
