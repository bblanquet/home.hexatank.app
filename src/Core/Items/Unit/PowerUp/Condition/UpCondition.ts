import { SimpleEvent } from '../../../../../Utils/Events/SimpleEvent';

export abstract class UpCondition {
	public Done: SimpleEvent = new SimpleEvent();
}
