import { RecordCell } from './RecordCell';
import { RecordHq } from './RecordHq';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
export class RecordData {
	public Dates: number[] = [];
	public Hqs: Dictionnary<RecordHq> = new Dictionnary<RecordHq>();
	public Cells: Dictionnary<RecordCell> = new Dictionnary<RecordCell>();
	public Interactions: string[] = [];
}
