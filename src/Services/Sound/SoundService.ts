import { GameSoundManager } from './../../Core/Framework/Sound/GameSoundManager';
import { SpriteProvider } from './../../Core/Framework/SpriteProvider';
import { Howl } from 'howler';
import { Dictionnary } from './../../Core/Utils/Collections/Dictionnary';
import { ISoundService } from './ISoundService';
import { AudioContent } from '../../Core/Framework/AudioArchiver';
import { GameContext } from '../../Core/Framework/GameContext';

export class SoundService implements ISoundService {
	private _sounds: Dictionnary<Howl>;
	private _soundManager: GameSoundManager;
	private _loungeMusic: number;
	constructor() {
		this._sounds = new Dictionnary<Howl>();
		[
			AudioContent.unitPopup,
			AudioContent.unitPopup2,
			AudioContent.fieldPopup,
			AudioContent.selection,
			AudioContent.explosion,
			AudioContent.tankMoving,
			AudioContent.death,
			AudioContent.death2,
			AudioContent.shot,
			AudioContent.shot2,
			AudioContent.shot3,
			AudioContent.powerUp,
			AudioContent.noMoney,
			AudioContent.menuMusic,
			AudioContent.iceMusic,
			AudioContent.sandMusic,
			AudioContent.forestMusic
		].forEach((content) => {
			this.Add(content);
		});

		const lounge = this._sounds.Get(AudioContent.menuMusic);
		lounge.loop(true);
		lounge.volume(0.01);
		this._loungeMusic = lounge.play();
	}

	Collect(): void {
		this._sounds.Get(AudioContent.menuMusic).play(this._loungeMusic);
	}

	GetSoundManager(): GameSoundManager {
		return this._soundManager;
	}

	Register(gameContext: GameContext): void {
		this._sounds.Get(AudioContent.menuMusic).pause(this._loungeMusic);
		const copy = new Dictionnary<Howl>();
		this._sounds.Keys().forEach((k) => {
			copy.Add(k, this._sounds.Get(k));
		});
		this._soundManager = new GameSoundManager(copy, gameContext);
	}

	private Add(content: string) {
		this._sounds.Add(content, new Howl({ src: [ `${SpriteProvider.Root()}${content}` ] }));
	}
}
