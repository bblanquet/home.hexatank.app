import { RecordContent } from '../../../../Core/Framework/Record/Model/RecordContent';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { StatusDuration } from '../Model/StatusDuration';

export interface IDurationFormater {
	Format(data: RecordContent, compData: RecordContent): Dictionnary<StatusDuration[]>;
}
