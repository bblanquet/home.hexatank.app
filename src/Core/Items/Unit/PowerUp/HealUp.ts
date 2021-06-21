import { UpAnimation } from './UpAnimation';
import { Up } from './Up';
import { UpCondition } from './Condition/UpCondition';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Vehicle } from '../Vehicle';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { UpCalculator } from '../../Cell/Field/Bonus/UpCalculator';

export class HealUp extends Up {
	private _timer: TimeTimer;
	private _upCalculator: UpCalculator = new UpCalculator();

	constructor(vehicle: Vehicle, condition: UpCondition, energy: number, energyChanged: LiteEvent<number> = null) {
		super(vehicle, condition, energy, energyChanged);
		this._timer = new TimeTimer(1000);
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		if (this._timer.IsElapsed()) {
			this.Vehicle.SetDamage(-Math.abs(this._upCalculator.GetHeal(this.GetCurrentEnergy())));
		}
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
