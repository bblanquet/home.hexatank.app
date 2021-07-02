import { StateUpdater } from 'preact/hooks';
import { CustomerState } from '../Model/CustomerState';
import { Hook } from './Hook';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ErrorDetail } from '../Model/ErrorDetail';
import { NotificationItem } from '../Components/Notification/NotificationItem';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { LogKind } from '../../Utils/Logger/LogKind';
import { route } from 'preact-router';

export class CustomerHook extends Hook<CustomerState> {
	public OnNotification: LiteEvent<NotificationItem> = new LiteEvent<NotificationItem>();

	constructor(state: CustomerState, setState: StateUpdater<CustomerState>) {
		super(state, setState);
		this.Refresh();
	}

	Back() {
		route('{{sub_path}}Home', true);
	}
	Refresh() {
		axios
			.get('{{p2p_url}}/server/exception/list')
			.then((response: AxiosResponse<ErrorDetail[]>) => {
				this.SetProp((e) => {
					e.Errors = response.data;
				});
			})
			.catch((error: AxiosError) => {
				this.SetProp((e) => {
					e.Errors = [];
				});
				this.OnNotification.Invoke(this, new NotificationItem(LogKind.error, error.message));
			});
	}

	static DefaultState(): any {
		return new CustomerState();
	}

	public Unmount(): void {}
}
