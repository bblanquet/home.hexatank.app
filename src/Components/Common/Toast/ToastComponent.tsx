import { Component, h } from 'preact';
import * as toastr from 'toastr';
import { PacketKind } from '../../../Network/Message/PacketKind';
import { NetworkObserver } from '../../../Network/NetworkObserver';
import { NetworkSocket } from '../../../Network/NetworkSocket';
import { PeerSocket } from '../../../Network/Peer/PeerSocket';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import Icon from '../../Common/Icon/IconComponent';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import { Message } from '../../Network/Message';
import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';

export default class ToastComponent extends Component<
	{ socket: NetworkSocket; Player: OnlinePlayer; onMessage: LiteEvent<Message> },
	{ Message: string }
> {
	private _toastObserver: NetworkObserver;
	private _input: HTMLInputElement;
	constructor(props: any) {
		super(props);
		this._toastObserver = new NetworkObserver(PacketKind.Toast, this.OnToastReceived.bind(this));
		toastr.options.closeDuration = 3000;
		this.props.socket.OnReceived.On(this._toastObserver);
	}

	componentDidMount() {}

	componentWillUnmount() {
		this.props.socket.OnReceived.Off(this._toastObserver);
	}

	render() {
		return (
			<div>
				{this.props.children}
				<div class="absolute-center-bottom full-width">
					<div class="input-group">
						<input
							type="text"
							class="form-control no-radius"
							id="toastMessageBox"
							ref={(v) => {
								this._input = v;
							}}
							value={this.state.Message}
							onKeyDown={(e: any) => {
								if (e.key === 'Enter') {
									this._input.blur();
									this.SendToast();
								}
							}}
							onInput={(e: any) => {
								this.setState({ Message: e.target.value });
							}}
							aria-label="Example text with button addon"
							aria-describedby="button-addon1"
						/>
						<div class="input-group-append">
							<button
								class="btn btn-dark"
								type="button"
								id="button-addon1"
								onClick={() => {
									this._input.blur();
									this.SendToast();
								}}
							>
								<Icon Value={'fas fa-comment'} />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	private OnToastReceived(message: NetworkMessage<string>): void {
		if (message) {
			const m = new Message();
			m.Content = message.Content;
			m.Name = message.Emitter;
			this.props.onMessage.Invoke(this, m);
		}
	}

	private SendToast(): void {
		let message = new NetworkMessage<string>();
		message.Emitter = this.props.Player.Name;
		message.Recipient = PeerSocket.All();
		message.Content = this.state.Message;
		message.Kind = PacketKind.Toast;

		const m = new Message();
		m.Content = this.state.Message;
		m.Name = message.Emitter;

		this.props.onMessage.Invoke(this, m);
		this.props.socket.Emit(message);

		this.setState({
			Message: ''
		});
	}
}
