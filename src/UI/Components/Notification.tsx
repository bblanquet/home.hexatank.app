import { h, Component } from 'preact';
import { NotificationState } from '../Model/NotificationState';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import Icon from '../Common/Icon/IconComponent';
import Visible from './Visible';
import { useState } from 'preact/hooks';
import { NotificationHook } from '../Hooks/NotificationHook';

export default class Notification extends Component<{ OnNotification: LiteEvent<NotificationState> }> {
	private _notificationDiv: HTMLElement;
	private _animate: any = this.Animate.bind(this);
	private _hook: NotificationHook;

	public componentWillUnmount() {
		this._hook.Unmount();
		this._hook.OnAnimate.Off(this._animate);
	}

	public componentDidMount() {
		this._hook.On(this.props.OnNotification);
	}

	private Animate() {
		if (this._notificationDiv) {
			this._notificationDiv.classList.remove('bounce');
			setTimeout(() => {
				this._notificationDiv.classList.add('bounce');
			}, 50);
		}
	}

	render() {
		if (!this._hook) {
			this._hook = new NotificationHook(useState(NotificationHook.DefaultState()));
			this._hook.OnAnimate.On(this._animate);
		}
		return (
			<Visible isVisible={0 < this._hook.State.Message.length}>
				<div class="toast-container" onClick={() => this._hook.Update()}>
					<div
						ref={(e) => (this._notificationDiv = e)}
						class="my-toast bounce"
						style={`background-color:${this._hook.GetColor()};`}
					>
						<span class="space-out">
							<Icon Value={this._hook.GetIcon()} />
						</span>
						<span class="space-out">{this._hook.State.Message}</span>
					</div>
				</div>
			</Visible>
		);
	}
}
