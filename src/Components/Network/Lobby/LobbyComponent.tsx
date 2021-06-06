import { ILobbyService } from '../../../Services/Hosting/ILobbyService';
import { Component, h } from 'preact';
import { route } from 'preact-router';
import PendingPlayers from './Players/PendingPlayersComponent';
import ChatComponent from './Chat/ChatComponent';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import OptionComponent from './Options/OptionComponent';
import ToastComponent from '../../Common/Toast/ToastComponent';
import { LobbyState } from '../RoomState';
import { Singletons, SingletonKey } from '../../../Singletons';
import Redirect from '../../Redirect/RedirectComponent';
import { SpriteProvider } from '../../../Core/Framework/SpriteProvider';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import Visible from '../../Common/Visible/VisibleComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import ActiveButtonComponent from '../../Common/Button/Stylish/ActiveButtonComponent';
import { HostingMode } from '../HostingMode';
import { Message } from '../Message';
import SmPanelComponent from '../../Common/Panel/SmPanelComponent';
import { Dictionnary } from '../../../Core/Utils/Collections/Dictionnary';
import { ILobbyManager } from '../../../Network/Lobby/ILobbyManager';
import { MapSetting } from '../../Form/MapSetting';

export default class LobbyComponent extends Component<any, LobbyState> {
	//SERVICE
	private _lobbyManager: ILobbyManager;
	private _mode: HostingMode = HostingMode.pending;

	constructor(props: any) {
		super(props);

		if (!SpriteProvider.IsLoaded()) {
			return;
		}

		this._lobbyManager = Singletons.Load<ILobbyService>(SingletonKey.Lobby).Publish();
		this.setState({
			Player: this._lobbyManager.Player,
			Players: this._lobbyManager.Players,
			Messages: [],
			Message: '',
			MapSetting: new MapSetting()
		});

		this._lobbyManager.OnKicked.On(this.Back.bind(this));
		this._lobbyManager.OnMessageReceived.On(this.OnMessage.bind(this));
		this._lobbyManager.OnPlayersChanged.On(this.UpdateState.bind(this));
	}

	public UpdateState(src: any, players: Dictionnary<OnlinePlayer>): void {
		this.setState({ Players: players });
	}

	render() {
		return (
			<Redirect>
				<ToastComponent _lobby={this._lobbyManager} Player={this.state.Player}>
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
				</ToastComponent>
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
						left={
							<span>
								<Icon Value={'fas fa-cogs'} />
							</span>
						}
						right={
							<span>
								<Icon Value={'fas fa-cogs'} />
							</span>
						}
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
					left={
						<span>
							<Icon Value={'fas fa-clipboard-list'} />
						</span>
					}
					right={
						<span>
							<Icon Value={'fas fa-clipboard-list'} />
						</span>
					}
					callBack={() => {
						this._mode = HostingMode.pending;
						this.setState({});
					}}
				/>

				<ActiveButtonComponent
					isActive={this._mode === HostingMode.chat}
					leftColor={ColorKind.Red}
					rightColor={ColorKind.Black}
					left={
						<span>
							<Icon Value={'fas fa-comments'} />
						</span>
					}
					right={
						<span>
							<Icon Value={'fas fa-comments'} />
						</span>
					}
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
		this._lobbyManager.Leave();
		route('/Home', true);
	}

	private Launching(): void {
		this._lobbyManager.Close();
		route('/Launching', true);
	}

	private OnMessage(source: any, message: Message): void {
		this.setState({
			Messages: [ message ].concat(this.state.Messages)
		});
	}
}
