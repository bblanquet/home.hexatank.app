import { RecordKind } from './RecordKind';
import { IRecordState } from './IRecordState';
import { HexAxial } from '../../../../../../Utils/Geometry/HexAxial';
export class RecordVehicleState implements IRecordState {
	//X date
	constructor(public X: number, public Amount: HexAxial, public kind: RecordKind, public life: number) {}
}
