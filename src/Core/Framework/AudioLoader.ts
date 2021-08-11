import { Howl } from 'howler';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { AudioArchive } from './AudioArchiver';
import { ILoader } from './ILoader';

export class AudioLoader implements ILoader {
	constructor(private _audioService: IAudioService) {}

	public Audios(): string[] {
		const audios = [
			AudioArchive.ayaya,
			AudioArchive.copyThat,
			AudioArchive.engage,
			AudioArchive.fireAtWills,
			AudioArchive.sirYesSir,
			AudioArchive.transmissionReceived,
			AudioArchive.construction,
			AudioArchive.allClear,
			AudioArchive.moveOut,
			AudioArchive.understood,

			AudioArchive.ok,
			AudioArchive.nok,
			AudioArchive.unitPopup,
			AudioArchive.unitPopup2,
			AudioArchive.fieldPopup,
			AudioArchive.selection,
			AudioArchive.explosion,
			AudioArchive.vehicle,

			AudioArchive.death,
			AudioArchive.death2,

			AudioArchive.shot,
			AudioArchive.shot2,
			AudioArchive.shot3,
			AudioArchive.powerUp,
			AudioArchive.powerUp2,
			AudioArchive.noMoney,

			AudioArchive.iceMusic,
			AudioArchive.sandMusic,
			AudioArchive.forestMusic,

			AudioArchive.victory,
			AudioArchive.defeat
		];

		return audios.map((audio) => {
			return AudioLoader.GetAudio(audio);
		});
	}

	public static GetAudio(audio: string) {
		let path = audio;
		path = path.slice(1); //remove dot
		path = `{{asset_path}}${path}`;
		path = path.replace('//', '/');
		return path;
	}

	public Loading(path: string, onLoaded: () => void): void {
		const howl = new Howl({ src: [ path ], html5: true });
		howl.once('load', () => {
			this._audioService.Add(path, howl);
			onLoaded();
		});
	}
}
