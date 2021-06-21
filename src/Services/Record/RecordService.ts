import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { IRecordService } from './IRecordService';

export class RecordService implements IRecordService {
	private _record: RecordContent;

	public Register(recordData: RecordContent): void {
		this._record = recordData;
	}

	public Publish(): RecordContent {
		return this._record;
	}
}
