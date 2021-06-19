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
import { HexAxial } from '../../../../Core/Utils/Geometry/HexAxial';

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

	private GetOverlapped(step: Duration, list: ActionDuration[]): ActionDuration[] {
		const result = new Array<ActionDuration>();
		list.forEach((item) => {
			if (step.Intersects(item)) {
				result.push(item);
			}
		});
		return result;
	}

	public GetDates(data: RecordUnit, compared: RecordUnit): number[] {
		let dates = new Array<number>();
		data.Actions.forEach((action) => {
			dates.push(action.X);
		});
		compared.Actions.forEach((action) => {
			dates.push(action.X);
		});
		return dates.filter((x, i, a) => a.indexOf(x) === i).sort();
	}

	public GetEmptyDurations(dates: number[]): Duration[] {
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
			let duration = this.GetOverlapped(emptyDuration, durations);
			let comparedDuration = this.GetOverlapped(emptyDuration, comparedDurations);

			let state = DurationState.Wrong;
			if (
				0 < duration.length &&
				0 < comparedDuration.length &&
				isEqual(duration[0].Action.Amount, comparedDuration[0].Action.Amount)
			) {
				state = DurationState.Ok;
			}
			result.push(new StatusDuration(state, emptyDuration.Start, emptyDuration.End, new HexAxial(1, 1)));
		});
		return [ new StatusDuration(DurationState.None, refDate, result[0].Start, new HexAxial(1, 1)) ].concat(result);
	}
}
