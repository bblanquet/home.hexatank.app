import { StatusDuration } from '../../Components/Common/Chart/Model/StatusDuration';
import { RecordComparer } from '../../Components/Comparer/Comparers/RecordComparer';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { IGarbage } from '../IGarbage';

export interface ICompareService extends IGarbage {
	Register(recordData: RecordContent, compareDate: RecordContent): void;
	Publish(): RecordComparer;
	GetCellDelta(): Dictionnary<StatusDuration[]>;
	GetVehicleDelta(): Dictionnary<StatusDuration[]>;
}
