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
			AudioArchive.tankMoving,
			AudioArchive.vehicle,

			AudioArchive.death,
			AudioArchive.death2,

			AudioArchive.shot,
			AudioArchive.shot2,
			AudioArchive.shot3,
			AudioArchive.powerUp,
			AudioArchive.powerUp2,
			AudioArchive.noMoney,

			AudioArchive.loungeMusic,
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

	private IsiOS(): boolean {
		return (
			[ 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod' ].includes(
				navigator.platform
			) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		);
	}

	public Loading(path: string, onLoaded: () => void): void {
		if (this.IsiOS()) {
			onLoaded();
		} else {
			const howl = new Howl({ src: [ path ], html5: true });
			howl.once('load', () => {
				this._audioService.Add(path, howl);
				onLoaded();
			});
		}
	}
}
