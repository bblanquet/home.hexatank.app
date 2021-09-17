import { StateUpdater } from 'preact/hooks';
import { MonitoringState } from '../Model/MonitoringState';
import { Hook } from '../Framework/Hook';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ErrorDetail } from '../Model/ErrorDetail';
import { NotificationState } from '../Model/NotificationState';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { LogKind } from '../../Utils/Logger/LogKind';
import { route } from 'preact-router';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IBuilder } from '../../Services/Builder/IBuilder';
import { IRecordService } from '../../Services/Record/IRecordService';
import { Singletons, SingletonKey } from '../../Singletons';
import { RequestState } from '../Model/RequestState';

export class MonitoringHook extends Hook<MonitoringState> {
	public OnNotification: LiteEvent<NotificationState> = new LiteEvent<NotificationState>();
	private _appService: IBuilder<GameBlueprint>;
	private _recordService: IRecordService;

	constructor(state: MonitoringState, setState: StateUpdater<MonitoringState>) {
		super(state, setState);
		this._appService = Singletons.Load<IBuilder<GameBlueprint>>(SingletonKey.PlayerBuilder);
		this._recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
		this.Refresh();
	}

	Back() {
		route('{{sub_path}}Home', true);
	}
	Refresh() {
		this.Update((e) => {
			e.State = RequestState.LOADING;
		});
		axios
			.get('{{server}}/Exception/List')
			.then((response: AxiosResponse<ErrorDetail[]>) => {
				this.Update((e) => {
					e.Errors = response.data;
					e.State = RequestState.LOADED;
				});
			})
			.catch((error: AxiosError) => {
				this.Update((e) => {
					e.Errors = [];
					e.State = RequestState.ERROR;
				});
				this.OnNotification.Invoke(this, new NotificationState(LogKind.error, error.message));
			});
	}

	static DefaultState(): any {
		return new MonitoringState();
	}

	public Play(errorId: number): void {
		axios
			.get(`{{server}}/Exception/Get?id=${errorId}`)
			.then((response: AxiosResponse<ErrorDetail>) => {
				try {
					const data = RecordContent.To(JSON.parse(response.data.content));
					this._appService.Register(data.Blueprint, () => {}, () => {});
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
				this.Update((e) => {
					e.Errors = [];
				});
				this.OnNotification.Invoke(this, new NotificationState(LogKind.error, error.message));
			});
	}

	public Unmount(): void {}
}
