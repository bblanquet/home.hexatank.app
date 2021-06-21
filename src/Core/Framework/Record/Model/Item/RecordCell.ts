import { RecordCellState } from './State/RecordCellState';
import { IRecordItem } from './IRecordItem';

export class RecordCell implements IRecordItem<RecordCellState> {
	public States: RecordCellState[];
}
