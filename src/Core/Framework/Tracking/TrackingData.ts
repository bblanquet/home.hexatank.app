import { TrackingHq } from './TrackingHq';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
export class TrackingData {
	public Dates: number[] = [];
	public TrackingHq: Dictionnary<TrackingHq> = new Dictionnary<TrackingHq>();
}
