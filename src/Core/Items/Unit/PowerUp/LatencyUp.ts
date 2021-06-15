import { Vehicle } from '../Vehicle';
import { UpCondition } from './Condition/UpCondition';
import { Up } from './Up';

export class LatencyUp extends Up {
	constructor(vehicle: Vehicle, condition: UpCondition, speed: number) {
		super(vehicle, condition, speed);
	}

	public OnEnergyChanged(formerSpeed: number, speed: number): void {
		this.Vehicle.SetTranslationDuration(formerSpeed);
		this.Vehicle.SetTranslationDuration(-speed);
	}
}
