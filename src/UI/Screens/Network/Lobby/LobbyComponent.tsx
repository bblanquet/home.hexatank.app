import { Component, h } from 'preact';
import { route } from 'preact-router';
import PendingPlayers from './Players/PendingPlayersComponent';
import ChatComponent from './Chat/ChatComponent';
import { SpriteProvider } from '../../../../Core/Framework/SpriteProvider';
import { Dictionary } from '../../../../Core/Utils/Collections/Dictionary';
import { ILobbyManager } from '../../../../Network/Manager/ILobbyManager';
import { IOnlinePlayerManager } from '../../../../Network/Manager/IOnlinePlayerManager';
import { OnlinePlayer } from '../../../../Network/OnlinePlayer';
import { Singletons, SingletonKey } from '../../../../Singletons';
import ActiveButtonComponent from '../../../Common/Button/Stylish/ActiveButtonComponent';
import ButtonComponent from '../../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../../Common/Button/Stylish/ColorKind';
import Icon from '../../../Common/Icon/IconComponent';
import SmPanelComponent from '../../../Components/Panel/SmPanelComponent';
import Redirect from '../../../Components/RedirectComponent';
import MessageComponent from '../../../Components/MessageComponent';
import Visible from '../../../Components/VisibleComponent';
import { Message } from '../Message';
import { IOnlineService } from '../../../../Services/Online/IOnlineService';
import OptionComponent from './Options/OptionComponent';
import { HostingMode } from '../HostingMode';
import { LobbyState } from '../RoomState';

export default class LobbyComponent extends Component<any, LobbyState> {
	//SERVICE
	private _lobbyManager: ILobbyManager;
	private _onlinePlayer: IOnlinePlayerManager;
	private _mode: HostingMode = HostingMode.pending;

	constructor(props: any) {
		super(props);

		if (!SpriteProvider.IsLoaded()) {
			return;
		}
		const lobbyService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._lobbyManager = lobbyService.GetLobbyManager();
		this._onlinePlayer = lobbyService.GetOnlinePlayerManager();
		this.setState({
			Player: this._onlinePlayer.Player,
			Players: this._onlinePlayer.Players,
			Messages: [],
			Message: '',
			MapSetting: this._lobbyManager.GetSetup()
		});

		this._lobbyManager.OnKicked.On(this.Back.bind(this));
		this._lobbyManager.OnMessageReceived.On(this.OnMessage.bind(this));
		this._onlinePlayer.OnPlayersChanged.On(this.UpdateState.bind(this));
		this._lobbyManager.OnStarting.On(() => {
			this._lobbyManager.Clear();
			route('{{sub_path}}Launching', true);
		});
	}

	public UpdateState(src: any, players: Dictionary<OnlinePlayer>): void {
		this.setState({ Players: players });
	}

	render() {
		return (
			<Redirect>
				<MessageComponent _lobby={this._lobbyManager} Player={this.state.Player}>
					<Visible isVisible={SpriteProvider.IsLoaded()}>
						<Visible isVisible={this._mode === HostingMode.setting}>
							<SmPanelComponent>
								{this.GetUpdsideButton()}
								<OptionComponent Model={this.state.MapSetting} />
								{this.GetDownsideButton()}
							</SmPanelComponent>
						</Visible>
						<Visible isVisible={this._mode === HostingMode.pending}>
							<SmPanelComponent>
								{this.GetUpdsideButton()}
								<PendingPlayers
									Lobby={this._lobbyManager}
									Player={this.state.Player}
									Players={this.state.Players.Values()}
								/>
								{this.GetDownsideButton()}
							</SmPanelComponent>
						</Visible>
						<Visible isVisible={this._mode === HostingMode.chat}>
							<SmPanelComponent>
								{this.GetUpdsideButton()}
								<ChatComponent messages={this.state.Messages} player={this.state.Player.Name} />
								{this.GetDownsideButton()}
							</SmPanelComponent>
						</Visible>
					</Visible>
				</MessageComponent>
			</Redirect>
		);
	}

	private GetDownsideButton() {
		return (
			<div class="container-center-horizontal">
				<ButtonComponent callBack={() => this.Back()} color={ColorKind.Black}>
					<Icon Value="fas fa-undo-alt" /> Back
				</ButtonComponent>
				<Visible isVisible={this.state.Player.IsAdmin}>
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
						callBack={() => this.Launching()}
						isActive={this.state.Players.Values().every((e) => e.IsReady)}
					/>
				</Visible>
			</div>
		);
	}

	private GetUpdsideButton() {
		return (
			<div class="container-center-horizontal">
				<Visible isVisible={this.state.Player.IsAdmin}>
					<ActiveButtonComponent
						isActive={this._mode === HostingMode.setting}
						leftColor={ColorKind.Red}
						rightColor={ColorKind.Black}
						left={<Icon Value={'fas fa-cogs'} />}
						right={<Icon Value={'fas fa-cogs'} />}
						callBack={() => {
							this._mode = HostingMode.setting;
							this.setState({});
						}}
					/>
				</Visible>

				<ActiveButtonComponent
					isActive={this._mode === HostingMode.pending}
					leftColor={ColorKind.Red}
					rightColor={ColorKind.Black}
					left={<Icon Value={'fas fa-clipboard-list'} />}
					right={<Icon Value={'fas fa-clipboard-list'} />}
					callBack={() => {
						this._mode = HostingMode.pending;
						this.setState({});
					}}
				/>

				<ActiveButtonComponent
					isActive={this._mode === HostingMode.chat}
					leftColor={ColorKind.Red}
					rightColor={ColorKind.Black}
					left={<Icon Value={'fas fa-comments'} />}
					right={<Icon Value={'fas fa-comments'} />}
					callBack={() => {
						this._mode = HostingMode.chat;
						this.setState({});
					}}
				/>

				<ActiveButtonComponent
					left={
						<span>
							<Icon Value={'fas fa-toggle-on'} />
						</span>
					}
					right={
						<span>
							<Icon Value={'fas fa-toggle-off'} />
						</span>
					}
					leftColor={ColorKind.Gray}
					rightColor={ColorKind.Green}
					callBack={() => this.ChangeReady()}
					isActive={this.state.Player.IsReady}
				/>
			</div>
		);
	}

	private ChangeReady(): void {
		this._lobbyManager.SetReady();
	}

	private Back(): void {
		this._lobbyManager.Stop();
		route('{{sub_path}}Home', true);
	}

	private Launching(): void {
		this._lobbyManager.Start();
	}

	private OnMessage(source: any, message: Message): void {
		this.setState({
			Messages: [ message ].concat(this.state.Messages)
		});
	}
}
