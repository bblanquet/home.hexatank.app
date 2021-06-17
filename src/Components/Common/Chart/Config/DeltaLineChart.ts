import * as Chart from 'chart.js';
import { DeltaRecordCurve } from '../../../Comparer/Comparers/DeltaRecordCurve';
import 'chartjs-adapter-moment';

export class DeltaLineChart {
	constructor() {
		Chart.Chart.register(
			Chart.LineController,
			Chart.LineElement,
			Chart.PointElement,
			Chart.LinearScale,
			Chart.TimeScale,
			Chart.Title
		);
		Chart.defaults.color = 'white';
	}

	private Convert(curve: DeltaRecordCurve): Chart.ChartDataset[] {
		const datasets = new Array<Chart.ChartDataset>();
		datasets.push({
			borderColor: '#FFFFFF',
			data: curve.Points.map((p) => {
				return {
					x: p.X,
					y: p.Y,
					isEqualed: p.IsEqualed
				};
			}),
			pointBackgroundColor: function(context: any) {
				return (context.dataset.data[context.dataIndex] as any).isEqualed ? 'white' : 'red';
			}
		});
		return datasets;
	}
	private _chart: Chart.Chart;

	public GetChart(curves: DeltaRecordCurve): HTMLCanvasElement {
		if (this._chart) {
			this._chart.destroy();
		}

		const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
		this._chart = new Chart.Chart(canvas, {
			type: 'line',
			data: {
				datasets: this.Convert(curves)
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				elements: {
					line: {
						tension: 0
					}
				},
				scales: {
					xAxis: {
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
					},
					yAxis: {
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
				}
			}
		});
		this._chart.update();
		return canvas;
	}
}
