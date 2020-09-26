import { h, Component } from 'preact';
import { route } from 'preact-router';
import { Groups } from '../../Core/Utils/Collections/Groups';
import { Curve } from '../../Core/Utils/Stats/Curve';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import { GameStatus } from '../Canvas/GameStatus';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import SmActiveIconButtonComponent from '../Common/Button/Stylish/SmActiveIconButtonComponent';
import { ChartProvider } from './ChartProvider';

export default class PopupComponent extends Component<
	{ curves: Groups<Curve>; context: any; status: GameStatus },
	{ Kind: StatsKind }
> {
	private _isFirstRender = true;
	private _chartProvider: ChartProvider;
	private _canvas: HTMLCanvasElement;
	constructor() {
		super();
		this._chartProvider = new ChartProvider();
		this.setState({
			Kind: StatsKind.Unit
		});
	}

	componentDidMount() {
		this._isFirstRender = false;
		this._chartProvider.AttachChart(
			StatsKind[this.state.Kind],
			this.props.curves.Get(StatsKind[this.state.Kind]),
			this._canvas
		);
	}

	componentDidUpdate() {
		this._chartProvider.AttachChart(
			StatsKind[this.state.Kind],
			this.props.curves.Get(StatsKind[this.state.Kind]),
			this._canvas
		);
	}

	private Quit(): void {
		route('/Home', true);
	}

	private Save(): void {
		const url = document.createElement('a');
		const file = new Blob([ JSON.stringify(this.props.context) ], { type: 'application/json' });
		url.href = URL.createObjectURL(file);
		url.download = `${this.props.context.Title}.json`;
		url.click();
		URL.revokeObjectURL(url.href);
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					{this.props.status === GameStatus.Won ? <div class="fill-won" /> : <div class="fill-defeat" />}
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
						<SmActiveIconButtonComponent
							isActive={this.state.Kind === StatsKind.Unit}
							style={'fill-sm-tank'}
							callBack={() => {
								this.setState({
									Kind: StatsKind.Unit
								});
							}}
						/>
						<SmActiveIconButtonComponent
							isActive={this.state.Kind === StatsKind.Cell}
							style={'fill-sm-hexa'}
							callBack={() => {
								this.setState({
									Kind: StatsKind.Cell
								});
							}}
						/>
						<SmActiveIconButtonComponent
							isActive={this.state.Kind === StatsKind.Diamond}
							style={'fill-sm-diam '}
							callBack={() => {
								this.setState({
									Kind: StatsKind.Diamond
								});
							}}
						/>
						<SmActiveIconButtonComponent
							isActive={this.state.Kind === StatsKind.Energy}
							style={'fill-sm-power'}
							callBack={() => {
								this.setState({
									Kind: StatsKind.Energy
								});
							}}
						/>
					</div>
					<canvas
						style="border-radius: 10px; margin-top:30px; margin-bottom:20px"
						ref={(e) => {
							this._canvas = e;
						}}
					/>
					<div class="container-center-horizontal">
						<BlackButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Back'}
							isFirstRender={this._isFirstRender}
							callBack={() => {
								this.Quit();
							}}
						/>
						<RedButtonComponent
							icon={'fas fa-save'}
							title={'Save'}
							isFirstRender={this._isFirstRender}
							callBack={() => {
								this.Save();
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}
