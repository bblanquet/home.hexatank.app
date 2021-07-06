import { h, Component } from 'preact';
import { ConnectionKind } from '../../Network/ConnectionKind';
import { ILobbyManager } from '../../Network/Manager/ILobbyManager';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import Visible from './Visible';

export default class PendingPlayers extends Component<{
	Player: OnlinePlayer;
	Players: OnlinePlayer[];
	Lobby: ILobbyManager;
}> {
	constructor() {
		super();
	}

	render() {
		return <GridComponent left={this.GetHeader()} right={this.GetContent()} />;
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
				{this.props.Players.map((player) => {
					return (
						<tr class={this.props.Player.Name === player.Name ? 'row-blue d-flex' : 'd-flex'}>
							<Visible isVisible={this.props.Player.IsAdmin}>
								<td class="align-self-center">
									<SmBtn callBack={() => this.MakeUserLeave(player.Name)} color={ColorKind.Black}>
										<Icon Value={'fas fa-user-slash'} />
									</SmBtn>
								</td>
							</Visible>
							<td class="align-self-center">
								{player.Name} {this.GetReady(player)}
							</td>
							<Visible isVisible={this.props.Player.Name !== player.Name}>
								<td class="align-self-center">
									{this.GetType(player)} {this.GetConnection(player)} {this.GetTimeout(player)}
								</td>
								<td class="align-self-center">
									{+player.GetLatency() === 0 ? '' : player.GetLatency()}
								</td>
							</Visible>
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

	private MakeUserLeave(playerName: string): void {
		this.props.Lobby.Kick(playerName);
	}
}
