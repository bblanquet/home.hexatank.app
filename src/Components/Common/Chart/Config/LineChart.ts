import * as Chart from 'chart.js';
import * as Zoom from 'chartjs-plugin-zoom';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { Curve } from '../../../../Utils/Stats/Curve';
import { IChart } from './IChart';
import 'chartjs-adapter-luxon';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';

export class LineChart implements IChart<Curve[]> {
	private _charts: Dictionary<HTMLCanvasElement>;
	public OnClickElement: LiteEvent<string>;

	constructor() {
		Chart.Chart.register(
			Chart.LineController,
			Chart.LineElement,
			Chart.PointElement,
			Chart.LinearScale,
			Chart.TimeScale,
			Chart.Title,
			Zoom.default
		);
		Chart.defaults.color = 'white';
		this._charts = new Dictionary<HTMLCanvasElement>();
	}

	private Convert(curves: Curve[]): Chart.ChartDataset[] {
		const datasets = new Array<Chart.ChartDataset>();
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

	public GetCanvas(chartKey: string, curves: Curve[]): HTMLCanvasElement {
		if (this._charts.Exist(chartKey)) {
			return this._charts.Get(chartKey);
		} else {
			const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
			new Chart.Chart(canvas, {
				type: 'line',
				data: {
					datasets: this.Convert(curves)
				},
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
								threshold: 10
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
								mode: 'x'
							}
						}
					},
					maintainAspectRatio: false,
					responsive: true,
					elements: {
						line: {
							tension: 0
						}
					},
					scales: {
						x: {
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
					}
				}
			});
			this._charts.Add(chartKey, canvas);
			return canvas;
		}
	}
}
