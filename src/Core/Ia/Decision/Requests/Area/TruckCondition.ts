import { IAreaCondition } from '../IAreaCondition';
import { BrainArea } from '../../Utils/BrainArea';

export class TruckCondition implements IAreaCondition {
	constructor(private _threshold: number) {}
	Condition(area: BrainArea): boolean {
		return area.GetSpot().HasDiamond() && area.GetTrucks().length < this._threshold;
	}
}
