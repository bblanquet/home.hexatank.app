import { IGameAudioManager } from './IGameAudioManager';
import { IOrder } from '../../Ia/Order/IOrder';
import { Singletons, SingletonKey } from '../../../Singletons';
import { MapKind } from '../Blueprint/Items/MapKind';
import { Missile } from '../../Items/Unit/Missile';
import { Tank } from '../../Items/Unit/Tank';
import { AudioArchive } from '../AudioArchiver';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Turrel } from '../../Items/Unit/Turrel';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { IAudioService } from '../../../Services/Audio/IAudioService';
import { Relationship } from '../../Items/Identity';
import { IHqGameworld } from '../World/IHqGameworld';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { AudioLoader } from '../AudioLoader';

export class GameAudioManager implements IGameAudioManager {
	private _soundService: IAudioService;
	private _audioId: number;
	private _lastPlayed: Dictionary<number> = new Dictionary<number>();

	constructor(private _mapKind: MapKind, private _world: IHqGameworld) {
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);

		this._world.OnItemSelected.On(this.HandleSelection.bind(this));
		const playerHq = this._world.GetPlayerHq();
		if (playerHq) {
			playerHq.OnReactorAdded.On(this.HandleReactor.bind(this));
			playerHq.OnCashMissing.On(this.HandleMissingCash.bind(this));
		}
		this._world.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicle.bind(this));
			hq.OnFieldAdded.On(this.HandleFieldChanged.bind(this));
			hq.GetVehicles().forEach((v) => {
				this.HandleVehicle(hq, v);
			});
		});
	}

	public PlayMusic(): void {
		this._soundService.Play(this.GetMusic(), 0.01, true);
	}

	private GetMusic(): string {
		if (this._mapKind === MapKind.Forest) {
			return AudioLoader.GetAudio(AudioArchive.forestMusic);
		} else if (this._mapKind === MapKind.Ice) {
			return AudioLoader.GetAudio(AudioArchive.iceMusic);
		} else if (this._mapKind === MapKind.Sand) {
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

	private HandleMissingCash(src: any, r: ReactorField): void {
		this.Play(AudioLoader.GetAudio(AudioArchive.noMoney), 0.06);
	}

	private HandleReactor(src: any, r: ReactorField): void {
		r.OnOverlocked.On(this.HandleOverlock.bind(this));
	}

	private HandleOverlock(s: any, kind: string): void {
		this.Play(AudioLoader.GetAudio(AudioArchive.powerUp), 0.05);
	}

	private HandleVehicle(src: IHeadquarter, vehicule: Vehicle): void {
		if (vehicule instanceof Tank) {
			const t = vehicule as Tank;
			t.OnMissileLaunched.On(this.HandleMissile.bind(this));
		}

		vehicule.OnOrdering.On(this.HandleOrder.bind(this));
		vehicule.OnCamouflageChanged.On(this.HandleCamouflage.bind(this));

		if (vehicule.GetCurrentCell().IsVisible()) {
			this.Play(AudioLoader.GetAudio(AudioArchive.unitPopup), 0.2);
		}
	}

	HandleCamouflage(src: Vehicle, v: Vehicle): void {
		if (v.GetCurrentCell().IsVisible()) {
			this.Play(AudioLoader.GetAudio(AudioArchive.unitPopup), 0.2);
		}
	}

	HandleOrder(src: Vehicle, order: IOrder): void {
		const playerHq = this._world.GetPlayerHq();
		if (playerHq) {
			if (src.GetRelation(playerHq.Identity) === Relationship.Ally && src.IsSelected()) {
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

	private HandleFieldChanged(src: any, cell: Cell): void {
		if (cell.IsVisible()) {
			this.Play(AudioLoader.GetAudio(AudioArchive.construction), 0.1);
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this.Play(AudioLoader.GetAudio(AudioArchive.selection), 0.5);
	}
}
