import * as Chart from 'chart.js';
import * as moment from 'moment';
import { Curve } from '../../Core/Utils/Stats/Curve';

export class ChartProvider {
	private Convert(curves: Curve[]): Chart.ChartDataSets[] {
		const datasets = new Array<Chart.ChartDataSets>();
		curves.forEach((curve) => {
			datasets.push({
				borderColor: curve.Color,
				data: curve.Points.map((p) => {
					return {
						x: p.X,
						y: p.Amount
					};
				})
			});
		});
		return datasets;
	}

	public AttachChart(curves: Curve[], div: HTMLCanvasElement): void {
		new Chart(div, {
			type: 'line',
			data: {
				datasets: this.Convert(curves)
			},
			options: {
				legend: {
					display: false
				},
				scales: {
					xAxes: [
						{
							type: 'time',
							time: {
								displayFormats: {
									millisecond: 'mm:ss',
									second: 'mm:ss',
									minute: 'mm:ss',
									hour: 'mm:ss',
									day: 'mm:ss',
									week: 'mm:ss',
									month: 'mm:ss',
									quarter: 'mm:ss',
									year: 'mm:ss'
								}
							}
						}
					],
					yAxes: [
						{
							ticks: {
								max: 10,
								min: 0,
								stepSize: 2
							}
						}
					]
				}
			}
		});
		Chart.defaults.global.defaultFontColor = 'white';
	}

	private GetDuration(seconds: number): string | number | Date | moment.Moment {
		return new Date().setSeconds(seconds) - new Date().getDate();
	}
}
