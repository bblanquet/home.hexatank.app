import { Component, h } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import { CreatingHostState } from './CreatingHostState';
const io = require('socket.io-client');
import { PacketKind } from '../../../Network/Message/PacketKind';
import RedButtonComponent from '../../Common/Button/Stylish/RedButtonComponent';
import BlackButtonComponent from '../../Common/Button/Stylish/BlackButtonComponent';
import PanelComponent from '../../Common/Panel/PanelComponent';
import TextComponent from '../../Common/Text/TextComponent';

export default class CreatingHostComponent extends Component<any, CreatingHostState> {
	private _socket: SocketIOClient.Socket;
	private _isFirstRender = true;

	constructor() {
		super();
		this.setState({
			RoomName: "John's room",
			PlayerName: 'John'
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
			<PanelComponent>
				<TextComponent
					value={this.state.PlayerName}
					label={'Room name'}
					isEditable={true}
					onInput={(e: any) => {
						this.setState({ RoomName: e.target.value });
					}}
				/>
				<TextComponent
					value={this.state.PlayerName}
					label={'Playername'}
					isEditable={true}
					onInput={(e: any) => {
						this.setState({ PlayerName: e.target.value });
					}}
				/>
				<div class="container-center-horizontal">
					<BlackButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Back'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.Back()}
					/>
					<RedButtonComponent
						icon={'far fa-play-circle'}
						title={'Start'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.Start()}
					/>
				</div>
			</PanelComponent>
		);
	}

	private Listen(): void {
		this._socket.on('connect', () => {
			this._socket.on(PacketKind[PacketKind.Exist], (data: { Exist: boolean; RoomName: string }) => {
				if (!data.Exist) {
					route(`/Hosting/${this.state.RoomName}/${this.state.PlayerName}/${true}`, true);
				} else {
					toastr['warning'](`${data.RoomName} is already used.`, 'WARNING', { iconClass: 'toast-red' });
				}
			});
		});
		this._socket.on('connect_error', (error: string) => {
			toastr['warning'](`Server doesn't seem to be running.`, 'WARNING', { iconClass: 'toast-red' });
		});
	}

	private Start(): void {
		this._socket.emit(PacketKind[PacketKind.Exist], { RoomName: this.state.RoomName });
	}

	private Back() {
		route('/Home', true);
	}
}
