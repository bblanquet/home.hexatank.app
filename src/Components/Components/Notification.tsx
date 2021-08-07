import { h, Component } from 'preact';
import { NotificationState } from '../Model/NotificationState';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import Visible from '../Common/Struct/Visible';
import { useState } from 'preact/hooks';
import { NotificationHook } from '../Hooks/NotificationHook';
import { SizeKind } from '../Model/SizeKind';
import YellowFace from './Faces/YellowFace';
import GreenFace from './Faces/GreenFace';
import Switch from '../Common/Struct/Switch';

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
			this._notificationDiv.classList.remove('slow-bounce');
			setTimeout(() => {
				this._notificationDiv.classList.add('slow-bounce');
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
				<div class="toast-container">
					<div
						ref={(e) => (this._notificationDiv = e)}
						class="my-toast slow-bounce"
						style={`background-color:${this._hook.GetColor()};color:${this._hook.GetSecondaryColor()}`}
					>
						<div class="d-flex" style="flex-direction:row;align-content:space-between;align-items: center">
							<Switch
								isLeft={this._hook.IsError()}
								left={<YellowFace Size={SizeKind.Sm} />}
								right={<GreenFace Size={SizeKind.Sm} />}
							/>
							<div style="width:100%">{this._hook.State.Message}</div>
						</div>
					</div>
				</div>
			</Visible>
		);
	}
}
