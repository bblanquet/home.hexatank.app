import { Brain } from '../../Brain';
import { IaArea } from '../../Utils/IaArea';

export interface IGlobalCondition {
	Condition(brain: Brain): IaArea;
}
