import { h, Component } from 'preact';
import { route } from 'preact-router';
import linkState from 'linkstate';
import * as toastr from 'toastr';
import { PacketKind } from '../../../Network/Message/PacketKind';
import { ComponentsHelper } from '../../ComponentsHelper';
import BlackButtonComponent from '../../Common/Button/BlackButtonComponent';
import RedButtonComponent from '../../Common/Button/RedButtonComponent';
const io = require('socket.io-client');

export default class GuestComponent extends Component<any, { RoomNames: string[]; PlayerName: string }> {
	private _socket: any;
	private _isFirstRender = true;

	constructor() {
		super();
		this.setState({
			RoomNames: new Array<string>(),
			PlayerName: 'Alice'
		});
		this._socket = io('https://mottet.xyz:9117');
		this.Listen();
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	componentWillUnmount() {
		if (this._socket) {
			this._socket.close();
		}
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="logo-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-logo" />
				</div>
				<div class="form-group mb-2">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
								Playername
							</span>
						</div>
						<input
							type="text"
							value={this.state.PlayerName}
							onInput={linkState(this, 'PlayerName')}
							class="form-control"
							aria-label="Default"
							aria-describedby="inputGroup-sizing-default"
						/>
					</div>
				</div>
				{ComponentsHelper.GetGrid(
					this.Header(),
					this.state.RoomNames.length === 0 ? this.EmptyGridContent() : this.GridContent()
				)}
				<div class="container-center-horizontal">
					<BlackButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Back'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.Back()}
					/>
					<RedButtonComponent
						icon={'fas fa-sync-alt'}
						title={'Refresh'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.Refresh()}
					/>
				</div>
			</div>
		);
	}

	private Header() {
		return (
			<thead>
				<tr class="d-flex">
					<th>Rooms</th>
				</tr>
			</thead>
		);
	}

	private EmptyGridContent() {
		return (
			<tbody>
				<tr class="d-flex">
					<td class="align-self-center">No room available...</td>
				</tr>
			</tbody>
		);
	}

	private GridContent() {
		return (
			<tbody>
				{this.state.RoomNames.map((RoomName) => {
					return (
						<tr class="d-flex">
							<td class="align-self-center">{RoomName}</td>
							<td class="align-self-center">
								{ComponentsHelper.GetSmBlackButton('Join', () => this.Join(RoomName))}
							</td>
						</tr>
					);
				})}
			</tbody>
		);
	}

	private Join(roomName: string): void {
		this._socket.emit(PacketKind[PacketKind.Available], {
			RoomName: roomName,
			PlayerName: this.state.PlayerName
		});
	}

	private Back() {
		route('/Home', true);
	}

	private Refresh() {
		this._socket.emit(PacketKind[PacketKind.Rooms]);
	}

	private Listen(): void {
		this._socket.on('connect', () => {
			this._socket.emit(PacketKind[PacketKind.Rooms]);
			this._socket.on(PacketKind[PacketKind.Rooms], (packet: { Content: string[] }) => {
				this.setState({
					RoomNames: packet.Content
				});
			});
			this._socket.on(PacketKind[PacketKind.Available], (data: { IsAvailable: boolean; RoomName: string }) => {
				if (data.IsAvailable) {
					route(`/Hosting/${data.RoomName}/${this.state.PlayerName}/${false}`, true);
				} else {
					toastr['warning'](`${this.state.PlayerName} is already used in ${data.RoomName}`, 'WARNING', {
						iconClass: 'toast-red'
					});
				}
			});
		});
		this._socket.on('connect_error', (error: string) => {
			toastr['warning'](`Server doesn't seem to be running.`, 'WARNING', { iconClass: 'toast-red' });
		});
	}
}
