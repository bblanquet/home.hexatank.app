import { h, Component } from 'preact';
import { NetworkSocket } from '../../../../Network/NetworkSocket';
import { HostState } from '../../HostState';
import GridComponent from '../../../Common/Grid/GridComponent';
import SmButtonComponent from '../../../Common/Button/Stylish/SmButtonComponent';
import { ConnectionKind } from '../../../../Network/ConnectionKind';
import { Player } from '../../../../Network/Player';
import Icon from '../../../Common/Icon/IconComponent';
import { ColorKind } from '../../../Common/Button/Stylish/ColorKind';

export default class PlayersComponent extends Component<{ HostState: HostState; Socket: NetworkSocket }, {}> {
	constructor() {
		super();
	}

	render() {
		return <GridComponent left={this.GetHeader()} right={this.GetContent()} />;
	}

	private GetHeader() {
		return (
			<thead>
				<tr>
					<th scope="col">Player</th>
					<th scope="col">Peer</th>
					<th scope="col">Ping</th>
					{this.props.HostState.IsAdmin ? <th scope="col">*</th> : ''}
				</tr>
			</thead>
		);
	}

	private GetContent() {
		return (
			<tbody>
				{this.props.HostState.Players.Values().map((player) => {
					return (
						<tr class={this.props.HostState.Player.Name === player.Name ? 'row-blue' : ''}>
							<td class="align-middle">
								{player.Name} {this.GetReady(player)}
							</td>
							<td class="align-middle">
								{this.GetType(player)} {this.GetConnection(player)}
							</td>
							<td class="align-middle">{+player.Latency === 0 ? '' : player.Latency}</td>
							{this.props.HostState.IsAdmin ? (
								<td class="align-middle">
									<SmButtonComponent
										callBack={() => this.MakeUserLeave(player.Name)}
										color={ColorKind.Black}
									>
										<Icon Value={'fas fa-user-slash'} />
									</SmButtonComponent>
								</td>
							) : (
								''
							)}
						</tr>
					);
				})}
			</tbody>
		);
	}

	private GetType(player: Player) {
		return <span class="badge badge-light">{player.Connection.Type}</span>;
	}

	private GetConnection(player: Player) {
		let style = 'badge badge-success';
		if (player.Connection.Kind === ConnectionKind.Nok) {
			style = 'badge badge-danger';
		} else if (player.Connection.Kind === ConnectionKind.Connecting) {
			style = 'badge badge-warning opacity-changing';
		}
		return <span class={style}>{player.Connection.State.substring(0, 3)}</span>;
	}

	private GetReady(player: Player) {
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
