import { VehiclePaths } from './../../Interaction/Combination/Multi/MultiSelectionHelper';
import { Missile } from './../../Items/Unit/Missile';
import { Tank } from './../../Items/Unit/Tank';
import { GameContext } from './../GameContext';
import { Howl } from 'howler';
import { SpriteProvider } from '../SpriteProvider';
import { AudioContent } from '../AudioArchiver';
import { Cell } from '../../Items/Cell/Cell';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';

export class SoundManager {
	private _sounds: Dictionnary<Howl>;
	private _movingSounds: Dictionnary<number>;

	constructor(private _gameContext: GameContext) {
		this._movingSounds = new Dictionnary<number>();
		this._sounds = new Dictionnary<Howl>();
		[
			AudioContent.unitPopup,
			AudioContent.fieldPopup,
			AudioContent.selection,
			AudioContent.explosion,
			AudioContent.tankMoving
		].forEach((content) => {
			this.Add(content);
		});

		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicle.bind(this));
			hq.OnFieldAdded.On(this.HandleFieldChanged.bind(this));
		});
	}

	private Add(content: string) {
		this._sounds.Add(content, new Howl({ src: [ `${SpriteProvider.Root()}${content}` ] }));
	}

	private HandleVehicle(src: Headquarter, vehicule: Vehicle): void {
		if (vehicule instanceof Tank) {
			const t = vehicule as Tank;
			t.OnMissileLaunched.On(this.HandleMissile.bind(this));
		}

		vehicule.OnNextCellChanged.On(this.HandleMusic.bind(this));
		vehicule.OnStopping.On(this.StopMusic.bind(this));

		if (vehicule.GetCurrentCell().IsVisible()) {
			this._sounds.Get(AudioContent.unitPopup).play();
		}
	}

	private HandleMissile(src: any, missible: Missile): void {
		missible.OnDestroyed.On(this.HandleDestroyedMissile.bind(this));
	}

	private HandleDestroyedMissile(src: any, missible: Missile): void {
		if (missible.Target.GetCurrentCell().IsVisible()) {
			this._sounds.Get(AudioContent.explosion).play();
		}
	}

	private HandleMusic(src: any, cell: Cell): void {
		const v = src as Vehicle;
		if (!this._movingSounds.Exist(v.Id)) {
			const soundDefinition = this._sounds.Get(AudioContent.tankMoving);
			soundDefinition.volume(0.5);
			const sound = soundDefinition.play();
			soundDefinition.loop(true, sound);
			this._movingSounds.Add(v.Id, sound);
		}
	}

	private StopMusic(src: any, cell: Cell): void {
		const vehicle = src as Vehicle;
		this._sounds.Get(AudioContent.tankMoving).stop(this._movingSounds.Get(vehicle.Id));
		this._movingSounds.Remove(vehicle.Id);
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		if (cell.IsVisible()) {
			this._sounds.Get(AudioContent.fieldPopup).play();
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this._sounds.Get(AudioContent.selection).play();
	}
}
