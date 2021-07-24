import { StatusDuration } from '../Model/StatusDuration';
import { RecordUnit } from '../../../../Core/Framework/Record/Model/Item/RecordUnit';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { DurationState } from '../Model/DurationState';
import { RecordStateDuration } from '../Model/RecordStateDuration';
import { RecordVehicleState } from '../../../../Core/Framework/Record/Model/Item/State/RecordVehicleState';
import { RecordContent } from '../../../../Core/Framework/Record/Model/RecordContent';
import { isEqual } from 'lodash';
import { RecordKind } from '../../../../Core/Framework/Record/Model/Item/State/RecordKind';
import { Duration } from '../Model/Duration';
import * as luxon from 'luxon';
import { IDurationFormater } from './IDurationFormater';
import { FarmCombination } from '../../../../Core/Interaction/Combination/FarmCombination';

export class VehicleDurationStateFormater implements IDurationFormater {
	public Format(record: RecordContent, compRecord: RecordContent): Dictionary<StatusDuration[]> {
		const result = new Dictionary<StatusDuration[]>();
		const startDate = record.StartDate;
		const endDate = record.EndDate < compRecord.EndDate ? record.EndDate : compRecord.EndDate;
		record.Hqs.Keys().forEach((hqId) => {
			if (record.Hqs.Exist(hqId) && compRecord.Hqs.Exist(hqId)) {
				const hq = record.Hqs.Get(hqId);
				const compHq = compRecord.Hqs.Get(hqId);
				hq.Units.Keys().forEach((unitId) => {
					if (hq.Units.Exist(unitId) && compHq.Units.Exist(unitId)) {
						const vehicle = hq.Units.Get(unitId);
						const compVehicle = compHq.Units.Get(unitId);
						const durations = this.GetStateDurations(startDate, endDate, vehicle, compVehicle);
						if (
							0 < durations.length &&
							durations.some((d) => [ DurationState.Wrong, DurationState.Late ].includes(d.Status))
						) {
							result.Add(unitId, durations);
						}
					}
				});
			}
		});
		return result;
	}

	private GetActionDurations(actions: RecordVehicleState[]): RecordStateDuration<RecordVehicleState>[] {
		const durations = new Array<RecordStateDuration<RecordVehicleState>>();
		const movingActions = actions.filter(this.IsMovingAction());
		for (let i = 0; i + 1 < movingActions.length; i++) {
			durations.push(new RecordStateDuration(movingActions[i], movingActions[i].X, movingActions[i + 1].X));
		}
		return durations;
	}

	private IsMovingAction(): (value: RecordVehicleState, index: number, array: RecordVehicleState[]) => unknown {
		return (a) => a.kind === RecordKind.Created || a.kind === RecordKind.Moved || a.kind === RecordKind.Destroyed;
	}

	private GetOverlappedIndex(step: Duration, list: RecordStateDuration<RecordVehicleState>[]): number {
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
		data.States.filter(this.IsMovingAction()).forEach((action) => {
			dates.push(action.X);
		});
		compared.States.filter(this.IsMovingAction()).forEach((action) => {
			dates.push(action.X);
		});
		return dates.sort();
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

	private GetStateDurations(
		startDate: number,
		endDate: number,
		data: RecordUnit,
		compared: RecordUnit
	): StatusDuration[] {
		const result = new Array<StatusDuration>();
		const dates = this.GetDates(data, compared);
		const emptyDurations = this.GetEmptyDurations(dates);
		const durations = this.GetActionDurations(data.States);
		const compDurations = this.GetActionDurations(compared.States);

		emptyDurations.some((emptyDuration) => {
			if (emptyDuration.End < endDate) {
				let index = this.GetOverlappedIndex(emptyDuration, durations);
				let compIndex = this.GetOverlappedIndex(emptyDuration, compDurations);

				if (index === null && compIndex === null) {
					return true;
				} else {
					let state = DurationState.Wrong;
					if (index !== null && compIndex !== null) {
						if (isEqual(durations[index].State.Amount, compDurations[compIndex].State.Amount)) {
							state = DurationState.Ok;
						} else if (this.IsLate(index, compIndex, durations, compDurations)) {
							state = DurationState.Late;
						}
					}
					const label = `${DurationState[state]} ${this.GetLabel(
						index < durations.length ? durations[index] : null,
						compIndex < compDurations.length ? compDurations[compIndex] : null,
						emptyDuration,
						startDate
					)}`;

					result.push(new StatusDuration(state, emptyDuration.Start, emptyDuration.End, label));
					return false;
				}
			}
		});
		if (0 < result.length) {
			return [ new StatusDuration(DurationState.None, startDate, result[0].Start, '') ].concat(result);
		} else {
			return [];
		}
	}

	private IsLate(
		index: number,
		compIndex: number,
		durations: RecordStateDuration<RecordVehicleState>[],
		compDuration: RecordStateDuration<RecordVehicleState>[]
	): boolean {
		return (
			(0 < index && isEqual(durations[index - 1].State.Amount, compDuration[compIndex].State.Amount)) ||
			(0 < compIndex && isEqual(durations[index].State.Amount, compDuration[compIndex - 1].State.Amount))
		);
	}

	private GetLabel(
		duration: RecordStateDuration<RecordVehicleState>,
		compAction: RecordStateDuration<RecordVehicleState>,
		emptyDuration: Duration,
		startDate: number
	): string {
		return `[${this.GetCoo(duration)}   ${this.GetCoo(compAction)}] ${this.GetDuration(
			emptyDuration.Start,
			emptyDuration.End,
			startDate
		)}`;
	}

	private GetCoo(duration: RecordStateDuration<RecordVehicleState>): string {
		if (duration) {
			return `${duration.State.Amount.Q} ${duration.State.Amount.R}`;
		} else {
			return `none`;
		}
	}

	private GetDuration(start: number, end: number, startDate: number): string {
		return `[${luxon.DateTime.fromJSDate(new Date(start - startDate)).toFormat('ss.S')} ${luxon.DateTime
			.fromJSDate(new Date(end - startDate))
			.toFormat('ss.S')}]`;
	}
}
