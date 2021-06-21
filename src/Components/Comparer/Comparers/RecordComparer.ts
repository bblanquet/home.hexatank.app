import { RecordContent } from '../../../Core/Framework/Record/Model/RecordContent';
import { RecordPoint } from './RecordPoint';
export class RecordComparer {
	constructor(public Record: RecordContent, public ComparedRecord: RecordContent) {}

	public GetDelta(hqId: string, unitId: string): RecordPoint[] {
		const vehicle = this.Record.Hqs.Get(hqId).Units.Get(unitId);
		const comparedVehicle = this.ComparedRecord.Hqs.Get(hqId).Units.Get(unitId);
		const deltas = new Array<RecordPoint>();

		if (vehicle && vehicle.States) {
			vehicle.States.forEach((data, index) => {
				if (index <= comparedVehicle.States.length - 1) {
					const delta = new RecordPoint();
					delta.D1 = data;
					delta.D2 = comparedVehicle.States[index];
					delta.Y = delta.D1.X - delta.D2.X;
					delta.X = delta.D1.X;
					delta.IsEqualed =
						delta.D1.Amount.Q === delta.D2.Amount.Q && delta.D1.Amount.R === delta.D2.Amount.R;
					deltas.push(delta);
				}
			});
		}

		return deltas;
	}
}
