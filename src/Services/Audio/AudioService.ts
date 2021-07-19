import { IAudioService } from './IAudioService';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { Howl } from 'howler';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { IGameAudioManager } from '../../Core/Framework/Audio/IGameAudioManager';

export class AudioService implements IAudioService {
	private _howls: Dictionary<Howl> = new Dictionary<Howl>();
	private _gameAudioManager: IGameAudioManager;
	private _isMute: boolean = false;
	private _activeHowls: Dictionary<number>;

	constructor() {
		this._activeHowls = new Dictionary<number>();
	}

	PlayLoungeMusic(): void {
		if (!this._isMute) {
			this.Play(AudioArchive.loungeMusic, 0.1, true);
		} else {
			this.Pause(AudioArchive.loungeMusic);
		}
	}

	GetGameAudioManager(): IGameAudioManager {
		return this._gameAudioManager;
	}

	SetMute(value: boolean): void {
		this._isMute = value;
	}

	IsMute(): boolean {
		return this._isMute;
	}

	private Howl(content: string): Howl {
		if (!this._howls.Exist(content)) {
			const howler = new Howl({ src: [ content ], html5: true });
			this._howls.Add(content, howler);
		}
		return this._howls.Get(content);
	}

	Add(path: string, howl: Howl): void {
		if (!this._howls.Exist(path)) {
			this._howls.Add(path, howl);
		}
	}

	Pause(content: string, id?: number): void {
		if (id) {
			this.Howl(content).pause(id);
		} else {
			this.Howl(content).pause(this._activeHowls.Get(content));
		}
	}

	PlayAgain(content: string, id?: number, volume?: number): void {
		if (!this._isMute) {
			let soundId = 0;
			if (id) {
				soundId = this.Howl(content).play(id);
			} else {
				if (this._activeHowls.Exist(content)) {
					soundId = this._activeHowls.Get(content);
				} else {
					soundId = this.Play(content, volume);
				}
				this.Howl(content).play(soundId);
			}

			if (volume) {
				this.Howl(content).volume(volume, soundId);
			}
		}
	}

	Stop(content: string, id: number): void {
		this.Howl(content).stop(id);
	}

	Play(content: string, volume: number, loop?: boolean): number | null {
		if (!this._isMute) {
			this.Howl(content).volume(volume);
			this.Howl(content).loop(loop);
			const sound = this.Howl(content).play();
			this._activeHowls.Add(content, sound);
			return sound;
		}
		return null;
	}

	Clear(): void {
		this._howls.Values().forEach((sound) => {
			sound.stop();
		});
		this._activeHowls.Clear();
	}

	Register(gameAudioManager: IGameAudioManager): void {
		this._gameAudioManager = gameAudioManager;
		if (!this.IsMute()) {
			this._gameAudioManager.PlayMusic();
		}
	}
}
