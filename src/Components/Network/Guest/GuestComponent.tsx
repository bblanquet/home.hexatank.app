import { h, Component } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import { PacketKind } from '../../../Network/Message/PacketKind';
import TextComponent from '../../Common/Text/TextComponent';
import IconTextComponent from '../../Common/Text/IconTextComponent';
import SmPanelComponent from '../../Common/Panel/SmPanelComponent';
import GridComponent from '../../Common/Grid/GridComponent';
import SmButtonComponent from '../../Common/Button/Stylish/SmButtonComponent';
import { Factory, FactoryKey } from '../../../Factory';
import { IHostingService } from '../../../Services/Hosting/IHostingService';
import Redirect from '../../Redirect/RedirectComponent';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import { Usernames } from '../Names';
import { RoomInfo } from './RoomInfo';
import * as io from 'socket.io-client';
import Visible from '../../Common/Visible/VisibleComponent';

export default class GuestComponent extends Component<
	any,
	{ Rooms: RoomInfo[]; DisplayableRooms: RoomInfo[]; PlayerName: string; filter: string; Password: string }
> {
	private _socket: SocketIOClient.Socket;
	constructor() {
		super();
		this.setState({
			Rooms: new Array<RoomInfo>(),
			DisplayableRooms: new Array<RoomInfo>(),
			PlayerName: 'Alice',
			filter: '',
			Password: ''
		});
		this._socket = io('{{p2pserver}}', { path: '{{p2psubfolder}}' });
		this._socket.connect();
		this.Listen();
	}

	componentDidUpdate() {
		if (this.state.filter && 0 < this.state.filter.length) {
			const newDisplayed = this.state.Rooms.filter((e) =>
				e.Name.toLowerCase().includes(this.state.filter.toLowerCase())
			);
			if (newDisplayed.length !== this.state.DisplayableRooms.length) {
				this.setState({
					DisplayableRooms: newDisplayed
				});
			}
		} else if (this.state.DisplayableRooms !== this.state.Rooms && this.state.filter.length === 0) {
			this.setState({
				DisplayableRooms: this.state.Rooms
			});
		}
	}

	componentWillUnmount() {
		if (this._socket) {
			this._socket.close();
		}
	}

	render() {
		return (
			<Redirect>
				<SmPanelComponent>
					<div class="container-center-horizontal">
						<TextComponent
							value={this.state.PlayerName}
							label={'Playername'}
							isEditable={true}
							onInput={(e: any) => {
								if (e.target.value) {
									this.setState({ PlayerName: e.target.value });
								} else {
									this.setState({ PlayerName: '' });
								}
							}}
						/>
						<div class="space-out" />
						<SmButtonComponent
							callBack={() => {
								this.setState({
									PlayerName: Usernames[Math.round(Math.random() * Usernames.length - 1)]
								});
							}}
							color={ColorKind.Blue}
						>
							<Icon Value="fas fa-random" />
						</SmButtonComponent>
					</div>
					<IconTextComponent
						value={this.state.filter}
						icon={'fas fa-filter'}
						isEditable={true}
						onInput={(e: any) => {
							if (e.target.value) {
								this.setState({
									filter: e.target.value
								});
							} else {
								this.setState({
									filter: ''
								});
							}
						}}
					/>
					<GridComponent
						left={''}
						right={this.state.Rooms.length === 0 ? this.EmptyGridContent() : this.GridContent()}
					/>
					<div style="margin-top:20px" />
					<IconTextComponent
						value={this.state.Password}
						icon={'fas fa-lock'}
						isEditable={true}
						onInput={(e: any) => {
							if (e.target.value) {
								this.setState({
									Password: e.target.value
								});
							} else {
								this.setState({
									Password: ''
								});
							}
						}}
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
				</SmPanelComponent>
			</Redirect>
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
				{this.state.DisplayableRooms.map((roomInfo) => {
					return (
						<tr class="d-flex">
							<td class="align-self-center">
								<SmButtonComponent callBack={() => this.Join(roomInfo.Name)} color={ColorKind.Black}>
									{'Join'}
								</SmButtonComponent>
							</td>
							<td class="align-self-center">
								<Visible isVisible={roomInfo.HasPassword}>
									<Icon Value="fas fa-lock" />
								</Visible>
								{` ${roomInfo.Name}`}
							</td>
							<td class="align-self-center">
								{roomInfo.PlayerCount}/{roomInfo.Count}
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
			this._socket.on(PacketKind[PacketKind.Rooms], (packet: { Content: RoomInfo[] }) => {
				for (let index = 0; index < 100; index++) {
					packet.Content.push(
						new RoomInfo(
							Usernames[Math.round(Math.random() * Usernames.length - 1)],
							Math.round(Math.random() * 3),
							Math.round(Math.random() * 2) > 1,
							4
						)
					);
				}
				this.setState({
					Rooms: packet.Content
				});
			});
			this._socket.on(PacketKind[PacketKind.Available], (data: { IsAvailable: boolean; RoomName: string }) => {
				if (data.IsAvailable) {
					Factory.Load<IHostingService>(FactoryKey.Hosting).Register(
						this.state.PlayerName,
						data.RoomName,
						this.state.Password,
						this.state.Password !== null && this.state.Password !== '',
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
