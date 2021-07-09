import { Dictionary } from '../../Utils/Collections/Dictionary';
import { AudioArchive } from './AudioArchiver';
import { Howl } from 'howler';
import { ILoader } from './ILoader';

export class AudioLoader implements ILoader {
	public Audios(): string[] {
		return [
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
	}

	private IsIos(): boolean {
		return (
			[ 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod' ].includes(
				navigator.platform
			) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		);
	}

	public Loading(path: string, onLoaded: () => void): void {
		const audio = new Audio();
		audio.preload = 'auto';
		audio.src = path;
		if (this.IsIos()) {
			onLoaded();
		} else {
			audio.addEventListener('canplaythrough', () => onLoaded(), false);
		}

		audio.load();
	}
}
