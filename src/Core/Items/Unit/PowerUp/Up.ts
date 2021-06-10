import { UpCondition } from './Condition/UpCondition';
import { UpAnimation } from './UpAnimation';

export class Up {
	public Animation: UpAnimation;
	constructor(private _condition: UpCondition) {}
}
