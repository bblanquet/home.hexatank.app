import { TrackingAction } from './TrackingAction';
export class TrackingUnit {
	public Id: string;
	public IsTank: boolean;
	public Actions: TrackingAction[] = new Array<TrackingAction>();
}
