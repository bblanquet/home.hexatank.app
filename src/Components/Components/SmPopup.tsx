import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import { Singletons, SingletonKey } from '../../Singletons';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ProgressComponent from '../Common/Progress/ProgressComponent';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import Switch from './Switch';
import Visible from './Visible';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { IAppService } from '../../Services/App/IAppService';
import { IKeyService } from '../../Services/Key/IKeyService';

export default class SmPopup extends Component<{ status: GameStatus }, { Kind: StatsKind }> {
	private _audioService: IAudioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
	private _appService: IAppService<IBlueprint>;
	private _keyService: IKeyService;

	constructor() {
		super();
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService<IBlueprint>>(this._keyService.GetAppKey());
	}

	componentDidMount() {
		this.setState({
			Kind: StatsKind.Unit
		});
		if (this.props.status === GameStatus.Victory) {
			this._audioService.Play(AudioArchive.victory, 0.1, false);
		}

		if (this.props.status === GameStatus.Defeat) {
			this._audioService.Play(AudioArchive.defeat, 0.1, false);
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
					<Switch
						isVisible={this.props.status === GameStatus.Victory}
						left={
							<div class="fill-victory light-bounce">
								<div class="fill-victory-star infinite-bounce" />
							</div>
						}
						right={
							<div class="fill-defeat light-bounce">
								<div class="fill-defeat-eyes fade" />
							</div>
						}
					/>
				</div>
				<div class="container-center">
					<div class="container-center-horizontal" style="margin-top:15px;margin-bottom:15px;width:100%">
						<ProgressComponent width={80} maxWidth={0} />
					</div>

					<div class="container-center-horizontal">
						<Btn
							callBack={() => {
								this.Quit();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</Btn>
						<Visible isVisible={this.props.status === GameStatus.Defeat && this._appService.IsRetriable()}>
							<Btn
								callBack={() => {
									this._appService.Retry();
								}}
								color={ColorKind.Blue}
							>
								<Icon Value="fas fa-undo-alt" /> Retry
							</Btn>
						</Visible>
					</div>
				</div>
			</div>
		);
	}
}
