import { UpCondition } from './Condition/UpCondition';
import { UpAnimation } from './UpAnimation';

export class Up {
	constructor(private _condition: UpCondition, public Animation: UpAnimation) {}
}
