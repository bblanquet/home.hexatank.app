import { StatusDuration } from '../Model/StatusDuration';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { DurationState } from '../Model/DurationState';
import { RecordStateDuration } from '../Model/RecordStateDuration';
import { RecordContent } from '../../../../Core/Framework/Record/Model/RecordContent';
import { isEqual } from 'lodash';
import { RecordKind } from '../../../../Core/Framework/Record/Model/Item/State/RecordKind';
import { Duration } from '../Model/Duration';
import * as luxon from 'luxon';
import { RecordCell } from '../../../../Core/Framework/Record/Model/Item/RecordCell';
import { RecordCellState } from '../../../../Core/Framework/Record/Model/Item/State/RecordCellState';
import { IDurationFormater } from './IDurationFormater';

export class CellDurationStateFormater implements IDurationFormater {
	public Format(data: RecordContent, compData: RecordContent): Dictionary<StatusDuration[]> {
		const result = new Dictionary<StatusDuration[]>();
		const startDate = data.StartDate;
		const endDate = data.EndDate < compData.EndDate ? data.EndDate : compData.EndDate;
		data.Cells.Keys().forEach((cellId) => {
			if (data.Cells.Exist(cellId) && compData.Cells.Exist(cellId)) {
				const cell = data.Cells.Get(cellId);
				const compCell = compData.Cells.Get(cellId);
				if (2 < cell.States.length && 2 < compCell.States.length) {
					compCell.States[0].X = startDate;
					cell.States[0].X = startDate;
					const durations = this.GetStateDurations(startDate, endDate, cell, compCell);
					if (
						0 < durations.length &&
						durations.some((d) => [ DurationState.Wrong, DurationState.Late ].includes(d.Status))
					) {
						result.Add(cellId, durations);
					}
				}
			}
		});
		return result;
	}

	private GetDurations(actions: RecordCellState[]): RecordStateDuration<RecordCellState>[] {
		const durations = new Array<RecordStateDuration<RecordCellState>>();
		actions.forEach((a, index) => {
			if (index + 1 < actions.length) {
				durations.push(new RecordStateDuration(a, a.X, actions[index + 1].X));
			}
		});
		return durations;
	}

	private GetOverlappedIndex(step: Duration, list: RecordStateDuration<RecordCellState>[]): number {
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

	private GetDates(data: RecordCell, compared: RecordCell): number[] {
		let dates = new Array<number>();
		data.States.forEach((action) => {
			dates.push(action.X);
		});
		compared.States.forEach((action) => {
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

	private GetStateDurations(
		startDate: number,
		endDate: number,
		data: RecordCell,
		comp: RecordCell
	): StatusDuration[] {
		const result = new Array<StatusDuration>();
		const dates = this.GetDates(data, comp);
		const emptyDurations = this.GetEmptyDurations(dates);
		const durations = this.GetDurations(data.States);
		const compDurations = this.GetDurations(comp.States);

		emptyDurations.some((emptyDuration) => {
			if (endDate < emptyDuration.End) {
				return true;
			}
			let index = this.GetOverlappedIndex(emptyDuration, durations);
			let compIndex = this.GetOverlappedIndex(emptyDuration, compDurations);
			if (index === null && compIndex === null) {
				return true;
			} else {
				let state = DurationState.Wrong;
				if (index !== null && compIndex !== null) {
					if (isEqual(durations[index].State.kind, compDurations[compIndex].State.kind)) {
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
		});
		return result;
	}

	private IsLate(
		index: number,
		compIndex: number,
		durations: RecordStateDuration<RecordCellState>[],
		compDuration: RecordStateDuration<RecordCellState>[]
	): boolean {
		return (
			(0 < index && isEqual(durations[index - 1].State.kind, compDuration[compIndex].State.kind)) ||
			(0 < compIndex && isEqual(durations[index].State.kind, compDuration[compIndex - 1].State.kind))
		);
	}

	private GetLabel(
		duration: RecordStateDuration<RecordCellState>,
		compAction: RecordStateDuration<RecordCellState>,
		emptyDuration: Duration,
		refDate: number
	): string {
		return `[${this.GetCoo(duration)}   ${this.GetCoo(compAction)}] ${this.GetDuration(
			emptyDuration.Start,
			emptyDuration.End,
			refDate
		)}`;
	}

	private GetCoo(duration: RecordStateDuration<RecordCellState>): string {
		if (duration) {
			return `${RecordKind[duration.State.kind]}`;
		} else {
			return `none`;
		}
	}

	private GetDuration(start: number, end: number, refDate: number): string {
		return `[${luxon.DateTime.fromJSDate(new Date(start - refDate)).toFormat('ss.S')} ${luxon.DateTime
			.fromJSDate(new Date(end - refDate))
			.toFormat('ss.S')}]`;
	}
}
