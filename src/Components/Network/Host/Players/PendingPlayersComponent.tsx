import { h, Component } from 'preact';
import { NetworkSocket } from '../../../../Network/NetworkSocket';
import { HostState } from '../../HostState';
import GridComponent from '../../../Common/Grid/GridComponent';
import SmButtonComponent from '../../../Common/Button/Stylish/SmButtonComponent';
import { ConnectionKind } from '../../../../Network/ConnectionKind';
import { OnlinePlayer } from '../../../../Network/OnlinePlayer';
import Icon from '../../../Common/Icon/IconComponent';
import { ColorKind } from '../../../Common/Button/Stylish/ColorKind';
import Visible from '../../../Common/Visible/VisibleComponent';

export default class PendingPlayers extends Component<{ HostState: HostState; Socket: NetworkSocket }, {}> {
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
				{this.props.HostState.Players.Values().map((player) => {
					return (
						<tr class={this.props.HostState.Player.Name === player.Name ? 'row-blue d-flex' : 'd-flex'}>
							<Visible isVisible={this.props.HostState.IsAdmin}>
								<td class="align-self-center">
									<SmButtonComponent
										callBack={() => this.MakeUserLeave(player.Name)}
										color={ColorKind.Black}
									>
										<Icon Value={'fas fa-user-slash'} />
									</SmButtonComponent>
								</td>
							</Visible>
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
		this.props.Socket.Kick(this.props.HostState.RoomName, playerName);
	}
}
