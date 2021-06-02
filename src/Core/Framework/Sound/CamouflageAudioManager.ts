import { IGameAudioManager } from './IGameAudioManager';
import { IBlueprint } from './../../Setup/Blueprint/IBlueprint';
import { IGameContext } from './../../Setup/Context/IGameContext';
import { IOrder } from '../../Ia/Order/IOrder';
import { Factory, FactoryKey } from '../../../Factory';
import { MapEnv } from '../../Setup/Blueprint/MapEnv';
import { Missile } from '../../Items/Unit/Missile';
import { Tank } from '../../Items/Unit/Tank';
import { AudioArchive } from '../AudioArchiver';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Turrel } from '../../Items/Unit/Turrel';
import { IAudioService } from '../../../Services/Audio/IAudioService';

export class CamouflageAudioManager implements IGameAudioManager {
	private _soundService: IAudioService;
	private _audioId: number;

	constructor(private _mapContext: IBlueprint, private _vehicles: Vehicle[], private _gameContext: IGameContext) {
		this._soundService = Factory.Load<IAudioService>(FactoryKey.Audio);
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._vehicles.forEach((v) => {
			this.HandleVehicle(null, v);
		});
	}
	PlayMusic(): void {
		this._soundService.Play(this.GetMusic(), 0.01, true);
	}

	private GetMusic(): string {
		if (this._mapContext.MapMode === MapEnv.forest) {
			return AudioArchive.forestMusic;
		} else if (this._mapContext.MapMode === MapEnv.ice) {
			return AudioArchive.iceMusic;
		} else if (this._mapContext.MapMode === MapEnv.sand) {
			return AudioArchive.sandMusic;
		}
	}

	private Play(def: string, volume: number = 1, loop: boolean = false): number | null {
		if (this._soundService.Exist(def)) {
			return this._soundService.Play(def, volume, loop);
		}
		return null;
	}

	public PauseAll(): void {
		this._soundService.Pause(this.GetMusic(), this._audioId);
	}

	public PlayAll(): void {
		this._soundService.PlayAgain(this.GetMusic(), this._audioId, 0.01);
	}

	public StopAll(): void {
		this._soundService.Stop(this.GetMusic(), this._audioId);
		this._soundService.Clear();
	}

	private HandleOverlock(s: any, kind: string): void {
		this.Play(AudioArchive.powerUp, 0.05);
	}

	private HandleVehicle(src: Headquarter, vehicule: Vehicle): void {
		if (vehicule instanceof Tank) {
			const t = vehicule as Tank;
			t.OnMissileLaunched.On(this.HandleMissile.bind(this));
		}

		vehicule.OnOrderChanging.On(this.HandleOrder.bind(this));

		if (vehicule.GetCurrentCell().IsVisible()) {
			this.Play(AudioArchive.unitPopup, 0.2);
		}
	}
	HandleOrder(src: Vehicle, order: IOrder): void {
		const playerHq = this._gameContext.GetPlayer();
		if (playerHq) {
			if (!src.IsEnemy(playerHq.Identity)) {
				const voices = [
					AudioArchive.ayaya,
					AudioArchive.copyThat,
					AudioArchive.engage,
					AudioArchive.fireAtWills,
					AudioArchive.sirYesSir,
					AudioArchive.allClear,
					AudioArchive.moveOut,
					AudioArchive.understood,
					AudioArchive.transmissionReceived
				];
				if (src.GetCurrentCell().IsVisible()) {
					var index = Math.round(Math.random() * (voices.length - 1));
					this.Play(voices[index], 0.05);
				}
			}
		}
	}

	private HandleMissile(src: any, missible: Missile): void {
		const v = src as Turrel;
		if (v.Base.GetCurrentCell().IsVisible()) {
			this.Play(AudioArchive.shot3, 0.5);
		}
		missible.OnDestroyed.On(this.HandleDestroyedMissile.bind(this));
	}

	private HandleDestroyedMissile(src: any, missible: Missile): void {
		if (missible.Target.GetCurrentCell().IsVisible()) {
			this.Play(AudioArchive.explosion, 1);
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this.Play(AudioArchive.selection, 0.5);
	}
}
