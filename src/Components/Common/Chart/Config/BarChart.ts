import * as Chart from 'chart.js';
import * as Zoom from 'chartjs-plugin-zoom';
import * as moment from 'moment';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { DurationState } from '../Model/DurationState';
import { StatusDuration } from '../Model/StatusDuration';

export class BarChart {
	private _chart: Chart.Chart;

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
	}

	public Exist(index: number, data: Dictionnary<StatusDuration[]>): boolean {
		return data.Keys().some((key) => index < data.Get(key).length - 1);
	}

	public GetData(index: number, value: number, length: number): Array<number> {
		const result = new Array<number>();
		for (let i = 0; i < length; i++) {
			if (i === index) {
				result.push(value);
			} else {
				result.push(0);
			}
		}
		return result;
	}

	public GetChart(data: Dictionnary<StatusDuration[]>): HTMLCanvasElement {
		const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
		Chart.defaults.color = 'white';

		const lines = new Array<any>();
		let index = 0;
		while (this.Exist(index, data)) {
			data.Keys().forEach((key, index) => {
				if (index < data.Get(key).length - 1) {
					const item = data.Get(key)[index];
					lines.push({
						data: this.GetData(index, item.GetSum(), data.Keys().length),
						label: `${item.Coo.ToString()} ${this.SetFormat(item.Start)}/${this.SetFormat(item.End)}`,
						backgroundColor: item.Status === DurationState.Ok ? 'green' : 'red'
					});
				}
			});
			index++;
		}

		const graph = {
			labels: data.Keys(),
			datasets: lines
		};

		this._chart = new Chart.Chart(canvas, {
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
		this._chart.update();
		return canvas;
	}

	private SetFormat(item: number) {
		return moment(item).format('ss.SSS');
	}
}
