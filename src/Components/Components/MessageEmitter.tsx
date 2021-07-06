import { Component, h } from 'preact';
import Icon from '../Common/Icon/IconComponent';

export default class MessageEmitter extends Component<{ callBack: (e: string) => void }, { Message: string }> {
	private _input: HTMLInputElement;

	render() {
		return (
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
		);
	}

	private SendMessage(): void {
		this.props.callBack(this.state.Message);
		this.setState({
			Message: ''
		});
	}
}
