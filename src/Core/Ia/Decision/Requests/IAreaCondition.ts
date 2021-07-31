import { BrainArea } from '../Utils/BrainArea';

export interface IAreaCondition {
	Condition(area: BrainArea): boolean;
}
