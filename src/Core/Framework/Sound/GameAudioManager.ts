import { GameBlueprint } from '../../Setup/Blueprint/Game/GameBlueprint';
import { IOrder } from '../../Ia/Order/IOrder';
import { Factory, FactoryKey } from '../../../Factory';
import { MapEnv } from '../../Setup/Blueprint/MapEnv';
import { Missile } from '../../Items/Unit/Missile';
import { Tank } from '../../Items/Unit/Tank';
import { GameContext } from '../../Setup/Context/GameContext';
import { AudioContent } from '../AudioArchiver';
import { Cell } from '../../Items/Cell/Cell';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Item } from '../../Items/Item';
import { Turrel } from '../../Items/Unit/Turrel';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { IAudioService } from '../../../Services/Audio/IAudioService';

export class GameAudioManager {
	private _soundService: IAudioService;
	private _music: number;

	constructor(private _mapContext: GameBlueprint, private _gameContext: GameContext) {
		this._soundService = Factory.Load<IAudioService>(FactoryKey.Audio);

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

	public StartMusic(): void {
		this._soundService.Play(this.GetMusic(), 0.01, true);
	}

	private GetMusic(): string {
		if (this._mapContext.MapMode === MapEnv.forest) {
			return AudioContent.forestMusic;
		} else if (this._mapContext.MapMode === MapEnv.ice) {
			return AudioContent.iceMusic;
		} else if (this._mapContext.MapMode === MapEnv.sand) {
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
	}

	public PlayAll(): void {
		this._soundService.PlayAgain(this.GetMusic(), this._music, 0.01);
	}

	public StopAll(): void {
		this._soundService.Stop(this.GetMusic(), this._music);
		this._soundService.Clear();
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

		vehicule.OnOrderChanging.On(this.HandleOrder.bind(this));

		if (vehicule.GetCurrentCell().IsVisible()) {
			this.Play(AudioContent.unitPopup, 0.2);
		}
	}
	HandleOrder(src: Vehicle, order: IOrder): void {
		const playerHq = this._gameContext.GetPlayerHq();
		if (playerHq) {
			if (!src.IsEnemy(playerHq.Identity)) {
				const voices = [
					AudioContent.ayaya,
					AudioContent.copyThat,
					AudioContent.engage,
					AudioContent.fireAtWills,
					AudioContent.sirYesSir,
					AudioContent.allClear,
					AudioContent.moveOut,
					AudioContent.understood,
					AudioContent.transmissionReceived
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
			this.Play(AudioContent.shot3, 0.5);
		}
		missible.OnDestroyed.On(this.HandleDestroyedMissile.bind(this));
	}

	private HandleDestroyedMissile(src: any, missible: Missile): void {
		if (missible.Target.GetCurrentCell().IsVisible()) {
			this.Play(AudioContent.explosion, 1);
		}
	}

	private HandleFieldChanged(src: any, cell: Cell): void {
		if (cell.IsVisible()) {
			this.Play(AudioContent.construction, 0.1);
		}
	}

	private HandleSelection(src: any, vehicule: Item): void {
		this.Play(AudioContent.selection, 0.5);
	}
}
