import { h, Component } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import { PacketKind } from '../../../Network/Message/PacketKind';
import BlackButtonComponent from '../../Common/Button/Stylish/BlackButtonComponent';
import TextComponent from '../../Common/Text/TextComponent';
import RedButtonComponent from '../../Common/Button/Stylish/RedButtonComponent';
import PanelComponent from '../../Common/Panel/PanelComponent';
import GridComponent from '../../Common/Grid/GridComponent';
import SmBlackButtonComponent from '../../Common/Button/Stylish/SmBlackButtonComponent';
import { Factory, FactoryKey } from '../../../Factory';
import { IHostingService } from '../../../Services/Hosting/IHostingService';

const io = require('socket.io-client');

export default class GuestComponent extends Component<any, { RoomNames: string[]; PlayerName: string }> {
	private _socket: any;

	constructor() {
		super();
		this.setState({
			RoomNames: new Array<string>(),
			PlayerName: 'Alice'
		});
		this._socket = io('https://mottet.xyz:9117');
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
					<BlackButtonComponent icon={'fas fa-undo-alt'} title={'Back'} callBack={() => this.Back()} />
					<RedButtonComponent icon={'fas fa-sync-alt'} title={'Refresh'} callBack={() => this.Refresh()} />
				</div>
			</PanelComponent>
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
								<SmBlackButtonComponent title={'Join'} callBack={() => this.Join(RoomName)} />
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
