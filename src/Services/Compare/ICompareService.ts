import { StatusDuration } from '../../Ui/Common/Chart/Model/StatusDuration';
import { RecordComparer } from '../../Ui/Screens/Comparer/Comparers/RecordComparer';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { LogMessage } from '../../Utils/Logger/LogMessage';
import { IGarbage } from '../IGarbage';

export interface ICompareService extends IGarbage {
	Register(recordData: RecordContent, compareDate: RecordContent): void;
	Publish(): RecordComparer;
	GetLogs(): LogMessage[];
	GetCellDelta(): Dictionary<StatusDuration[]>;
	GetVehicleDelta(): Dictionary<StatusDuration[]>;
}
