import { StatusDuration } from '../../Components/Common/Chart/Model/StatusDuration';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { LogMessage } from '../../Utils/Logger/LogMessage';
import { CellDurationStateFormater } from '../../Components/Common/Chart/Formater/CellDurationStateFormater';
import { VehicleDurationStateFormater } from '../../Components/Common/Chart/Formater/VehicleDurationStateFormater';
import { ICompareService } from './ICompareService';
import { RecordComparer } from '../../Components/Model/RecordComparer';
import { LogKind } from '../../Utils/Logger/LogKind';

export class CompareService implements ICompareService {
	private _record: RecordContent;
	private _compareRecord: RecordContent;
	private _logs: LogMessage[];

	Register(recordData: RecordContent, compareDate: RecordContent): void {
		this._record = recordData;
		this._compareRecord = compareDate;
		this.SetData(this._record.PlayerName, this._record.Messages);
		this.SetData(this._compareRecord.PlayerName, this._compareRecord.Messages);
		this._logs = this._record.Messages.concat(this._compareRecord.Messages).sort((a, b) => a.Date - b.Date);
		this.Formater();
	}
	private Formater() {
		this._logs.forEach((l) => {
			if (l.Kind === undefined || l.Kind === null) {
				l.Kind = LogKind.info;
			}
			if (l.Author === undefined || l.Author === null) {
				l.Author = 'none';
			}
			if (l.Content === undefined || l.Content === null) {
				l.Content = 'none';
			}
			if (l.Date === undefined || l.Date === null) {
				l.Date = new Date().getTime();
			}
		});
	}

	private SetData(author: string, messages: LogMessage[]) {
		messages.forEach((m) => {
			m.Author = author;
			m.Date = m.Date - this._record.StartDate;
		});
	}

	Publish(): RecordComparer {
		const comparer = new RecordComparer(this._record, this._compareRecord);
		return comparer;
	}

	GetCellDelta(): Dictionary<StatusDuration[]> {
		return new CellDurationStateFormater().Format(this._record, this._compareRecord);
	}

	GetVehicleDelta(): Dictionary<StatusDuration[]> {
		return new VehicleDurationStateFormater().Format(this._record, this._compareRecord);
	}

	GetLogs(): LogMessage[] {
		return this._logs;
	}

	Collect(): void {}
}
