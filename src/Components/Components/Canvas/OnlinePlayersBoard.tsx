import { Component, h } from 'preact';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import { IOnlineService } from '../../../Services/Online/IOnlineService';
import Icon from '../../Common/Icon/IconComponent';
import Visible from '../../Common/Struct/Visible';

export default class OnlinePlayersBoard extends Component<{ OnlineService: IOnlineService }, {}> {
	render() {
		return (
			<Visible isVisible={this.props.OnlineService.IsOnline()}>
				<div style="position: fixed;right: 0%; color:white;">
					{this.GetPlayers().map((player) => {
						return (
							<div>
								<span class="badge badge-info">{player.GetLatency()}</span> {this.HasTimeout(player)}
								{player.Name}{' '}
							</div>
						);
					})}
				</div>
			</Visible>
		);
	}

	private GetPlayers() {
		if (this.props.OnlineService.IsOnline()) {
			return this.props.OnlineService.GetOnlinePlayerManager().Players.Values();
		} else {
			return [];
		}
	}

	private HasTimeout(player: OnlinePlayer) {
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
}
