import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { AudioContent } from '../../Core/Framework/AudioArchiver';
import { Howl } from 'howler';

export class AudioProvider {
	public GetContent(): Dictionnary<Howl> {
		const sounds = new Dictionnary<Howl>();
		[
			AudioContent.ayaya,
			AudioContent.copyThat,
			AudioContent.engage,
			AudioContent.fireAtWills,
			AudioContent.sirYesSir,
			AudioContent.transmissionReceived,
			AudioContent.construction,
			AudioContent.allClear,
			AudioContent.moveOut,
			AudioContent.understood,

			AudioContent.ok,
			AudioContent.nok,
			AudioContent.unitPopup,
			AudioContent.unitPopup2,
			AudioContent.fieldPopup,
			AudioContent.selection,
			AudioContent.explosion,
			AudioContent.tankMoving,
			AudioContent.vehicle,

			AudioContent.death,
			AudioContent.death2,

			AudioContent.shot,
			AudioContent.shot2,
			AudioContent.shot3,
			AudioContent.powerUp,
			AudioContent.powerUp2,
			AudioContent.noMoney,

			AudioContent.menuMusic,
			AudioContent.iceMusic,
			AudioContent.sandMusic,
			AudioContent.forestMusic
		].forEach((content) => {
			this.Add(content, sounds);
		});
		return sounds;
	}

	private Add(content: string, sounds: Dictionnary<Howl>) {
		sounds.Add(content, new Howl({ src: [ `${SpriteProvider.Root()}${content}` ] }));
	}
}
