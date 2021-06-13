import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { RecordObject } from '../../Core/Framework/Record/RecordObject';
import { Groups } from '../../Core/Utils/Collections/Groups';
import { Curve } from '../../Core/Utils/Stats/Curve';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import { ChartProvider } from '../Common/ChartProvider';
import Icon from '../Common/Icon/IconComponent';
import ProgressComponent from '../Common/Progress/ProgressComponent';

export default class PopupComponent extends Component<
	{ curves: Groups<Curve>; context: RecordObject; status: GameStatus; points: number },
	{ Kind: StatsKind; points: number, remainingPoints: number }
> {
	private _chartProvider: ChartProvider;
	private _canvas: HTMLCanvasElement;
	private _profilService: IPlayerProfilService;
	constructor() {
		super();
		this._chartProvider = new ChartProvider();
		this.setState({
			Kind: StatsKind.Unit
		});
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._profilService.OnPointChanged.On(() => this.setState({ Kind: this.state.Kind }));
	}

	componentDidMount() {
		this.setState({
			points: this.props.points,
			remainingPoints: this.props.points
		});
		this._chartProvider.AttachChart(
			StatsKind[this.state.Kind],
			this.props.curves.Get(StatsKind[this.state.Kind]),
			this._canvas
		);
		this.AddPoint();
	}

	private AddPoint() {
		setTimeout(() => {
			const remainingPoints = this.state.remainingPoints - 1;
			this.setState({
				points: this._profilService.AddPoint(1),
				remainingPoints: remainingPoints
			});
			if (0 < this.state.remainingPoints) {
				this.AddPoint();
			}
		}, 200);
	}

	componentDidUpdate() {
		this._chartProvider.AttachChart(
			StatsKind[this.state.Kind],
			this.props.curves.Get(StatsKind[this.state.Kind]),
			this._canvas
		);
	}

	private Quit(): void {
		//this._profilService.Update();
		route('/Home', true);
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					{this.props.status === GameStatus.Victory ? (
						<div class="fill-won light-bounce" />
					) : (
						<div class="fill-defeat light-bounce" />
					)}
				</div>
				<div class="container-center">
					<div class="container-center-horizontal" style="margin-top:15px;margin-bottom:15px;width:100%">
						<ProgressComponent width={80} maxWidth={0} />
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
					</div>
				</div>
			</div>
		);
	}
}
