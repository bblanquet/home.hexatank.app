import { SoundProvider } from './SoundProvider';
import { GameSoundManager } from './../../Core/Framework/Sound/GameSoundManager';
import { Dictionnary } from './../../Core/Utils/Collections/Dictionnary';
import { ISoundService } from './ISoundService';
import { GameContext } from '../../Core/Framework/GameContext';
import { Howl } from 'howler';
import { BattleBlueprint } from '../../Core/Setup/Blueprint/Battle/BattleBlueprint';

export class SoundService implements ISoundService {
	private _sounds: Dictionnary<Howl>;
	private _soundManager: GameSoundManager;
	private _isMute: boolean = true;
	private _playingSounds: Dictionnary<number>;

	constructor() {
		this.Reload();
		this._playingSounds = new Dictionnary<number>();
		this._isMute = true;
	}
	Reload(): void {
		this._sounds = new SoundProvider().GetContent();
	}

	Collect(): void {
		this.On();
	}

	GetSoundManager(): GameSoundManager {
		return this._soundManager;
	}

	On(): void {
		this._isMute = false;
	}

	Off(): void {
		this._isMute = true;
	}

	IsMute(): boolean {
		return this._isMute;
	}

	Pause(content: string, id?: number): void {
		if (id) {
			this._sounds.Get(content).pause(id);
		} else {
			this._sounds.Get(content).pause(this._playingSounds.Get(content));
		}
	}

	PlayAgain(content: string, id?: number, volume?: number): void {
		if (!this._isMute) {
			let soundId = 0;
			if (id) {
				soundId = this._sounds.Get(content).play(id);
			} else {
				if (this._playingSounds.Exist(content)) {
					soundId = this._playingSounds.Get(content);
				} else {
					soundId = this.Play(content, volume);
				}
				this._sounds.Get(content).play(soundId);
			}

			if (volume) {
				this._sounds.Get(content).volume(volume, soundId);
			}
		}
	}

	Stop(content: string, id: number): void {
		this._sounds.Get(content).stop(id);
	}

	Play(content: string, volume: number, loop?: boolean): number | null {
		if (!this._isMute) {
			const sound = this._sounds.Get(content).play();
			this._sounds.Get(content).volume(volume);
			this._sounds.Get(content).loop(loop);
			this._playingSounds.Add(content, sound);
			return sound;
		}
		return null;
	}

	Exist(content: string): boolean {
		return this._sounds.Exist(content);
	}

	Clear(): void {
		this._sounds.Values().forEach((sound) => {
			sound.unload();
		});
		this._playingSounds.Clear();
		this._sounds.Clear();
	}

	Register(mapContext: BattleBlueprint, gameContext: GameContext): void {
		const copy = new Dictionnary<Howl>();
		this._sounds.Keys().forEach((k) => {
			copy.Add(k, this._sounds.Get(k));
		});
		this._soundManager = new GameSoundManager(mapContext, gameContext);
		if (!this.IsMute()) {
			this._soundManager.StartMusic();
		}
	}
}
