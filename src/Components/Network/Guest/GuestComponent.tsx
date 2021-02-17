import { h, Component } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import { PacketKind } from '../../../Network/Message/PacketKind';
import TextComponent from '../../Common/Text/TextComponent';
import PanelComponent from '../../Common/Panel/PanelComponent';
import GridComponent from '../../Common/Grid/GridComponent';
import SmButtonComponent from '../../Common/Button/Stylish/SmButtonComponent';
import { Factory, FactoryKey } from '../../../Factory';
import { IHostingService } from '../../../Services/Hosting/IHostingService';
import Redirect from '../../Redirect/RedirectComponent';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import * as io from 'socket.io-client';

export default class GuestComponent extends Component<any, { RoomNames: string[]; PlayerName: string }> {
	private _socket: SocketIOClient.Socket;
	constructor() {
		super();
		this.setState({
			RoomNames: new Array<string>(),
			PlayerName: 'Alice'
		});
		this._socket = io('{{p2pserver}}', { path: '{{p2psubfolder}}' });
		this.Listen();
	}

	componentDidMount() {}

	componentWillUnmount() {
		if (this._socket) {
			this._socket.close();
		}
	}

	render() {
		return (
			<Redirect>
				<PanelComponent>
					<TextComponent
						value={this.state.PlayerName}
						label={'Playername'}
						isEditable={true}
						onInput={(e: any) => {
							this.setState({ PlayerName: e.target.value });
						}}
					/>
					<GridComponent
						left={this.Header()}
						right={this.state.RoomNames.length === 0 ? this.EmptyGridContent() : this.GridContent()}
					/>
					<div class="container-center-horizontal">
						<ButtonComponent
							callBack={() => {
								this.Back();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
						<ButtonComponent
							callBack={() => {
								this.Refresh();
							}}
							color={ColorKind.Red}
						>
							<Icon Value="fas fa-sync-alt" /> Refresh
						</ButtonComponent>
					</div>
				</PanelComponent>
			</Redirect>
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
								<SmButtonComponent callBack={() => this.Join(RoomName)} color={ColorKind.Black}>
									{'Join'}
								</SmButtonComponent>
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
					Factory.Load<IHostingService>(FactoryKey.Hosting).Register(
						this.state.PlayerName,
						data.RoomName,
						false
					);
					route('/Hosting', true);
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
