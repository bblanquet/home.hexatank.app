import * as Chart from 'chart.js';
import * as Zoom from 'chartjs-plugin-zoom';
import * as moment from 'moment';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { DurationState } from '../Model/DurationState';
import { StatusDuration } from '../Model/StatusDuration';
import { IChart } from './IChart';

export class BarChart implements IChart<Dictionnary<StatusDuration[]>> {
	private _charts: Dictionnary<HTMLCanvasElement>;
	private _colors: Dictionnary<string>;
	constructor() {
		Chart.Chart.register(
			Chart.LineController,
			Chart.LinearScale,
			Chart.TimeScale,
			Chart.CategoryScale,
			Chart.BarController,
			Chart.BarElement,
			Chart.Title,
			Zoom.default
		);
		this._charts = new Dictionnary<HTMLCanvasElement>();
		this._colors = new Dictionnary<string>();
		this._colors.Add(DurationState[DurationState.None], 'rgba(0,0,0,0)');
		this._colors.Add(DurationState[DurationState.Ok], '#32CD32');
		this._colors.Add(DurationState[DurationState.Wrong], '#DC143C');
		this._colors.Add(DurationState[DurationState.Late], '#FF7F50');
	}

	public Exist(index: number, data: Dictionnary<StatusDuration[]>): boolean {
		return data.Keys().some((key) => index < data.Get(key).length - 1);
	}

	public GetData(list: string[], item: string, value: number): Array<number> {
		const result = new Array<number>();
		list.forEach((i) => {
			if (i === item) {
				result.push(value);
			} else {
				result.push(0);
			}
		});
		return result;
	}

	public GetCanvas(key: string, durations: Dictionnary<StatusDuration[]>): HTMLCanvasElement {
		if (this._charts.Exist(key)) {
			return this._charts.Get(key);
		} else {
			const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
			Chart.defaults.color = 'white';

			const graph = {
				labels: durations.Keys(),
				datasets: this.Format(durations)
			};

			const chart = new Chart.Chart(canvas, {
				type: 'bar',
				data: graph,
				options: {
					onClick(event: Chart.ChartEvent, elements: Chart.ActiveElement[], chart: Chart.Chart) {
						if (event.type === 'click') {
							chart.resetZoom();
						}
					},
					plugins: {
						zoom: {
							pan: {
								enabled: true,
								mode: 'x',
								modifierKey: 'shift',
								threshold: 10,
								onPanRejected: function({ chart }) {
									console.log(`pan is rejected!!!`);
								}
							},
							zoom: {
								pinch: {
									enabled: true
								},

								drag: {
									enabled: true
								},
								wheel: {
									enabled: true,
									modifierKey: 'shift'
								},
								mode: 'x',
								onZoomRejected: function({ chart }) {
									console.log(`zoom is rejected!!!`);
								}
							}
						}
					},
					maintainAspectRatio: false,
					indexAxis: 'y',
					responsive: true,
					scales: {
						x: {
							stacked: true
						},
						y: {
							stacked: true
						}
					}
				}
			});
			chart.update();
			this._charts.Add(key, canvas);
			return canvas;
		}
	}

	private Format(unitDurations: Dictionnary<StatusDuration[]>) {
		const lines = new Array<any>();
		let index = 0;
		while (this.Exist(index, unitDurations)) {
			unitDurations.Keys().forEach((unit) => {
				if (index < unitDurations.Get(unit).length - 1) {
					const duration = unitDurations.Get(unit)[index];
					lines.push({
						data: this.GetData(unitDurations.Keys(), unit, duration.GetSum()),
						label: `${duration.Coo.ToString()} ${this.SetFormat(duration.Start)}/${this.SetFormat(
							duration.End
						)}`,
						backgroundColor: this.GetColor(duration.Status)
					});
				}
			});
			index++;
		}
		return lines;
	}

	private GetColor(state: DurationState): string {
		return this._colors.Get(DurationState[state]);
	}

	private SetFormat(item: number) {
		return moment(item).format('ss.SSS');
	}
}