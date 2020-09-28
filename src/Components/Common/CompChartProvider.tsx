import * as Chart from 'chart.js';
import { TrackingCurve } from '../Comparer/Comparers/TrackingCurve';

export class CompChartProvider {
	constructor() {}

	private Convert(curve: TrackingCurve): Chart.ChartDataSets[] {
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

	public AttachChart(curves: TrackingCurve, div: HTMLCanvasElement): Chart {
		const ps = curves.Points.map((p) => p.Y);
		const max = Math.max(...ps);
		let step = Math.round(max / 5);
		if (step === 0) {
			step = 1;
		}

		const chart = new Chart(div, {
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
							type: 'linear',
							ticks: {
								stepSize: 1
							}
						}
					],
					yAxes: [
						{
							type: 'time',
							time: {
								unitStepSize: step,
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
		chart.canvas = div;
		Chart.defaults.global.defaultFontColor = 'white';
		return chart;
	}
}
