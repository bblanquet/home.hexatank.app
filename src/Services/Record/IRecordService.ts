import { RecordData } from '../../Core/Framework/Record/RecordData';

export interface IRecordService {
	Register(recordData: RecordData): void;
	Publish(): RecordData;
}
