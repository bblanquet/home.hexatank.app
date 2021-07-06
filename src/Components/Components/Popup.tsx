import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { Groups } from '../../Utils/Collections/Groups';
import { Curve } from '../../Utils/Stats/Curve';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import { LineChart } from '../Common/Chart/Config/LineChart';
import Icon from '../Common/Icon/IconComponent';
import ProgressComponent from '../Common/Progress/ProgressComponent';
import ChartContainer from '../Common/Chart/ChartContainer';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { IAudioService } from '../../Services/Audio/IAudioService';

export default class Popup extends Component<
	{ curves: Groups<Curve>; context: JsonRecordContent; status: GameStatus; points: number },
	{ Kind: StatsKind; Canvas: HTMLCanvasElement }
> {
	private _chart: LineChart = new LineChart();
	private _profilService: IPlayerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	private _audioService: IAudioService = Singletons.Load<IAudioService>(SingletonKey.Audio);

	componentDidMount() {
		this.setState({
			Kind: StatsKind.Unit
		});
		this._profilService.AddPoints(this.props.points);
		if (!this.state.Canvas) {
			this.UpdateState(this.state.Kind);
		}
		if (this.props.status === GameStatus.Victory) {
			this._audioService.Play(AudioArchive.victory, 0.1, false);
		}

		if (this.props.status === GameStatus.Defeat) {
			this._audioService.Play(AudioArchive.defeat, 0.1, false);
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
			<div
				class="generalContainer absolute-center-middle-menu menu-container fit-content"
				style={`border:${this.props.status === GameStatus.Victory ? 'gold' : 'crimson'} 5px solid`}
			>
				<div class="title-popup-container">
					{this.props.status === GameStatus.Victory ? (
						<div class="fill-victory light-bounce">
							<div class="fill-victory-star infinite-bounce" />
						</div>
					) : (
						<div class="fill-defeat light-bounce">
							<div class="fill-defeat-eyes fade" />
						</div>
					)}
				</div>
				<div class="container-center">
					<div class="container-center-horizontal" style="margin-top:15px;margin-bottom:15px;width:100%">
						<ProgressComponent width={80} maxWidth={0} />
					</div>

					<div class="container-center-horizontal">
						<SmActiveBtn
							left={<div class="fill-sm-tank max-width icon-space" />}
							right={<div class="fill-sm-tank max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Unit}
							callBack={() => {
								this.UpdateState(StatsKind.Unit);
							}}
						/>
						<SmActiveBtn
							left={<div class="fill-sm-hexa max-width icon-space" />}
							right={<div class="fill-sm-hexa max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Cell}
							callBack={() => {
								this.UpdateState(StatsKind.Cell);
							}}
						/>
						<SmActiveBtn
							left={<div class="fill-sm-diam max-width icon-space" />}
							right={<div class="fill-sm-diam max-width icon-space" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							isActive={this.state.Kind === StatsKind.Diamond}
							callBack={() => {
								this.UpdateState(StatsKind.Diamond);
							}}
						/>
						<SmActiveBtn
							left={<div class="fill-sm-fire max-width icon-space" />}
							right={<div class="fill-sm-fire max-width icon-space" />}
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
						<Btn
							callBack={() => {
								this.Quit();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</Btn>
					</div>
				</div>
			</div>
		);
	}
}
