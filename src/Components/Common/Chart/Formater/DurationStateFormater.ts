import { StatusDuration } from '../Model/StatusDuration';
import { RecordUnit } from '../../../../Core/Framework/Record/RecordUnit';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { DurationState } from '../Model/DurationState';
import { ActionDuration } from '../Model/ActionDuration';
import { RecordAction } from '../../../../Core/Framework/Record/RecordAction';
import { RecordData } from '../../../../Core/Framework/Record/RecordData';
import { isEqual } from 'lodash';
import { RecordKind } from '../../../../Core/Framework/Record/RecordKind';
import { Duration } from '../Model/Duration';
import * as luxon from 'luxon';

export class DurationStateFormater {
	public Format(data: RecordData, comparedData: RecordData): Dictionnary<StatusDuration[]> {
		const result = new Dictionnary<StatusDuration[]>();
		data.Hqs.Keys().forEach((hqId) => {
			if (data.Hqs.Exist(hqId) && comparedData.Hqs.Exist(hqId)) {
				const currentHq = data.Hqs.Get(hqId);
				const comparedHq = comparedData.Hqs.Get(hqId);
				currentHq.Units.Keys().forEach((unitId) => {
					if (currentHq.Units.Exist(unitId) && comparedHq.Units.Exist(unitId)) {
						const currentUnit = currentHq.Units.Get(unitId);
						const comparedUnit = comparedHq.Units.Get(unitId);
						result.Add(unitId, this.GetStateDurations(data.RefDate, currentUnit, comparedUnit));
					}
				});
			}
		});
		return result;
	}

	private GetActionDurations(actions: RecordAction[]): ActionDuration[] {
		const durations = new Array<ActionDuration>();
		actions.filter((a) => a.kind === RecordKind.Created || a.kind === RecordKind.Moved).forEach((a, index) => {
			if (index + 1 < actions.length) {
				durations.push(new ActionDuration(a, a.X, actions[index + 1].X));
			}
		});
		return durations;
	}

	private GetOverlappedIndex(step: Duration, list: ActionDuration[]): number {
		let result = null;
		list.some((item, index) => {
			if (item.Includes(step)) {
				result = index;
				return true;
			}
			return false;
		});
		return result;
	}

	private GetDates(data: RecordUnit, compared: RecordUnit): number[] {
		let dates = new Array<number>();
		data.Actions.forEach((action) => {
			dates.push(action.X);
		});
		compared.Actions.forEach((action) => {
			dates.push(action.X);
		});
		return dates.filter((x, i, a) => a.indexOf(x) === i).sort();
	}

	private GetEmptyDurations(dates: number[]): Duration[] {
		const durations = new Array<Duration>();
		dates.forEach((date, index) => {
			if (index + 1 < dates.length) {
				durations.push(new Duration(dates[index], dates[index + 1]));
			}
		});
		return durations;
	}

	private GetStateDurations(refDate: number, data: RecordUnit, compared: RecordUnit): StatusDuration[] {
		const result = new Array<StatusDuration>();
		const dates = this.GetDates(data, compared);
		const emptyDurations = this.GetEmptyDurations(dates);
		const durations = this.GetActionDurations(data.Actions);
		const comparedDurations = this.GetActionDurations(compared.Actions);

		emptyDurations.forEach((emptyDuration) => {
			let index = this.GetOverlappedIndex(emptyDuration, durations);
			let comparedIndex = this.GetOverlappedIndex(emptyDuration, comparedDurations);
			let label = 'nok';
			let state = DurationState.Wrong;
			if (index !== null && comparedIndex !== null) {
				if (isEqual(durations[index].Action.Amount, comparedDurations[comparedIndex].Action.Amount)) {
					state = DurationState.Ok;
					label = `ok ${this.GetLabel(
						durations,
						index,
						comparedDurations,
						comparedIndex,
						emptyDuration,
						refDate
					)}`;
				} else if (
					(0 < index &&
						isEqual(durations[index - 1].Action.Amount, comparedDurations[comparedIndex].Action.Amount)) ||
					(0 < comparedIndex &&
						isEqual(durations[index].Action.Amount, comparedDurations[comparedIndex - 1].Action.Amount))
				) {
					label = `late ${this.GetLabel(
						durations,
						index,
						comparedDurations,
						comparedIndex,
						emptyDuration,
						refDate
					)}`;
					state = DurationState.Late;
				} else {
					label = `nok ${this.GetLabel(
						durations,
						index,
						comparedDurations,
						comparedIndex,
						emptyDuration,
						refDate
					)}`;
				}
			}

			result.push(new StatusDuration(state, emptyDuration.Start, emptyDuration.End, label));
		});
		return [ new StatusDuration(DurationState.None, refDate, result[0].Start, '') ].concat(result);
	}

	private GetLabel(
		durations: ActionDuration[],
		index: number,
		comparedDurations: ActionDuration[],
		comparedIndex: number,
		emptyDuration: Duration,
		refDate: number
	): string {
		return `[${this.GetStringPos(durations[index].Action)}   ${this.GetStringPos(
			comparedDurations[comparedIndex].Action
		)}] ${this.GetDuration(emptyDuration.Start, emptyDuration.End, refDate)}`;
	}

	private GetStringPos(action: RecordAction): string {
		return `${action.Amount.Q} ${action.Amount.R}`;
	}

	private GetDuration(start: number, end: number, refDate: number): string {
		return `[${luxon.DateTime.fromJSDate(new Date(start - refDate)).toFormat('ss.S')} ${luxon.DateTime
			.fromJSDate(new Date(end - refDate))
			.toFormat('ss.S')}]`;
	}
}
