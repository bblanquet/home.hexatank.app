import { RecordAction } from './RecordAction';
export class RecordUnit {
	public Id: string;
	public IsTank: boolean;
	public Actions: RecordAction[] = new Array<RecordAction>();
}
