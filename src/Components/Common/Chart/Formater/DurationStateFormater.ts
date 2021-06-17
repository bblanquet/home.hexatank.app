import { StatusDuration } from '../Model/StatusDuration';
import { RecordUnit } from '../../../../Core/Framework/Record/RecordUnit';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { DurationState } from '../Model/DurationState';
import { ActionDuration } from '../Model/ActionDuration';
import { RecordAction } from '../../../../Core/Framework/Record/RecordAction';
import { RecordData } from '../../../../Core/Framework/Record/RecordData';
import { isEqual } from 'lodash';
import * as moment from 'moment';
import { RecordKind } from '../../../../Core/Framework/Record/RecordKind';

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
						result.Add(unitId, this.GetStateDurations(currentUnit, comparedUnit));
					}
				});
			}
		});
		return result;
	}

	public GetActionDurations(actions: RecordAction[]): ActionDuration[] {
		const result = new Array<ActionDuration>();
		actions.filter((a) => a.kind === RecordKind.Created || a.kind === RecordKind.Moved).forEach((a, index) => {
			if (index + 1 < actions.length) {
				result.push(new ActionDuration(a, a.X, actions[index + 1].X));
			}
		});
		return result;
	}

	public GetOverlapped(step: ActionDuration, list: ActionDuration[]): ActionDuration[] {
		const result = new Array<ActionDuration>();
		list.forEach((item) => {
			if (step.Intersects(item)) {
				result.push(item);
			}
		});
		return result;
	}

	private GetStateDurations(data: RecordUnit, compared: RecordUnit): StatusDuration[] {
		const result = new Array<StatusDuration>();
		const durations = this.GetActionDurations(data.Actions);
		const comparedDurations = this.GetActionDurations(compared.Actions);

		durations.forEach((span) => {
			const overDurations = this.GetOverlapped(span, comparedDurations);
			overDurations.forEach((overSpan) => {
				let start = overSpan.Start < span.Start ? span.Start : overSpan.Start;
				let end = span.End < overSpan.End ? span.End : overSpan.End;
				const startSeconds = moment.duration(start).asSeconds();
				const endSeconds = moment.duration(end).asSeconds();
				let state = DurationState.Ok;
				if (!isEqual(span.Action.Amount, overSpan.Action.Amount)) {
					state = DurationState.Wrong;
				}
				result.push(new StatusDuration(state, startSeconds, endSeconds, span.Action.Amount));
			});
		});
		return result;
	}
}
