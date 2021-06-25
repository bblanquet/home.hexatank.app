import { StatusDuration } from '../../Components/Common/Chart/Model/StatusDuration';
import { RecordComparer } from '../../Components/Comparer/Comparers/RecordComparer';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { LogMessage } from '../../Core/Utils/Logger/LogMessage';
import { CellDurationStateFormater } from './../../Components/Common/Chart/Formater/CellDurationStateFormater';
import { VehicleDurationStateFormater } from './../../Components/Common/Chart/Formater/VehicleDurationStateFormater';
import { ICompareService } from './ICompareService';

export class CompareService implements ICompareService {
	private _record: RecordContent;
	private _compareRecord: RecordContent;

	Register(recordData: RecordContent, compareDate: RecordContent): void {
		this._record = recordData;
		this._compareRecord = compareDate;
	}
	Publish(): RecordComparer {
		const comparer = new RecordComparer(this._record, this._compareRecord);
		return comparer;
	}

	GetCellDelta(): Dictionnary<StatusDuration[]> {
		return new CellDurationStateFormater().Format(this._record, this._compareRecord);
	}

	GetVehicleDelta(): Dictionnary<StatusDuration[]> {
		return new VehicleDurationStateFormater().Format(this._record, this._compareRecord);
	}

	GetLogs(): LogMessage[] {
		this._record.Messages.forEach((m) => (m.Author = this._record.PlayerName));
		this._compareRecord.Messages.forEach((m) => (m.Author = this._compareRecord.PlayerName));
		return this._record.Messages.concat(this._compareRecord.Messages).sort((a, b) => a.Date - b.Date);
	}

	Collect(): void {}
}
