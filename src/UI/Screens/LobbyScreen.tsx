import { h, JSX } from 'preact';
import PendingPlayers from '../Components/PendingPlayers';
import ChatComponent from '../Components/ChatComponent';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import ActiveButtonComponent from '../Common/Button/Stylish/ActiveButtonComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Components/Panel/SmPanelComponent';
import Redirect from '../Components/Redirect';
import MessageEmitter from '../Components/MessageEmitter';
import Visible from '../Components/Visible';
import Option from '../Components/Option';
import { LobbyMode } from '../Model/LobbyMode';
import { LobbyState } from '../Model/LobbyState';
import { HookedComponent } from '../Hooks/HookedComponent';
import { LobbyHook } from '../Hooks/LobbyHook';
import { useState } from 'preact/hooks';

export default class LobbyScreen extends HookedComponent<{}, LobbyHook, LobbyState> {
	public GetDefaultHook(): LobbyHook {
		return new LobbyHook(useState(LobbyHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<MessageEmitter callBack={(m: string) => this.Hook.Send(m)}>
					<SmPanelComponent>
						<div class="container-center-horizontal">
							<Visible isVisible={this.Hook.State.Player.IsAdmin}>
								<ActiveButtonComponent
									isActive={this.Hook.State.Mode === LobbyMode.setting}
									leftColor={ColorKind.Red}
									rightColor={ColorKind.Black}
									left={<Icon Value={'fas fa-cogs'} />}
									right={<Icon Value={'fas fa-cogs'} />}
									callBack={() => {
										this.Hook.SetMode(LobbyMode.setting);
									}}
								/>
							</Visible>

							<ActiveButtonComponent
								isActive={this.Hook.State.Mode === LobbyMode.pending}
								leftColor={ColorKind.Red}
								rightColor={ColorKind.Black}
								left={<Icon Value={'fas fa-clipboard-list'} />}
								right={<Icon Value={'fas fa-clipboard-list'} />}
								callBack={() => {
									this.Hook.SetMode(LobbyMode.pending);
								}}
							/>

							<ActiveButtonComponent
								isActive={this.Hook.State.Mode === LobbyMode.chat}
								leftColor={ColorKind.Red}
								rightColor={ColorKind.Black}
								left={<Icon Value={'fas fa-comments'} />}
								right={<Icon Value={'fas fa-comments'} />}
								callBack={() => {
									this.Hook.SetMode(LobbyMode.chat);
								}}
							/>

							<ActiveButtonComponent
								left={<Icon Value={'fas fa-toggle-on'} />}
								right={<Icon Value={'fas fa-toggle-off'} />}
								leftColor={ColorKind.Gray}
								rightColor={ColorKind.Green}
								callBack={() => this.Hook.ChangeReady()}
								isActive={this.Hook.State.Player.IsReady}
							/>
						</div>
						<Visible isVisible={SpriteProvider.IsLoaded()}>
							<Visible isVisible={this.Hook.State.Mode === LobbyMode.setting}>
								<Option Model={this.Hook.State.MapSetting} />
							</Visible>
							<Visible isVisible={this.Hook.State.Mode === LobbyMode.pending}>
								<PendingPlayers
									Lobby={this.Hook.LobbyManager}
									Player={this.Hook.State.Player}
									Players={this.Hook.State.Players.Values()}
								/>
							</Visible>
							<Visible isVisible={this.Hook.State.Mode === LobbyMode.chat}>
								<ChatComponent
									messages={this.Hook.State.Messages}
									player={this.Hook.State.Player.Name}
								/>
							</Visible>
						</Visible>
						<div class="container-center-horizontal">
							<ButtonComponent callBack={() => this.Hook.Back()} color={ColorKind.Black}>
								<Icon Value="fas fa-undo-alt" /> Back
							</ButtonComponent>
							<Visible isVisible={this.Hook.State.Player.IsAdmin}>
								<ActiveButtonComponent
									left={
										<span>
											<Icon Value={'far fa-play-circle'} /> START
										</span>
									}
									right={
										<span>
											<Icon Value={'far fa-play-circle'} /> START
										</span>
									}
									leftColor={ColorKind.Red}
									rightColor={ColorKind.Gray}
									callBack={() => this.Hook.Launching()}
									isActive={this.Hook.State.Players.Values().every((e) => e.IsReady)}
								/>
							</Visible>
						</div>
					</SmPanelComponent>
				</MessageEmitter>
			</Redirect>
		);
	}
}
