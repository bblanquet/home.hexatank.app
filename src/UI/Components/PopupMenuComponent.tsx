import { h, Component } from 'preact';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ActiveButtonComponent from '../Common/Button/Stylish/ActiveButtonComponent';
import { Singletons, SingletonKey } from '../../Singletons';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { AppService } from '../../Services/App/AppService';

export default class PopupMenuComponent extends Component<
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

	private Save(): void {
		const data = Singletons.Load<AppService>(SingletonKey.App).GetRecord().GetRecord();
		const url = document.createElement('a');
		const file = new Blob([ JSON.stringify(data) ], { type: 'application/json' });
		url.href = URL.createObjectURL(file);
		url.download = `${data.Title}.json`;
		url.click();
		URL.revokeObjectURL(url.href);
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
					<ButtonComponent
						callBack={() => {
							this.props.Resume();
						}}
						color={ColorKind.Red}
					>
						<Icon Value="fas fa-arrow-alt-circle-right" /> Resume
					</ButtonComponent>
					<ActiveButtonComponent
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
					<ActiveButtonComponent
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
					<ButtonComponent
						callBack={() => {
							this.Save();
						}}
						color={ColorKind.Blue}
					>
						<Icon Value="fas fa-save" /> Save
					</ButtonComponent>
					<ButtonComponent
						callBack={() => {
							this.props.Quit();
						}}
						color={ColorKind.Black}
					>
						<Icon Value="fas fa-undo-alt" /> Quit
					</ButtonComponent>
				</div>
			</div>
		);
	}
}
