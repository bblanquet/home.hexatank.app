import { Hook } from './Hook';
import { PopupState } from '../Model/PopupState';
import { StateUpdater } from 'preact/hooks';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { IAppService } from '../../Services/App/IAppService';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IKeyService } from '../../Services/Key/IKeyService';
import { Singletons, SingletonKey } from '../../Singletons';
import { route } from 'preact-router';
import { StatsKind } from '../../Utils/Stats/StatsKind';

export class PopupHook extends Hook<PopupState> {
	private _audioService: IAudioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
	private _appService: IAppService<IBlueprint>;
	private _keyService: IKeyService;

	constructor(d: [PopupState, StateUpdater<PopupState>]) {
		super(d[0], d[1]);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService<IBlueprint>>(this._keyService.GetAppKey());
		if (d[0].Status === GameStatus.Victory) {
			this._audioService.Play(AudioArchive.victory, 0.1, false);
		}

		if (d[0].Status === GameStatus.Defeat) {
			this._audioService.Play(AudioArchive.defeat, 0.1, false);
		}
	}

	public UpdateState(kind: StatsKind): void {
		if (this.State.Canvas) {
			const curves = this.State.Curves.Get(StatsKind[kind]);
			if (curves) {
				this.Update((e) => {
					e.Kind = kind;
					e.Canvas = this.State.Chart.GetCanvas(StatsKind[kind], curves);
				});
			}
		}
	}

	public HasRetry(): boolean {
		return this.State.Status === GameStatus.Defeat && this._appService.IsRetriable();
	}

	public Retry(): void {
		this._appService.Retry();
	}

	public Quit(): void {
		route('{{sub_path}}Home', true);
	}

	public Unmount(): void {}
}
