import { CamouflageContext } from '../../Framework/Context/CamouflageContext';
import { IGameAudioManager } from './IGameAudioManager';
import { IBlueprint } from '../../Framework/Blueprint/IBlueprint';
import { IOrder } from '../../Ia/Order/IOrder';
import { Singletons, SingletonKey } from '../../../Singletons';
import { MapKind } from '../Blueprint/Items/MapKind';
import { Missile } from '../../Items/Unit/Missile';
import { Tank } from '../../Items/Unit/Tank';
import { AudioArchive } from '../AudioArchiver';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Turrel } from '../../Items/Unit/Turrel';
import { IAudioService } from '../../../Services/Audio/IAudioService';
import { Relationship } from '../../Items/Identity';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { AudioLoader } from '../AudioLoader';

export class CamouflageAudioManager implements IGameAudioManager {
	private _soundService: IAudioService;
	private _audioId: number;
	private _lastPlayed: Dictionary<number> = new Dictionary<number>();

	constructor(private _mapContext: IBlueprint, private _gameContext: CamouflageContext) {
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.GetVehicles().forEach((v) => {
			this.HandleVehicle(null, v);
		});
	}
	PlayMusic(): void {
		this._soundService.Play(this.GetMusic(), 0.01, true);
	}

	private GetMusic(): string {
		if (this._mapContext.MapMode === MapKind.Forest) {
			return AudioLoader.GetAudio(AudioArchive.forestMusic);
		} else if (this._mapContext.MapMode === MapKind.Ice) {
			return AudioLoader.GetAudio(AudioArchive.iceMusic);
		} else if (this._mapContext.MapMode === MapKind.Sand) {
			return AudioLoader.GetAudio(AudioArchive.sandMusic);
		}
	}

	private Play(def: string, volume: number = 1, loop: boolean = false): number | null {
		const dateNow = Date.now();
		if (this._lastPlayed.Exist(def) && this._lastPlayed.Get(def) < dateNow - 500) {
			this._lastPlayed.Add(def, dateNow);
			return this._soundService.Play(def, volume, loop);
		} else if (!this._lastPlayed.Exist(def)) {
			this._lastPlayed.Add(def, dateNow);
			return this._soundService.Play(def, volume, loop);
		}
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

	private HandleVehicle(src: Headquarter, vehicule: Vehicle): void {
		if (vehicule instanceof Tank) {
			const t = vehicule as Tank;
			t.OnMissileLaunched.On(this.HandleMissile.bind(this));
		}

		vehicule.OnOrdering.On(this.HandleOrder.bind(this));

		if (vehicule.GetCurrentCell().IsVisible()) {
			this.Play(AudioArchive.unitPopup, 0.2);
		}
	}
	HandleOrder(src: Vehicle, order: IOrder): void {
		const playerHq = this._gameContext.GetPlayer();
		if (playerHq) {
			if (src.GetRelation(playerHq.Identity) === Relationship.Ally) {
				const voices = [
					AudioLoader.GetAudio(AudioArchive.ayaya),
					AudioLoader.GetAudio(AudioArchive.copyThat),
					AudioLoader.GetAudio(AudioArchive.engage),
					AudioLoader.GetAudio(AudioArchive.fireAtWills),
					AudioLoader.GetAudio(AudioArchive.sirYesSir),
					AudioLoader.GetAudio(AudioArchive.allClear),
					AudioLoader.GetAudio(AudioArchive.moveOut),
					AudioLoader.GetAudio(AudioArchive.understood),
					AudioLoader.GetAudio(AudioArchive.transmissionReceived)
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
			this.Play(AudioLoader.GetAudio(AudioArchive.shot3), 0.5);
		}
		missible.OnDestroyed.On(this.HandleDestroyedMissile.bind(this));
	}

	private HandleDestroyedMissile(src: any, missible: Missile): void {
		if (missible.Target.GetCurrentCell().IsVisible()) {
			this.Play(AudioLoader.GetAudio(AudioArchive.explosion), 1);
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this.Play(AudioLoader.GetAudio(AudioArchive.selection), 0.5);
	}
}
