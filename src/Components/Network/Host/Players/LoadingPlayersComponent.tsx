import { h, Component } from 'preact';
import { NetworkSocket } from '../../../../Network/NetworkSocket';
import { HostState } from '../../HostState';
import GridComponent from '../../../Common/Grid/GridComponent';
import { ConnectionKind } from '../../../../Network/ConnectionKind';
import { OnlinePlayer } from '../../../../Network/OnlinePlayer';
import Icon from '../../../Common/Icon/IconComponent';

export default class LoadingPlayers extends Component<{ HostState: HostState; Socket: NetworkSocket }, {}> {
	constructor() {
		super();
	}

	render() {
		return <GridComponent left={this.GetHeader()} right={this.GetContent()} />;
	}

	private GetHeader() {
		return <thead />;
	}

	private GetContent() {
		return (
			<tbody>
				{this.props.HostState.Players.Values().map((player) => {
					return (
						<tr class={this.props.HostState.Player.Name === player.Name ? 'd-flex" row-blue' : 'd-flex"'}>
							<td class="align-self-center">
								{player.Name} {this.GetReady(player)}
							</td>
							<td class="align-self-center">
								{this.GetType(player)} {this.GetConnection(player)} {this.GetTimeout(player)}
							</td>
							<td class="align-self-center">{+player.GetLatency() === 0 ? '' : player.GetLatency()}</td>
							<td class="align-self-center">{this.GetLoadingInfo(player)}</td>
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
