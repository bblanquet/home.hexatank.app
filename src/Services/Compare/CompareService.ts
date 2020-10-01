import { RecordData } from '../../Core/Framework/Record/RecordData';
import { ICompareService } from './ICompareService';

export class CompareService implements ICompareService {
	private _record: RecordData;
	private _compareRecord: RecordData;

	Register(recordData: RecordData, compareDate: RecordData): void {
		this._record = recordData;
		this._compareRecord = compareDate;
	}
	Publish(): RecordData[] {
		return [ this._record, this._compareRecord ];
	}

	Collect(): void {
		throw new Error('Method not implemented.');
	}
}
