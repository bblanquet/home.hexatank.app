import { UpCondition } from './UpCondition';

export class TimeUpCondition extends UpCondition {
	public constructor() {
		super();
		setTimeout(() => {
			this.Done.Invoke();
		}, 20000);
	}
}
