import { RecordVehicleState } from './State/RecordVehicleState';
import { IRecordItem } from './IRecordItem';

export class RecordUnit implements IRecordItem<RecordVehicleState> {
	public Id: string;
	public IsTank: boolean;
	public States: RecordVehicleState[] = new Array<RecordVehicleState>();
}
