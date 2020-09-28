import { RecordData } from '../../../Core/Framework/Record/RecordData';
import { TrackingPoint } from './TrackingDelta';
export class TrackingComparer {
	constructor(private _d1: RecordData, private _d2: RecordData) {}

	public GetDelta(hqId: string, unitId: string): TrackingPoint[] {
		const d1Unit = this._d1.Hqs.Get(hqId).Units.Get(unitId);
		const d2Unit = this._d2.Hqs.Get(hqId).Units.Get(unitId);
		const deltas = new Array<TrackingPoint>();

		d1Unit.Actions.forEach((data, index) => {
			if (index <= d2Unit.Actions.length - 1) {
				const delta = new TrackingPoint();
				delta.D1 = data;
				delta.D2 = d2Unit.Actions[index];
				delta.Y = delta.D1.X - delta.D2.X;
				delta.X = index;
				delta.IsEqualed = delta.D1.Amount.Q === delta.D2.Amount.Q && delta.D1.Amount.R === delta.D2.Amount.R;
				deltas.push(delta);
			}
		});

		return deltas;
	}
}
