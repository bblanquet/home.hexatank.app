import { StateUpdater } from 'preact/hooks';
import { CustomerState } from '../Model/CustomerState';
import { Hook } from './Hook';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ErrorDetail } from '../Model/ErrorDetail';
import { NotificationState } from '../Model/NotificationState';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { LogKind } from '../../Utils/Logger/LogKind';
import { route } from 'preact-router';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IAppService } from '../../Services/App/IAppService';
import { IRecordService } from '../../Services/Record/IRecordService';
import { Singletons, SingletonKey } from '../../Singletons';

export class MonitoringHook extends Hook<CustomerState> {
	public OnNotification: LiteEvent<NotificationState> = new LiteEvent<NotificationState>();
	private _appService: IAppService<GameBlueprint>;
	private _recordService: IRecordService;

	constructor(state: CustomerState, setState: StateUpdater<CustomerState>) {
		super(state, setState);
		this._appService = Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.RecordApp);
		this._recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
		this.Refresh();
	}

	Back() {
		route('{{sub_path}}Home', true);
	}
	Refresh() {
		axios
			.get('{{error_url}}/server/Exception/List')
			.then((response: AxiosResponse<ErrorDetail[]>) => {
				this.SetProp((e) => {
					e.Errors = response.data;
				});
			})
			.catch((error: AxiosError) => {
				this.SetProp((e) => {
					e.Errors = [];
				});
				this.OnNotification.Invoke(this, new NotificationState(LogKind.error, error.message));
			});
	}

	static DefaultState(): any {
		return new CustomerState();
	}

	public Play(errorId: number): void {
		axios
			.get(`{{error_url}}/server/Exception/Get?id=${errorId}`)
			.then((response: AxiosResponse<ErrorDetail>) => {
				try {
					const data = RecordContent.To(JSON.parse(response.data.content));
					this._appService.Register(data.Blueprint);
					this._recordService.Register(data);
					route('{{sub_path}}Player', true);
				} catch (error) {
					this.OnNotification.Invoke(
						this,
						new NotificationState(LogKind.error, `Could not parse data from error ${errorId} `)
					);
				}
			})
			.catch((error: AxiosError) => {
				this.SetProp((e) => {
					e.Errors = [];
				});
				this.OnNotification.Invoke(this, new NotificationState(LogKind.error, error.message));
			});
	}

	public Unmount(): void {}
}
