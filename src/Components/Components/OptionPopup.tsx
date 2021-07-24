import { h, Component } from 'preact';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import { GameStatus } from '../../Core/Framework/GameStatus';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ActiveBtn from '../Common/Button/Stylish/ActiveBtn';
import { Singletons, SingletonKey } from '../../Singletons';
import { IAudioService } from '../../Services/Audio/IAudioService';

export default class OptionPopup extends Component<
	{ Status: GameStatus; Resume: () => void; Quit: () => void },
	{ Kind: StatsKind }
> {
	private _soundService: IAudioService;
	constructor() {
		super();
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
	}

	componentDidMount() {
		this.setState({
			Kind: StatsKind.Unit
		});
	}

	render() {
		return (
			<div class="sizeContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-tank-logo slow-bounce" />
					<div class="fill-logo" />{' '}
				</div>
				<div class="container-center" style="margin-top: -2vh">
					<Btn
						OnClick={() => {
							this.props.Resume();
						}}
						Color={ColorKind.Red}
					>
						<Icon Value="fas fa-arrow-alt-circle-right" /> Resume
					</Btn>

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
							this._soundService.SetMute(!this._soundService.IsMute());
							this.setState({});
						}}
						isActive={this._soundService.IsMute()}
					/>
					<Btn
						OnClick={() => {
							this.props.Quit();
						}}
						Color={ColorKind.Black}
					>
						<Icon Value="fas fa-undo-alt" /> Quit
					</Btn>
				</div>
			</div>
		);
	}
}
