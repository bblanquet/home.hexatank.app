import * as Chart from 'chart.js';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Curve } from '../../Core/Utils/Stats/Curve';
import { DateValue } from '../../Core/Utils/Stats/DateValue';

export class ChartProvider {
	private _cache: Dictionnary<Chart>;

	constructor() {
		this._cache = new Dictionnary<Chart>();
	}

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

	public AttachChart(cacheKey: string, curves: Curve[], div: HTMLCanvasElement): void {
		if (this._cache.Exist(cacheKey)) {
			const chart = this._cache.Get(cacheKey);
			chart.canvas = div;
			chart.update();
		} else {
			const ps = curves.reduce((a, b) => a.concat(b.Points), new Array<DateValue>()).map((p) => p.Amount);
			const min = Math.min(...ps);
			const max = Math.max(...ps);
			const step = Math.round(max / 5);

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
									max: max,
									min: min,
									stepSize: step
								}
							}
						]
					}
				}
			});
			chart.canvas = div;
			Chart.defaults.global.defaultFontColor = 'white';
			this._cache.Add(cacheKey, chart);
		}
	}
}
