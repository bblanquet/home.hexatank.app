import { h, Component } from 'preact';
import Icon from '../Common/Icon/IconComponent';
import { Message } from '../Model/Message';
import Switch from './Switch';

export default class ChatComponent extends Component<{ messages: Message[]; player: string }, {}> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="container-center-horizontal">
				<div class="custom-grid-layout-3">
					<div
						class="custom-table"
						style="padding-top:20px;padding-bottom:20px;display: flex;flex-direction: column-reverse;"
					>
						{this.props.messages.map((message, index) => {
							return (
								<Switch
									isVisible={message.Name === this.props.player}
									left={
										<div class={index % 2 === 0 ? 'half-white' : ''}>
											<div class="text-wine right-text">
												<Icon Value="fas fa-arrow-left" /> {message.Name}
											</div>
											<div class="text-white right-text">{message.Content}</div>
										</div>
									}
									right={
										<div class={index % 2 === 0 ? 'half-white' : ''}>
											<div class="text-purple">
												<Icon Value="fas fa-arrow-right" /> {message.Name}
											</div>
											<div class="text-white">{message.Content}</div>
										</div>
									}
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
