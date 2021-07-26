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
import Switch from '../Common/Struct/Switch';
import Grid from '../Common/Grid/GridComponent';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
export default class HomeScreen extends Component<any, { IsMenu: boolean }> {
	private _versions: Versionning[] = [
		new Versionning('0.8.13 (Doug/Marvin delivery)', [
			'self-automated collector',
			'remove war frog',
			'slow down game speed',
			'replayable stage',
			'fix some multiselection bug'
		])
	];

	componentDidMount() {
		const profil = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		const soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		soundService.SetMute(profil.GetProfil().IsMute);
		soundService.PlayLoungeMusic();
		this.setState({
			IsMenu: true
		});
	}

	render() {
		return (
			<Panel
				content={
					<Switch
						isLeft={this.state.IsMenu}
						left={
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
						right={
							<Grid
								left={
									<thead>
										<tr class="d-flex">
											<th>Versions</th>
										</tr>
									</thead>
								}
								right={
									<tbody>
										<tr class="d-flex">
											{this._versions.map((version) => (
												<td class="align-self-center">
													<span style="font-weight:bold">
														<Icon Value="fas fa-truck" /> {version.Name}
													</span>
													{version.Features.map((feature) => <div>&#183; {feature}</div>)}
												</td>
											))}
										</tr>
									</tbody>
								}
							/>
						}
					/>
				}
				footer={
					<div class="navbar nav-inner" style="font-weight:bold;">
						<div>v 0.8.13</div>
						<SmActiveBtn
							left={<Icon Value="fas fa-bug" />}
							right={<Icon Value="fas fa-bug" />}
							isActive={this.state.IsMenu}
							leftColor={ColorKind.Red}
							rightColor={ColorKind.Black}
							OnClick={() => {
								this.setState({ IsMenu: !this.state.IsMenu });
							}}
						/>
					</div>
				}
			/>
		);
	}
}
export class Versionning {
	constructor(public Name: string, public Features: string[]) {}
}
