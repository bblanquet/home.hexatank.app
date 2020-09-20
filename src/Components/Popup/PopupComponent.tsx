import * as Chart from 'chart.js';
import { h, Component } from 'preact';
import { route } from 'preact-router';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import SmBlackIconButtonComponent from '../Common/Button/Stylish/SmBlackIconButtonComponent';
import SmRedIconButtonComponent from '../Common/Button/Stylish/SmRedIconButtonComponent';

export default class PopupComponent extends Component<any, any> {
	private _isFirstRender = true;
	private _canvas: HTMLCanvasElement;
	private _chart: Chart;
	constructor() {
		super();
	}

	componentDidMount() {
		this._isFirstRender = false;
		this._chart = new Chart(this._canvas, {
			// The type of chart we want to create
			type: 'line',
			// The data for our dataset
			data: {
				labels: [ '0', '1', '2', '3', '4', '5', '6' ],
				datasets: [
					{
						label: '',
						borderColor: '#9F6A6A',
						data: [ 0, 10, 5, 2, 4, 1, 6 ]
					},
					{
						label: '',
						borderColor: '#6A899F',
						data: [ 0, 1, 4, 6, 1, 3, 2 ]
					},
					{
						label: '',
						borderColor: '#9F8E6A',
						data: [ 0, 4, 2, 6, 6, 2, 3 ]
					}
				]
			},

			// Configuration options go here
			options: {
				scales: {
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

	render() {
		return (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					<div class="fill-defeat" />
				</div>
				<div class="container-center">
					<div class="input-group mb-3" style="padding-left:20%;padding-right:20%">
						<div class="input-group-prepend">
							<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
								Score
							</span>
						</div>
						<input
							disabled
							type="text"
							value="3000"
							class="form-control"
							aria-label="Default"
							aria-describedby="inputGroup-sizing-default"
						/>
					</div>

					<div class="container-center-horizontal">
						<SmRedIconButtonComponent style={'fill-sm-tank'} callBack={() => {}} />
						<SmBlackIconButtonComponent style={'fill-sm-hexa'} callBack={() => {}} />
						<SmBlackIconButtonComponent style={'fill-sm-diam '} callBack={() => {}} />
						<SmBlackIconButtonComponent style={'fill-sm-power'} callBack={() => {}} />
					</div>
					<canvas
						style="background-color:rgba(255, 255, 255, .1); border-radius: 10px; margin-top:20px; margin-bottom:20px"
						ref={(e) => {
							this._canvas = e;
						}}
					/>
					<div class="container-center-horizontal">
						<BlackButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Back'}
							isFirstRender={this._isFirstRender}
							callBack={() => {}}
						/>
						<RedButtonComponent
							icon={'fas fa-sync-alt'}
							title={'Retry'}
							isFirstRender={this._isFirstRender}
							callBack={() => {}}
						/>
					</div>
				</div>
			</div>
		);
	}
}
