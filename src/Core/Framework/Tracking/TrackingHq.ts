import { TrackingUnit } from './TrackingUnit';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';

export class TrackingHq {
	public Units: Dictionnary<TrackingUnit>;
	constructor(public Name: string, public Color: string) {
		this.Units = new Dictionnary<TrackingUnit>();
	}

	GetJsonObject(): any {
		return {
			Name: this.Name,
			Color: this.Color,
			Units: this.Units.GetValues()
		};
	}
}
