import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Groups } from '../../Core/Utils/Collections/Groups';
import { Curve } from '../../Core/Utils/Stats/Curve';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import { ChartProvider } from '../Common/ChartProvider';
import Icon from '../Common/Icon/IconComponent';

export default class PopupComponent extends Component<
	{ curves: Groups<Curve>; context: any; status: GameStatus },
	{ Kind: StatsKind }
> {
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
						<SmActiveButtonComponent
							left={<div class="fill-sm-tank max-width icon-space" />}
							right={<div class="fill-sm-tank max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Unit}
							callBack={() => {
								this.setState({
									Kind: StatsKind.Unit
								});
							}}
						/>
						<SmActiveButtonComponent
							left={<div class="fill-sm-hexa max-width icon-space" />}
							right={<div class="fill-sm-hexa max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Cell}
							callBack={() => {
								this.setState({
									Kind: StatsKind.Cell
								});
							}}
						/>
						<SmActiveButtonComponent
							left={<div class="fill-sm-diam max-width icon-space" />}
							right={<div class="fill-sm-diam max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Diamond}
							callBack={() => {
								this.setState({
									Kind: StatsKind.Diamond
								});
							}}
						/>
						<SmActiveButtonComponent
							left={<div class="fill-sm-power max-width icon-space" />}
							right={<div class="fill-sm-power max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Energy}
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
						<ButtonComponent
							callBack={() => {
								this.Quit();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
						<ButtonComponent
							callBack={() => {
								this.Save();
							}}
							color={ColorKind.Red}
						>
							<Icon Value="fas fa-save" /> Save
						</ButtonComponent>
					</div>
				</div>
			</div>
		);
	}
}
