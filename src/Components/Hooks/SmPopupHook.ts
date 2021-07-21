import { StateUpdater } from 'preact/hooks';
import { Hook } from './Hook';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { IAppService } from '../../Services/App/IAppService';
import { IKeyService } from '../../Services/Key/IKeyService';
import { route } from 'preact-router';
import { Singletons, SingletonKey } from '../../Singletons';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { SmState } from '../Model/SmState';
import { AudioLoader } from '../../Core/Framework/AudioLoader';

export class SmPopupHook extends Hook<SmState> {
	private _audioService: IAudioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
	private _appService: IAppService<IBlueprint>;
	private _keyService: IKeyService;

	constructor(d: [SmState, StateUpdater<SmState>]) {
		super(d[0], d[1]);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService<IBlueprint>>(this._keyService.GetAppKey());
		if (d[0].Status === GameStatus.Victory) {
			this._audioService.Play(AudioLoader.GetAudio(AudioArchive.victory), 0.1, false);
		}

		if (d[0].Status === GameStatus.Defeat) {
			this._audioService.Play(AudioLoader.GetAudio(AudioArchive.defeat), 0.1, false);
		}
	}

	public Quit(): void {
		route('{{sub_path}}Home', true);
	}

	public HasRetry(): boolean {
		return this.State.Status === GameStatus.Defeat && this._appService.IsRetriable();
	}

	public Retry(): void {
		this._appService.Retry();
	}

	public Unmount(): void {}
}
