import { injectable } from 'inversify';
import { RecordData } from '../../Core/Framework/Record/RecordData';
import { IRecordService } from './IRecordService';

@injectable()
export class RecordService implements IRecordService {
	private _record: RecordData;

	public Register(recordData: RecordData): void {
		this._record = recordData;
	}

	public Publish(): RecordData {
		return this._record;
	}
}