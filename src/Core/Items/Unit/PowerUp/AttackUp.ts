import { UpAnimation } from './UpAnimation';
import { Tank } from '../Tank';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { Archive } from '../../../Framework/ResourceArchiver';

export class AttackUp extends Up {
	constructor(private _tank: Tank, condition: UpCondition, private _powerUp: number) {
		super(condition, new UpAnimation(_tank, Archive.powerUp, Archive.powerUpR));
		this._tank.Attack += this._powerUp;
		condition.Done.On(() => {
			condition.Done.Clear();
			this.Animation.Destroy();
			this._tank.Attack -= this._powerUp;
			this._tank.PowerUps = this._tank.PowerUps.filter((p) => p !== this);
		});

		this._tank.OnDestroyed.On(() => {
			condition.Done.Clear();
			this.Animation.Destroy();
		});
	}
}
