import { RecordAction } from '../../../Core/Framework/Record/RecordAction';

export class TrackingPoint {
	public X: number;
	public Y: number;
	public IsEqualed: boolean;
	public D1: RecordAction;
	public D2: RecordAction;
}
