import { h, Component } from 'preact';
import Icon from '../Common/Icon/IconComponent';
import { Message } from '../Model/Message';

export default class ChatComponent extends Component<{ messages: Message[]; player: string }, {}> {
	constructor() {
		super();
	}

	private TextMessage(message: Message, style: string) {
		if (message.Name === this.props.player) {
			return (
				<div class={style}>
					<div class="text-wine right-text">
						<Icon Value="fas fa-arrow-left" /> {message.Name}
					</div>
					<div class="text-white right-text">{message.Content}</div>
				</div>
			);
		} else {
			return (
				<div class={style}>
					<div class="text-purple">
						<Icon Value="fas fa-arrow-right" /> {message.Name}
					</div>
					<div class="text-white">{message.Content}</div>
				</div>
			);
		}
	}

	render() {
		return (
			<div class="custom-grid-layout-4">
				<div class="custom-grid-layout-3 ">
					<div
						class="custom-table"
						style="padding-top:20px;padding-bottom:20px;
                        overflow: auto;
                        height:30vh;
                        display: flex;
                        flex-direction: column-reverse;"
					>
						{this.props.messages.map((mesage, index) => {
							if (index % 2 === 0) {
								return this.TextMessage(mesage, 'half-white');
							} else {
								return this.TextMessage(mesage, '');
							}
						})}
					</div>
				</div>
			</div>
		);
	}
}
