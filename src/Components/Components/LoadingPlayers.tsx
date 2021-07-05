import { h, Component } from 'preact';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { ConnectionKind } from '../../Network/ConnectionKind';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { Singletons, SingletonKey } from '../../Singletons';
import Icon from '../Common/Icon/IconComponent';
import GridComponent from '../Common/Grid/GridComponent';
import SmPanelComponent from './Panel/SmPanelComponent';

export default class LoadingPlayers extends Component<any, { Players: OnlinePlayer[]; Player: OnlinePlayer }> {
	constructor() {
		super();
		const onlinePlayerManager = Singletons.Load<IOnlineService>(SingletonKey.Online).GetOnlinePlayerManager();
		const onlineGameContextManager = Singletons.Load<IOnlineService>(
			SingletonKey.Online
		).GetOnlineGameContextManager();
		this.setState({
			Player: onlinePlayerManager.Player,
			Players: onlinePlayerManager.Players.Values()
		});
		onlinePlayerManager.OnPlayersChanged.On(this.UpdateState.bind(this));
		onlineGameContextManager.Start();
	}

	public UpdateState(src: any, players: Dictionary<OnlinePlayer>): void {
		this.setState({ Players: players.Values() });
	}

	render() {
		return (
			<SmPanelComponent>
				<GridComponent left={this.GetHeader()} right={this.GetContent()} />
			</SmPanelComponent>
		);
	}

	private GetHeader() {
		return (
			<thead>
				<tr class="d-flex">
					<th scope="col">Players</th>
				</tr>
			</thead>
		);
	}

	private GetContent() {
		return (
			<tbody>
				{this.state.Players.map((player: any) => {
					return (
						<tr class={this.state.Player.Name === player.Name ? 'd-flex row-blue' : 'd-flex'}>
							<td class="align-self-center">{this.GetLoadingInfo(player)}</td>
							<td class="align-self-center">
								{player.Name} {this.GetReady(player)}
							</td>
							<td class="align-self-center">
								{this.GetType(player)} {this.GetConnection(player)} {this.GetTimeout(player)}
							</td>
							<td class="align-self-center">{+player.GetLatency() === 0 ? '' : player.GetLatency()}</td>
						</tr>
					);
				})}
			</tbody>
		);
	}

	private GetType(player: OnlinePlayer) {
		return <span class="badge badge-light">{player.GetConnection().Type}</span>;
	}

	private GetTimeout(player: OnlinePlayer) {
		if (player.HasTimeOut()) {
			return (
				<span
					class="badge badge-danger align-text-center blink_me"
					style="background-color:#ff0062; border: white solid 0.5px"
				>
					<Icon Value={'fas fa-exclamation-circle'} />
				</span>
			);
		}
		return '';
	}

	private GetLoadingInfo(player: OnlinePlayer) {
		let style = 'badge badge-success';
		let label: any = <Icon Value="fas fa-check"> Loaded</Icon>;
		if (!player.IsLoaded) {
			style = 'badge badge-info';
			label = <Icon Value="fas fa-spinner"> Loading</Icon>;
		}
		return (
			<span class={style}>
				<div class={!player.IsLoaded ? 'spin' : ''}>{label}</div>
			</span>
		);
	}

	private GetConnection(player: OnlinePlayer) {
		let style = 'badge badge-success';
		if (player.GetConnection().Kind === ConnectionKind.Nok) {
			style = 'badge badge-danger';
		} else if (player.GetConnection().Kind === ConnectionKind.Connecting) {
			style = 'badge badge-warning opacity-changing';
		}
		return <span class={style}>{player.GetConnection().State.substring(0, 3)}</span>;
	}

	private GetReady(player: OnlinePlayer) {
		if (player.IsReady) {
			return <span class="badge badge-success">ON</span>;
		} else {
			return <span class="badge badge-light">OFF</span>;
		}
	}
}
