import { IAreaCondition } from '../IAreaCondition';
import { IaArea } from '../../Utils/IaArea';

export class TruckCondition implements IAreaCondition {
	constructor(private _threshold: number) {}
	Condition(area: IaArea): boolean {
		return area.GetSpot().HasDiamond() && area.GetTrucks().length < this._threshold;
	}
}
