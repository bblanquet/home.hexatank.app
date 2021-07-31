import { Brain } from '../../Brain';
import { GlobalRequestResult } from './GlobalRequestResult';

export interface IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult;
}
