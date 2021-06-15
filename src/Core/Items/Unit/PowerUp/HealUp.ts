import { UpAnimation } from './UpAnimation';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Vehicle } from '../Vehicle';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';

export class HealUp extends Up {
	constructor(vehicle: Vehicle, condition: UpCondition, energy: number, energyChanged: LiteEvent<number> = null) {
		super(vehicle, condition, energy, energyChanged);
		this.Heal();
	}

	private Heal(): void {
		setTimeout(() => {
			if (!this.isDone) {
				this.Vehicle.SetDamage(-Math.abs(this.Bonus.GetFixValue(this.GetCurrentEnergy())));
				this.Heal();
			}
		}, 1000);
	}

	protected OnEnergyChanged(previousEnery: number, energy: number): void {
		if (previousEnery === 0 && 0 < energy) {
			this.Animation = new UpAnimation(this.Vehicle, SvgArchive.healUp, SvgArchive.healUp);
			this.Animation.SetCurrentRotation(this.Vehicle.GetUpAngle());
		} else if (energy === 0 && 0 < previousEnery) {
			this.Animation.Destroy();
		}
	}
}
