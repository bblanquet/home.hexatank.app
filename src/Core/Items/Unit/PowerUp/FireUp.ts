import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { UpAnimation } from './UpAnimation';
import { Tank } from '../Tank';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { SvgArchive } from '../../../Framework/SvgArchiver';

export class FireUp extends Up {
	constructor(tank: Tank, condition: UpCondition, energy: number, energyChanged: LiteEvent<number> = null) {
		super(tank, condition, energy, energyChanged);
	}

	protected OnEnergyChanged(previousEnergy: number, energy: number): void {
		if (previousEnergy === 0 && 0 < energy) {
			this.Animation = new UpAnimation(this.Vehicle, SvgArchive.powerUp, SvgArchive.powerUpR);
			this.Animation.SetCurrentRotation(this.Vehicle.GetUpAngle());
		} else if (energy === 0 && 0 < previousEnergy) {
			this.Animation.Destroy();
		}
	}
}
