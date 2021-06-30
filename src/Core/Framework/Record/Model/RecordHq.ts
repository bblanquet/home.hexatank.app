import { RecordUnit } from './Item/RecordUnit';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';

export class RecordHq {
	public Units: Dictionary<RecordUnit>;
	constructor(public Name: string, public Color: string) {
		this.Units = new Dictionary<RecordUnit>();
	}

	ToJsonObj(): any {
		return {
			Name: this.Name,
			Color: this.Color,
			Units: this.Units.GetValues()
		};
	}
}
