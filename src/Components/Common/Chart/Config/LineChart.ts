import * as Chart from 'chart.js';
import * as Zoom from 'chartjs-plugin-zoom';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { Curve } from '../../../../Core/Utils/Stats/Curve';
import { IChart } from './IChart';
import 'chartjs-adapter-moment';

export class LineChart implements IChart<Curve[]> {
	private _charts: Dictionnary<HTMLCanvasElement>;

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
		this._charts = new Dictionnary<HTMLCanvasElement>();
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
