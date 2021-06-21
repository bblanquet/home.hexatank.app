import { IRecordState } from './IRecordState';
import { RecordKind } from './RecordKind';

export class RecordCellState implements IRecordState {
	constructor(public X: number, public kind: RecordKind) {}
}
