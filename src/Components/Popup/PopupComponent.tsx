import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { Groups } from '../../Core/Utils/Collections/Groups';
import { Curve } from '../../Core/Utils/Stats/Curve';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import { LineChart } from '../Common/Chart/Config/LineChart';
import Icon from '../Common/Icon/IconComponent';
import ProgressComponent from '../Common/Progress/ProgressComponent';
import ChartContainer from '../../Components/Common/Chart/ChartContainer';

export default class PopupComponent extends Component<
	{ curves: Groups<Curve>; context: JsonRecordContent; status: GameStatus; points: number },
	{ Kind: StatsKind; Canvas: HTMLCanvasElement }
> {
	private _chart: LineChart = new LineChart();
	private _profilService: IPlayerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);

	constructor() {
		super();
		this.setState({
			Kind: StatsKind.Unit
		});
	}

	componentDidMount() {
		this._profilService.AddPoints(this.props.points);
		if (!this.state.Canvas) {
			this.UpdateState(this.state.Kind);
		}
	}
	componentDidUpdate() {
		if (!this.state.Canvas) {
			this.UpdateState(this.state.Kind);
		}
	}

	private UpdateState(kind: StatsKind): void {
		const curves = this.props.curves.Get(StatsKind[kind]);
		if (curves) {
			this.setState({
				Kind: kind,
				Canvas: this._chart.GetCanvas(StatsKind[kind], curves)
			});
		}
	}

	private Quit(): void {
		route('{{sub_path}}Home', true);
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
								this.UpdateState(StatsKind.Unit);
							}}
						/>
						<SmActiveButtonComponent
							left={<div class="fill-sm-hexa max-width icon-space" />}
							right={<div class="fill-sm-hexa max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Cell}
							callBack={() => {
								this.UpdateState(StatsKind.Cell);
							}}
						/>
						<SmActiveButtonComponent
							left={<div class="fill-sm-diam max-width icon-space" />}
							right={<div class="fill-sm-diam max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Diamond}
							callBack={() => {
								this.UpdateState(StatsKind.Diamond);
							}}
						/>
						<SmActiveButtonComponent
							left={<div class="fill-sm-power max-width icon-space" />}
							right={<div class="fill-sm-power max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Energy}
							callBack={() => {
								this.UpdateState(StatsKind.Energy);
							}}
						/>
					</div>
					<ChartContainer canvas={this.state.Canvas} height={null} />
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
