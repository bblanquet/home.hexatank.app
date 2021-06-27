import { IGameAudioManager } from './IGameAudioManager';
import { GameBlueprint } from '../../Framework/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../Framework/Context/GameContext';
import { IOrder } from '../../Ia/Order/IOrder';
import { Singletons, SingletonKey } from '../../../Singletons';
import { MapKind } from '../Blueprint/Items/MapKind';
import { Missile } from '../../Items/Unit/Missile';
import { Tank } from '../../Items/Unit/Tank';
import { AudioArchive } from '../AudioArchiver';
import { Cell } from '../../Items/Cell/Cell';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Turrel } from '../../Items/Unit/Turrel';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { IAudioService } from '../../../Services/Audio/IAudioService';
import { Relationship } from '../../Items/Identity';

export class GameAudioManager implements IGameAudioManager {
	private _soundService: IAudioService;
	private _audioId: number;

	constructor(private _mapContext: GameBlueprint, private _gameContext: GameContext) {
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);

		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		const playerHq = this._gameContext.GetPlayerHq();
		if (playerHq) {
			playerHq.OnReactorAdded.On(this.HandleReactor.bind(this));
			playerHq.OnCashMissing.On(this.HandleMissingCash.bind(this));
		}
		this._gameContext.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicle.bind(this));
			hq.OnFieldAdded.On(this.HandleFieldChanged.bind(this));
		});
	}

	public PlayMusic(): void {
		this._soundService.Play(this.GetMusic(), 0.01, true);
	}

	private GetMusic(): string {
		if (this._mapContext.MapMode === MapKind.forest) {
			return AudioArchive.forestMusic;
		} else if (this._mapContext.MapMode === MapKind.ice) {
			return AudioArchive.iceMusic;
		} else if (this._mapContext.MapMode === MapKind.sand) {
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

	private HandleMissingCash(src: any, r: ReactorField): void {
		this.Play(AudioArchive.noMoney, 0.06);
	}

	private HandleReactor(src: any, r: ReactorField): void {
		r.OnOverlocked.On(this.HandleOverlock.bind(this));
	}

	private HandleOverlock(s: any, kind: string): void {
		this.Play(AudioArchive.powerUp, 0.05);
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
		const playerHq = this._gameContext.GetPlayerHq();
		if (playerHq) {
			if (src.GetRelation(playerHq.Identity) === Relationship.Ally) {
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

	private HandleFieldChanged(src: any, cell: Cell): void {
		if (cell.IsVisible()) {
			this.Play(AudioArchive.construction, 0.1);
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this.Play(AudioArchive.selection, 0.5);
	}
}
