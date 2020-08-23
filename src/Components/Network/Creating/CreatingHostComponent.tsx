import { Component, h } from 'preact';
import { route } from 'preact-router';
import linkState from 'linkstate';
import * as toastr from 'toastr';
import { CreatingHostState } from './CreatingHostState';
const io = require('socket.io-client');
import { PacketKind } from '../../../Network/Message/PacketKind';
import { ComponentsHelper } from '../../ComponentsHelper';

export default class CreatingHostComponent extends Component<any, CreatingHostState> {
	private _socket: any;
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
							<span class="input-group-text" id="inputGroup-sizing-default">
								Room name
							</span>
						</div>
						<input
							type="text"
							value={this.state.RoomName}
							onInput={linkState(this, 'RoomName')}
							class="form-control"
							aria-label="Default"
							aria-describedby="inputGroup-sizing-default"
						/>
					</div>
				</div>
				<div class="form-group mb-2">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text" id="inputGroup-sizing-default">
								Player Name
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
				<div class="container-center-horizontal">
					{ComponentsHelper.GetBlackButton(this._isFirstRender, 'fas fa-undo-alt', 'Back', this.Back)}
					{ComponentsHelper.GetRedButton(this._isFirstRender, 'far fa-play-circle', 'Start', this.Start)}
				</div>
			</div>
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

	private Start(e: any): void {
		this._socket.emit(PacketKind[PacketKind.Exist], { RoomName: this.state.RoomName });
	}

	private Back(e: any) {
		route('/Home', true);
	}
}
