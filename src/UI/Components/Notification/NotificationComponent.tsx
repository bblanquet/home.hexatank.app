import { h, Component } from 'preact';
import { LogKind } from '../../../Utils/Logger/LogKind';
import { StaticLogger } from '../../../Utils/Logger/StaticLogger';
import { NotificationItem } from './NotificationItem';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import Icon from '../../Common/Icon/IconComponent';
import Visible from '../VisibleComponent';

export default class Notification extends Component<
	{ OnNotification: LiteEvent<NotificationItem> },
	{ Item: NotificationItem }
> {
	private _timeout: NodeJS.Timeout;
	private _ref: any = this.HandleNotification.bind(this);
	private _div: any;
	constructor() {
		super();
		this.setState({
			Item: new NotificationItem(LogKind.error, '')
		});
	}

	public componentDidMount() {
		this.props.OnNotification.On(this._ref);
	}

	public componentWillUnmount() {
		this.props.OnNotification.Off(this._ref);
	}

	private HandleNotification(src: any, notification: NotificationItem): void {
		if (notification.Message !== '') {
			this.setState({
				Item: notification
			});

			if (this._div) {
				this._div.classList.remove('bounce');
				setTimeout(() => {
					this._div.classList.add('bounce');
				}, 50);
			}

			if (this._timeout) {
				clearTimeout(this._timeout);
			}
			this._timeout = setTimeout(() => {
				this.state.Item.Message = '';
				this.setState({
					Item: this.state.Item
				});
			}, 3000);
		}
	}

	render() {
		return (
			<div>
				{this.props.children}
				<Visible isVisible={this.state.Item.Message && 0 < this.state.Item.Message.length}>
					<div class="toast-container">
						<div
							ref={(e) => (this._div = e)}
							class="my-toast bounce"
							style={`background-color:${StaticLogger.Colors.Get(LogKind[this.state.Item.Kind])};`}
						>
							<span class="space-out">
								<Icon Value={StaticLogger.Icons.Get(LogKind[this.state.Item.Kind])} />
							</span>
							<span class="space-out">{this.state.Item.Message}</span>
						</div>
					</div>
				</Visible>
			</div>
		);
	}
}
