import { StatusDuration } from '../../UI/Common/Chart/Model/StatusDuration';
import { RecordComparer } from '../../UI/Screens/Comparer/Comparers/RecordComparer';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { Dictionary } from '../../Core/Utils/Collections/Dictionary';
import { LogMessage } from '../../Core/Utils/Logger/LogMessage';
import { IGarbage } from '../IGarbage';

export interface ICompareService extends IGarbage {
	Register(recordData: RecordContent, compareDate: RecordContent): void;
	Publish(): RecordComparer;
	GetLogs(): LogMessage[];
	GetCellDelta(): Dictionary<StatusDuration[]>;
	GetVehicleDelta(): Dictionary<StatusDuration[]>;
}
