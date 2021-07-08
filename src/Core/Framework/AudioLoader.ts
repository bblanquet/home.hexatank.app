import { Dictionary } from '../../Utils/Collections/Dictionary';
import { AudioArchive } from './AudioArchiver';
import { Howl } from 'howler';
import { ILoader } from './ILoader';

export class AudioLoader implements ILoader {
	constructor() {
		var context = new AudioContext();
		context.
	}

	public static Assets: Dictionary<Howl> = new Dictionary<Howl>();
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

	public Loading(path: string, onLoaded: () => void): void {
		const howler = new Howl({ src: [ path ] });
		howler.on('load', onLoaded);
		AudioLoader.Assets.Add(path, howler);
	}
}
