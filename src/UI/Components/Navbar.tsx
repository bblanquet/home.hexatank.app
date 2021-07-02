import { h, Component } from 'preact';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { PlayerProfil } from '../../Services/PlayerProfil/PlayerProfil';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import ProgressComponent from '../Common/Progress/ProgressComponent';
import Icon from '../Common/Icon/IconComponent';
import { IAudioService } from '../../Services/Audio/IAudioService';

export default class Navbar extends Component<any, { profil: PlayerProfil }> {
	private _soundService: IAudioService;
	private _profilService: IPlayerProfilService;
	constructor() {
		super();
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this.setState({
			profil: this._profilService.GetProfil()
		});
	}

	render() {
		return (
			<div>
				<nav class="navbar dark">
					<ProgressComponent width={30} maxWidth={150} />
					<div class="d-flex justify-content-start">
						<SmActiveButtonComponent
							left={<Icon Value={'fas fa-volume-mute'} />}
							right={<Icon Value={'fas fa-volume-up'} />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Yellow}
							callBack={() => {
								if (this._soundService.IsMute()) {
									this._soundService.On();
								} else {
									this._soundService.Off();
								}
								this._soundService.PlayLoungeMusic();
								this.setState({});
							}}
							isActive={this._soundService && this._soundService.IsMute()}
						/>
					</div>
				</nav>
				{this.props.children}
			</div>
		);
	}
}
