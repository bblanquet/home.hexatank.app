import * as Chart from 'chart.js';
import { DeltaRecordCurve } from '../Comparer/Comparers/DeltaRecordCurve';

export class CompChartProvider {
	constructor() {}

	private Convert(curve: DeltaRecordCurve): Chart.ChartDataSets[] {
		const datasets = new Array<Chart.ChartDataSets>();
		datasets.push({
			borderColor: '#FFFFFF',
			data: curve.Points.map((p) => {
				return {
					x: p.X,
					y: p.Y,
					isEqualed: p.IsEqualed
				};
			}),
			pointBackgroundColor: function(context) {
				return (context.dataset.data[context.dataIndex] as any).isEqualed ? 'white' : 'red';
			}
		});
		return datasets;
	}
	private _chart: Chart;

	public AttachChart(curves: DeltaRecordCurve, div: HTMLCanvasElement): Chart {
		// const ps = curves.Points.map((p) => p.Y);
		// const max = Math.max(...ps);
		// let step = Math.abs(Math.round(max / 5));
		// if (step === 0) {
		// 	step = 1;
		// }

		if (this._chart) {
			this._chart.destroy();
		}

		this._chart = new Chart(div, {
			type: 'line',
			data: {
				datasets: this.Convert(curves)
			},
			options: {
				elements: {
					line: {
						tension: 0
					}
				},
				tooltips: {
					enabled: false
				},
				legend: {
					display: false
				},
				scales: {
					xAxes: [
						{
							type: 'time',
							time: {
								displayFormats: {
									millisecond: 'ss.SSS',
									second: 'ss.SSS',
									minute: 'ss.SSS',
									hour: 'ss.SSS',
									day: 'ss.SSS',
									week: 'ss.SSS',
									month: 'ss.SSS',
									quarter: 'ss.SSS',
									year: 'ss.SSS'
								}
							}
						}
					],
					yAxes: [
						{
							type: 'time',
							time: {
								displayFormats: {
									millisecond: 'ss.SSS',
									second: 'ss.SSS',
									minute: 'ss.SSS',
									hour: 'ss.SSS',
									day: 'ss.SSS',
									week: 'ss.SSS',
									month: 'ss.SSS',
									quarter: 'ss.SSS',
									year: 'ss.SSS'
								}
							}
						}
					]
				}
			}
		});
		this._chart.canvas = div;
		Chart.defaults.global.defaultFontColor = 'white';
		this._chart.update();
		return this._chart;
	}
}
