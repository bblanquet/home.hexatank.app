import { Component, h } from 'preact';
import Icon from '../../Common/Icon/IconComponent';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import { ILobbyManager } from '../../../Network/Manager/ILobbyManager';

export default class ToastComponent extends Component<
	{ _lobby: ILobbyManager; Player: OnlinePlayer },
	{ Message: string }
> {
	private _input: HTMLInputElement;
	constructor(props: any) {
		super(props);
	}

	componentDidMount() {}

	render() {
		return (
			<div>
				{this.props.children}
				<div class="absolute-center-bottom full-width">
					<div class="input-group">
						<input
							max={100}
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
									this.SendMessage();
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
									this.SendMessage();
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

	private SendMessage(): void {
		this.props._lobby.SendMessage(this.state.Message);
		this.setState({
			Message: ''
		});
	}
}
