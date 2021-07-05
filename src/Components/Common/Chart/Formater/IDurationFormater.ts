import { RecordContent } from '../../../../Core/Framework/Record/Model/RecordContent';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { StatusDuration } from '../Model/StatusDuration';

export interface IDurationFormater {
	Format(data: RecordContent, compData: RecordContent): Dictionary<StatusDuration[]>;
}
