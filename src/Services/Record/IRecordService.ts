import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';

export interface IRecordService {
	Register(recordData: RecordContent): void;
	Publish(): RecordContent;
}
