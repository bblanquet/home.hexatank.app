import { TrackingCell } from './TrackingCell';
import { TrackingHq } from './TrackingHq';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
export class TrackingData {
	public Dates: number[] = [];
	public Hqs: Dictionnary<TrackingHq> = new Dictionnary<TrackingHq>();
	public Cells: Dictionnary<TrackingCell> = new Dictionnary<TrackingCell>();
}
