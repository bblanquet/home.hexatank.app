import { h, Component } from 'preact';
import { route } from 'preact-router';
import Btn from '../Common/Button/Stylish/Btn';
import DropDownBtn from '../Common/Button/Stylish/DropDownBtn';
import { ButtonOption } from '../Common/Button/ButtonOption';
import Icon from '../Common/Icon/IconComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Visible from '../Common/Struct/Visible';
import { Env } from '../../Env';
import Panel from '../Components/Panel/Panel';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { Singletons, SingletonKey } from '../../Singletons';
import SmBtn from '../Common/Button/Stylish/SmBtn';

export default class HomeScreen extends Component<any, any> {
	componentDidMount() {
		const profil = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		const soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		soundService.SetMute(profil.GetProfil().IsMute);
		soundService.PlayLoungeMusic();
	}

	render() {
		return (
			<Panel
				content={
					<div class="container-center">
						<Btn Color={ColorKind.Red} OnClick={() => route('{{sub_path}}Green', true)}>
							<Icon Value="fas fa-dungeon" /> Campaign
						</Btn>
						<Btn Color={ColorKind.Red} OnClick={() => route('{{sub_path}}SinglePlayer', true)}>
							<Icon Value="fas fa-gamepad" /> Play
						</Btn>
						<DropDownBtn
							icon={'fas fa-network-wired'}
							title={'Multiplayers'}
							items={[
								new ButtonOption('Guest', () => route('{{sub_path}}Guest', true)),
								new ButtonOption('Host', () => route('{{sub_path}}Host', true))
							]}
						/>
						<Btn Color={ColorKind.Black} OnClick={() => route('{{sub_path}}Profil', true)}>
							<Icon Value="fas fa-user-circle" /> Profil
						</Btn>
						<Visible isVisible={!Env.IsPrd()}>
							<Btn Color={ColorKind.Blue} OnClick={() => route('{{sub_path}}Customer', true)}>
								<Icon Value="fab fa-watchman-monitoring" /> Monitoring
							</Btn>
						</Visible>
					</div>
				}
				footer={
					<div class="navbar nav-inner" style="font-weight:bold;">
						<div>v 0.8.13</div>
						<SmBtn Color={ColorKind.Red} OnClick={() => {}}>
							<Icon Value="fas fa-bug" />
						</SmBtn>
					</div>
				}
			/>
		);
	}
}
