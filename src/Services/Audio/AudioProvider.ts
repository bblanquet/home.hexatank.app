import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { Howl } from 'howler';

export class AudioProvider {
	public GetContent(): Dictionary<Howl> {
		const sounds = new Dictionary<Howl>();
		[
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
		].forEach((content) => {
			this.Add(content, sounds);
		});
		return sounds;
	}

	private Add(content: string, sounds: Dictionary<Howl>) {
		sounds.Add(content, new Howl({ src: [ `${SpriteProvider.AssetPath()}${content}` ] }));
	}
}
