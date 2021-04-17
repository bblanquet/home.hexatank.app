import { IOrder } from './../../Ia/Order/IOrder';
import { Factory, FactoryKey } from './../../../Factory';
import { ISoundService } from './../../../Services/Sound/ISoundService';
import { MapEnv } from './../../Setup/Generator/MapEnv';
import { Missile } from '../../Items/Unit/Missile';
import { Tank } from '../../Items/Unit/Tank';
import { GameContext } from '../GameContext';
import { AudioContent } from '../AudioArchiver';
import { Cell } from '../../Items/Cell/Cell';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { Turrel } from '../../Items/Unit/Turrel';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';

export class GameSoundManager {
	private _soundService: ISoundService;
	private _vehicleSounds: Dictionnary<number>;
	private _music: number;

	constructor(private _gameContext: GameContext) {
		this._vehicleSounds = new Dictionnary<number>();
		this._soundService = Factory.Load<ISoundService>(FactoryKey.Sound);

		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		const hq = this._gameContext.GetMainHq();
		hq.OnNewReactor.On(this.HandleReactor.bind(this));
		hq.OnCashMissing.On(this.HandleMissingCash.bind(this));
		this._gameContext.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicle.bind(this));
			hq.OnFieldAdded.On(this.HandleFieldChanged.bind(this));
		});
	}

	public StartMusic(): void {
		this._soundService.Play(this.GetMusic(), 0.01, true);
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

	private Play(def: string, volume: number = 1, loop: boolean = false): number | null {
		if (this._soundService.Exist(def)) {
			return this._soundService.Play(def, volume, loop);
		}
		return null;
	}

	public PauseAll(): void {
		this._soundService.Pause(this.GetMusic(), this._music);
		this._vehicleSounds.Values().forEach((vehicleSound) => {
			this._soundService.Pause(AudioContent.tankMoving, vehicleSound);
		});
	}

	public PlayAll(): void {
		this._soundService.PlayAgain(this.GetMusic(), this._music, 0.01);
		this._vehicleSounds.Values().forEach((vehicleSound) => {
			this._soundService.PlayAgain(AudioContent.tankMoving, vehicleSound);
		});
	}

	public StopAll(): void {
		this._soundService.Stop(this.GetMusic(), this._music);
		this._vehicleSounds.Values().forEach((vehicleSound) => {
			this._soundService.Stop(AudioContent.tankMoving, vehicleSound);
		});
		this._soundService.Clear();
		this._vehicleSounds.Clear();
	}

	private HandleMissingCash(src: any, r: ReactorField): void {
		this.Play(AudioContent.noMoney, 0.06);
	}

	private HandleReactor(src: any, r: ReactorField): void {
		r.OnOverlocked.On(this.HandleOverlock.bind(this));
	}

	private HandleOverlock(s: any, kind: string): void {
		this.Play(AudioContent.powerUp, 0.05);
	}

	private HandleVehicle(src: Headquarter, vehicule: Vehicle): void {
		if (vehicule instanceof Tank) {
			const t = vehicule as Tank;
			t.OnMissileLaunched.On(this.HandleMissile.bind(this));
		}

		vehicule.OnNextCellChanged.On(this.HandleMusic.bind(this));
		vehicule.OnNextCellChanged.On(this.HandleMusic.bind(this));
		vehicule.OnOrderChanging.On(this.HandleOrder.bind(this));

		vehicule.OnTranslateStarted.On(this.HandleMusic.bind(this));
		vehicule.OnTranslateStopped.On(this.HandleStop.bind(this));
		vehicule.OnDestroyed.On(this.HandleDestroyed.bind(this));

		if (vehicule.GetCurrentCell().IsVisible()) {
			this.Play(AudioContent.unitPopup, 0.2);
		}
	}
	HandleOrder(src: Vehicle, order: IOrder): void {
		const voices = [
			AudioContent.ayaya,
			AudioContent.copyThat,
			AudioContent.engage,
			AudioContent.fireAtWills,
			AudioContent.sirYesSir,
			AudioContent.transmissionReceived
		];
		if (src.GetCurrentCell().IsVisible()) {
			var index = Math.round(Math.random() * (voices.length - 1));
			this.Play(voices[index], 0.05);
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
			this.Play(AudioContent.explosion, 1);
		}
	}

	private HandleMusic(src: any, cell: Cell): void {
		const v = src as Vehicle;
		if (v.GetCurrentCell().IsVisible()) {
			if (!this._vehicleSounds.Exist(v.Id)) {
				const soundId = this.Play(AudioContent.tankMoving, 0.075, true);
				this._vehicleSounds.Add(v.Id, soundId);
			}
		}
	}

	private HandleDestroyed(src: any, cell: Cell): void {
		const vehicle = src as Vehicle;
		this.StopEngine(vehicle);
		this.Play(AudioContent.death2, 0.5);
	}

	private HandleStop(src: any, cell: Cell): void {
		const vehicle = src as Vehicle;
		this.StopEngine(vehicle);
	}

	private StopEngine(vehicle: Vehicle) {
		if (this._soundService.Exist(AudioContent.tankMoving)) {
			this._soundService.Stop(AudioContent.tankMoving, this._vehicleSounds.Get(vehicle.Id));
			this._vehicleSounds.Remove(vehicle.Id);
		}
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		if (cell.IsVisible()) {
			this.Play(AudioContent.construction, 0.1);
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this.Play(AudioContent.selection, 0.2);
	}
}
