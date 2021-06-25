import { Vehicle } from '../Vehicle';
import { UpCondition } from './Condition/UpCondition';
import { Up } from './Up';

export class LatencyUp extends Up {
	constructor(vehicle: Vehicle, condition: UpCondition, speed: number) {
		super(vehicle, condition, speed);
		this.HasAnimation = false;
	}

	public OnEnergyChanged(formerSpeed: number, speed: number): void {}
}
