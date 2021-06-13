import { RecordComparer } from '../../Components/Comparer/Comparers/RecordComparer';
import { RecordData } from '../../Core/Framework/Record/RecordData';
import { IGarbage } from '../IGarbage';

export interface ICompareService extends IGarbage {
	Register(recordData: RecordData, compareDate: RecordData): void;
	Publish(): RecordComparer;
}
