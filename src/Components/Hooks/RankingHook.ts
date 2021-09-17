import { StateUpdater } from 'preact/hooks';
import { PlayerRankState } from '../Model/PlayerRankState';
import { Hook } from '../Framework/Hook';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NotificationState } from '../Model/NotificationState';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { LogKind } from '../../Utils/Logger/LogKind';
import { route } from 'preact-router';
import { RequestState } from '../Model/RequestState';
import { PlayerRank } from '../Model/PlayerRank';

export class RankingHook extends Hook<PlayerRankState> {
	public OnNotification: LiteEvent<NotificationState> = new LiteEvent<NotificationState>();

	constructor(state: PlayerRankState, setState: StateUpdater<PlayerRankState>) {
		super(state, setState);
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
			.get('{{error_url}}/player/top100')
			.then((response: AxiosResponse<PlayerRank[]>) => {
				this.Update((e) => {
					e.Players = response.data;
					e.State = RequestState.LOADED;
				});
			})
			.catch((error: AxiosError) => {
				this.Update((e) => {
					e.Players = [];
					e.State = RequestState.ERROR;
				});
				this.OnNotification.Invoke(this, new NotificationState(LogKind.error, error.message));
			});
	}

	static DefaultState(): any {
		return new PlayerRankState();
	}

	public Unmount(): void {}
}
