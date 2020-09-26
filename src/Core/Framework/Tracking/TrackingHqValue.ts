import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { TrackingUnitValue } from './TrackingUnitValue';
export class TrackingHqValue {
	public Units: Dictionnary<TrackingUnitValue[]>;
	public Cells: Dictionnary<TrackingUnitValue[]>;

	constructor(public Name: string, public Color: string) {
		this.Units = new Dictionnary<TrackingUnitValue[]>();
		this.Cells = new Dictionnary<TrackingUnitValue[]>();
	}

	GetJsonObject(): any {
		return {
			Name: this.Name,
			Color: this.Color,
			Units: this.Units.GetValues()
		};
	}
}
