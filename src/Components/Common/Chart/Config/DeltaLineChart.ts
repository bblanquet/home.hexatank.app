import * as Chart from 'chart.js';
import { DeltaRecordCurve } from '../../../Comparer/Comparers/DeltaRecordCurve';
import 'chartjs-adapter-moment';
import { IChart } from './IChart';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';

export class DeltaLineChart implements IChart<DeltaRecordCurve> {
	private _charts: Dictionnary<HTMLCanvasElement>;
	public OnClickElement: LiteEvent<string>;

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
		this._charts = new Dictionnary<HTMLCanvasElement>();
		this.OnClickElement = new LiteEvent<string>();
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
				if (0 < (context.dataset.data as []).length) {
					return (context.dataset.data[context.dataIndex] as any).isEqualed ? 'white' : 'red';
				} else {
					return 'white';
				}
			}
		});
		return datasets;
	}
	private _chart: Chart.Chart;

	public GetCanvas(key: string, curves: DeltaRecordCurve): HTMLCanvasElement {
		if (this._charts.Exist(key)) {
			return this._charts.Get(key);
		} else {
			const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
			this._chart = new Chart.Chart(canvas, {
				type: 'line',
				data: {
					datasets: this.Convert(curves)
				},
				options: {
					onClick(event: Chart.ChartEvent, elements: Chart.ActiveElement[], chart: Chart.Chart) {},
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
			this._charts.Add(key, canvas);
			return canvas;
		}
	}
}
