import { h, Component } from 'preact';
import { AudioArchive } from '../../../Core/Framework/AudioArchiver';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { Singletons, SingletonKey } from '../../../Singletons';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { PlayerProfil } from '../../../Services/PlayerProfil/PlayerProfil';
import { ColorKind } from '../Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Button/Stylish/SmActiveButtonComponent';
import ProgressComponent from '../Progress/ProgressComponent';
import Icon from '../Icon/IconComponent';
import { IAudioService } from '../../../Services/Audio/IAudioService';

export default class NavbarComponent extends Component<any, { profil: PlayerProfil }> {
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

	private Upload(e: any): void {
		var reader = new FileReader();
		reader.readAsText(e.target.files[0], 'UTF-8');
		reader.onload = (ev: ProgressEvent<FileReader>) => {
			const context = JSON.parse(ev.target.result as string);
			let model = new PlayerProfil();
			if (this.GetProfil(context)) {
				model = context as PlayerProfil;
			}
			Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil).SetProfil(model);
		};
	}

	private GetProfil(e: any) {
		return Object.keys(new PlayerProfil()).every((key) => !isNullOrUndefined(e[key]));
	}

	private Save(): void {
		const data = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil).GetProfil();
		const url = document.createElement('a');
		const file = new Blob([ JSON.stringify(data) ], { type: 'application/json' });
		url.href = URL.createObjectURL(file);
		url.download = `save.json`;
		url.click();
		URL.revokeObjectURL(url.href);
	}

	render() {
		return (
			<div>
				<nav class="navbar navbar-dark dark">
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
									this._soundService.PlayLoungeMusic();
								} else {
									this._soundService.Off();
									this._soundService.Pause(AudioArchive.loungeMusic);
								}
								this.setState({});
							}}
							isActive={this._soundService && this._soundService.IsMute()}
						/>
						{/* <div class="space-out" />
						<SmUploadButtonComponent
							callBack={(e: any) => this.Upload(e)}
							color={ColorKind.Red}
							icon={'fas fa-file-download'}
						/>
						<div class="space-out" />
						<SmButtonComponent
							callBack={() => {
								this.Save();
							}}
							color={ColorKind.Blue}
						>
							<Icon Value={'fas fa-file-export'} />
						</SmButtonComponent> */}
					</div>
				</nav>
				{this.props.children}
			</div>
		);
	}
}
