import { h, Component } from 'preact';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import Progress from '../Common/Progress/Progress';
import Icon from '../Common/Icon/IconComponent';
import { IAudioService } from '../../Services/Audio/IAudioService';

export default class StatBar extends Component<any, { IsMute: boolean }> {
	private _soundService: IAudioService;
	private _profilService: IPlayerProfileService;

	constructor() {
		super();
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._profilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
	}

	componentDidMount() {
		this.setState({
			IsMute: this._profilService.GetProfil().IsMute
		});
	}

	render() {
		return (
			<nav class="navbar nav-inner">
				<Progress />
				<SmActiveBtn
					left={<Icon Value={'fas fa-volume-mute'} />}
					right={<Icon Value={'fas fa-volume-up'} />}
					leftColor={ColorKind.Black}
					rightColor={ColorKind.Yellow}
					OnClick={() => {
						const isMute = !this._soundService.IsMute();
						this._soundService.SetMute(isMute);
						this._profilService.GetProfil().IsMute = isMute;
						this._profilService.Save();
						this._soundService.PlayLoungeMusic();
						this.setState({ IsMute: isMute });
					}}
					isActive={this._soundService && this._soundService.IsMute()}
				/>
			</nav>
		);
	}
}
