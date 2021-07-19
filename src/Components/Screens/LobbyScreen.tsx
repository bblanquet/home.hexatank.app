import { h, JSX } from 'preact';
import PendingPlayers from '../Components/PendingPlayers';
import ChatComponent from '../Components/ChatComponent';
import ActiveBtn from '../Common/Button/Stylish/ActiveBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import Redirect from '../Components/Redirect';
import Visible from '../Common/Struct/Visible';
import Option from '../Components/Option';
import { LobbyMode } from '../Model/LobbyMode';
import { LobbyState } from '../Model/LobbyState';
import { HookedComponent } from '../Hooks/HookedComponent';
import { LobbyHook } from '../Hooks/LobbyHook';
import { useState } from 'preact/hooks';
import Body from '../Common/Struct/Body';
import Navbar from '../Common/Struct/Navbar';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import MessageEmitter from '../Components/MessageEmitter';
import Switch from '../Common/Struct/Switch';

export default class LobbyScreen extends HookedComponent<{}, LobbyHook, LobbyState> {
	public GetDefaultHook(): LobbyHook {
		return new LobbyHook(useState(LobbyHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Body
					header={
						<span>
							<Navbar>
								<Visible isVisible={this.Hook.State.Player.IsAdmin}>
									<ActiveBtn
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
								<ActiveBtn
									isActive={this.Hook.State.Mode === LobbyMode.chat}
									leftColor={ColorKind.Red}
									rightColor={ColorKind.Black}
									left={
										<span>
											<Visible isVisible={this.Hook.State.HasReceivedMessage}>
												<span class="blink_me" style="margin:1px">
													<Icon Value={'fas fa-exclamation'} />
												</span>
											</Visible>
											<Icon Value={'fas fa-comments'} />
										</span>
									}
									right={
										<span>
											<Visible isVisible={this.Hook.State.HasReceivedMessage}>
												<span class="blink_me" style="margin:1px">
													<Icon Value={'fas fa-exclamation'} />
												</span>
											</Visible>
											<Icon Value={'fas fa-comments'} />
										</span>
									}
									callBack={() => {
										this.Hook.SetMode(LobbyMode.chat);
									}}
								/>
								<ActiveBtn
									isActive={this.Hook.State.Mode === LobbyMode.pending}
									leftColor={ColorKind.Red}
									rightColor={ColorKind.Black}
									left={<Icon Value={'fas fa-clipboard-list'} />}
									right={<Icon Value={'fas fa-clipboard-list'} />}
									callBack={() => {
										this.Hook.SetMode(LobbyMode.pending);
									}}
								/>
							</Navbar>
							<Visible isVisible={this.Hook.IsReady()}>
								<div class="notification">
									{`the game starts ${this.Hook.State.Duration} seconds later.`}
								</div>
							</Visible>
						</span>
					}
					content={
						<div>
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
						</div>
					}
					footer={
						<Switch
							isLeft={this.Hook.State.Mode === LobbyMode.chat}
							left={<MessageEmitter callBack={(m: string) => this.Hook.Send(m)} />}
							right={
								<div class="navbar nav-inner">
									<div class="left">
										<SmBtn OnClick={() => this.Hook.Back()} Color={ColorKind.Black}>
											<Icon Value="fas fa-undo-alt" /> Back
										</SmBtn>
									</div>
									<div class="right">
										<SmActiveBtn
											left={<Icon Value={'fas fa-toggle-on'} />}
											right={<Icon Value={'fas fa-toggle-off'} />}
											leftColor={ColorKind.Gray}
											rightColor={ColorKind.Green}
											callBack={() => this.Hook.ChangeReady()}
											isActive={this.Hook.State.Player.IsReady}
										/>
									</div>
								</div>
							}
						/>
					}
				/>
			</Redirect>
		);
	}
}
