import { h, Component } from 'preact';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ActiveBtn from '../Common/Button/Stylish/ActiveBtn';
import { Singletons, SingletonKey } from '../../Singletons';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { AppService } from '../../Services/App/AppService';

export default class OptionPopup extends Component<
	{ Status: GameStatus; Resume: () => void; Quit: () => void },
	{ Kind: StatsKind }
> {
	private _soundService: IAudioService;

	constructor() {
		super();
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this.setState({
			Kind: StatsKind.Unit
		});
	}

	componentDidMount() {}

	private Cheat(): void {
		GameSettings.ShowEnemies = !GameSettings.ShowEnemies;
		this.setState({});
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-tank-logo slow-bounce" />
					<div class="fill-logo" />{' '}
				</div>
				<div class="container-center" style="margin-top: -2vh">
					<Btn
						callBack={() => {
							this.props.Resume();
						}}
						color={ColorKind.Red}
					>
						<Icon Value="fas fa-arrow-alt-circle-right" /> Resume
					</Btn>
					<ActiveBtn
						left={
							<span>
								<Icon Value="fas fa-eye" /> Cheat
							</span>
						}
						right={
							<span>
								<Icon Value="fas fa-eye-slash" /> Cheat
							</span>
						}
						leftColor={ColorKind.Black}
						rightColor={ColorKind.Red}
						isActive={GameSettings.ShowEnemies}
						callBack={() => this.Cheat()}
					/>
					<ActiveBtn
						left={
							<span>
								<Icon Value={'fas fa-volume-mute'} /> Mute
							</span>
						}
						right={
							<span>
								<Icon Value={'fas fa-volume-up'} /> Unmute
							</span>
						}
						leftColor={ColorKind.Black}
						rightColor={ColorKind.Yellow}
						callBack={() => {
							if (this._soundService.IsMute()) {
								this._soundService.On();
							} else {
								this._soundService.Off();
							}
							this.setState({});
						}}
						isActive={this._soundService.IsMute()}
					/>
					<Btn
						callBack={() => {
							this.props.Quit();
						}}
						color={ColorKind.Black}
					>
						<Icon Value="fas fa-undo-alt" /> Quit
					</Btn>
				</div>
			</div>
		);
	}
}
