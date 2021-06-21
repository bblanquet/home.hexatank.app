import { RecordUnit } from './Item/RecordUnit';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';

export class RecordHq {
	public Units: Dictionnary<RecordUnit>;
	constructor(public Name: string, public Color: string) {
		this.Units = new Dictionnary<RecordUnit>();
	}

	GetJsonObject(): any {
		return {
			Name: this.Name,
			Color: this.Color,
			Units: this.Units.GetValues()
		};
	}
}
