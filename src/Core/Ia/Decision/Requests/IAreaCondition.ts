import { IaArea } from '../Utils/IaArea';

export interface IAreaCondition {
	Condition(area: IaArea): boolean;
}
