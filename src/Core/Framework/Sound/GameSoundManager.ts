import { MapEnv } from './../../Setup/Generator/MapEnv';
import { Missile } from '../../Items/Unit/Missile';
import { Tank } from '../../Items/Unit/Tank';
import { GameContext } from '../GameContext';
import { Howl } from 'howler';
import { AudioContent } from '../AudioArchiver';
import { Cell } from '../../Items/Cell/Cell';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { Turrel } from '../../Items/Unit/Turrel';

export class GameSoundManager {
	private _vehicleSounds: Dictionnary<number>;
	private _music: number;

	constructor(private _sounds: Dictionnary<Howl>, private _gameContext: GameContext) {
		this._vehicleSounds = new Dictionnary<number>();
		const music = this._sounds.Get(this.GetMusic());
		music.volume(0.05);
		music.loop(true);
		music.play();

		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicle.bind(this));
			hq.OnFieldAdded.On(this.HandleFieldChanged.bind(this));
		});
	}

	private GetMusic(): string {
		if (this._gameContext.GetMapMode() === MapEnv.forest) {
			return AudioContent.forestMusic;
		} else if (this._gameContext.GetMapMode() === MapEnv.ice) {
			return AudioContent.iceMusic;
		} else if (this._gameContext.GetMapMode() === MapEnv.sand) {
			return AudioContent.sandMusic;
		}
	}

	private Play(def: string, volume: number = 1, loop: boolean = false): number {
		if (this._sounds.Exist(def)) {
			const sound = this._sounds.Get(def);
			sound.loop(loop);
			sound.volume(volume);
			return sound.play();
		}
		return -1;
	}

	public StartMusic(): void {
		const forestMusic = this._sounds.Get(this.GetMusic());
		forestMusic.volume(0.1);
		forestMusic.loop(true);
		this._music = forestMusic.play();
	}

	public PauseAll(): void {
		this._sounds.Get(this.GetMusic()).pause(this._music);
		this._vehicleSounds.Values().forEach((vehicleSound) => {
			this._sounds.Get(AudioContent.tankMoving).pause(vehicleSound);
		});
	}

	public PlayAll(): void {
		this._sounds.Get(this.GetMusic()).play(this._music);
		this._vehicleSounds.Values().forEach((vehicleSound) => {
			this._sounds.Get(AudioContent.tankMoving).play(vehicleSound);
		});
	}

	public StopAll(): void {
		this._sounds.Get(this.GetMusic()).stop(this._music);
		this._vehicleSounds.Values().forEach((vehicleSound) => {
			this._sounds.Get(AudioContent.tankMoving).stop(vehicleSound);
		});
		this._sounds.Clear();
		this._vehicleSounds.Clear();
	}

	private HandleVehicle(src: Headquarter, vehicule: Vehicle): void {
		if (vehicule instanceof Tank) {
			const t = vehicule as Tank;
			t.OnMissileLaunched.On(this.HandleMissile.bind(this));
		}

		vehicule.OnNextCellChanged.On(this.HandleMusic.bind(this));
		vehicule.OnStopping.On(this.HandleStop.bind(this));
		vehicule.OnDestroyed.On(this.HandleDestroyed.bind(this));

		if (vehicule.GetCurrentCell().IsVisible()) {
			this.Play(AudioContent.unitPopup, 0.2);
		}
	}

	private HandleMissile(src: any, missible: Missile): void {
		const v = src as Turrel;
		if (v.Base.GetCurrentCell().IsVisible()) {
			this.Play(AudioContent.shot3, 0.5);
		}
		missible.OnDestroyed.On(this.HandleDestroyedMissile.bind(this));
	}

	private HandleDestroyedMissile(src: any, missible: Missile): void {
		if (missible.Target.GetCurrentCell().IsVisible()) {
			this.Play(AudioContent.explosion, 0.5);
		}
	}

	private HandleMusic(src: any, cell: Cell): void {
		const v = src as Vehicle;
		if (v.GetCurrentCell().IsVisible()) {
			if (!this._vehicleSounds.Exist(v.Id)) {
				const soundId = this.Play(AudioContent.tankMoving, 0.3);
				this._sounds.Get(AudioContent.tankMoving).loop(true, soundId);
				this._vehicleSounds.Add(v.Id, soundId);
			}
		}
	}

	private HandleDestroyed(src: any, cell: Cell): void {
		const vehicle = src as Vehicle;
		this.StopEngine(vehicle);
		this.Play(AudioContent.death2, 1);
	}

	private HandleStop(src: any, cell: Cell): void {
		const vehicle = src as Vehicle;
		this.StopEngine(vehicle);
	}

	private StopEngine(vehicle: Vehicle) {
		if (this._sounds.Exist(AudioContent.tankMoving)) {
			this._sounds.Get(AudioContent.tankMoving).stop(this._vehicleSounds.Get(vehicle.Id));
			this._vehicleSounds.Remove(vehicle.Id);
		}
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		if (cell.IsVisible()) {
			this.Play(AudioContent.unitPopup, 0.2);
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this.Play(AudioContent.selection, 0.2);
	}
}
