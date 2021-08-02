import { Hook } from './Hook';
import { Singletons, SingletonKey } from '../../Singletons';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { CamouflageContext } from '../../Core/Framework/Context/CamouflageContext';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { ISelectable } from '../../Core/ISelectable';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { Item } from '../../Core/Items/Item';
import { RuntimeState } from '../Model/RuntimeState';
import { StateUpdater } from 'preact/hooks';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Point } from '../../Utils/Geometry/Point';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { IAppService } from '../../Services/App/IAppService';
import { IKeyService } from '../../Services/Key/IKeyService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { Vibrator } from '../../Utils/Vibrator';

export class CamouflageHook extends Hook<RuntimeState> {
	private _gameContextService: IGameContextService<CamouflageBlueprint, CamouflageContext>;
	private _appService: IAppService<CamouflageBlueprint>;
	private _profilService: IPlayerProfilService;
	private _soundService: IAudioService;
	private _keyService: IKeyService;
	private _interactionService: IInteractionService<CamouflageContext>;
	private _gameContext: CamouflageContext;
	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _handleRetry: any = this.Retry.bind(this);
	public OnRetried: SimpleEvent = new SimpleEvent();
	public middle: Point;

	constructor(d: [RuntimeState, StateUpdater<RuntimeState>]) {
		super(d[0], d[1]);
		this.Init();
	}

	private Init() {
		this._gameContextService = Singletons.Load<IGameContextService<CamouflageBlueprint, CamouflageContext>>(
			SingletonKey.CamouflageGameContext
		);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService<CamouflageBlueprint>>(this._keyService.GetAppKey());
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<CamouflageContext>>(
			SingletonKey.CamouflageInteraction
		);
		this._gameContext = this._gameContextService.Publish();

		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._profilService.OnPointsAdded.On(this.HandlePoints.bind(this));
		this._appService.OnRefresh.On(this._handleRetry);
		this._soundService.Pause(AudioLoader.GetAudio(AudioArchive.loungeMusic));
		const player = this._gameContext.GetPlayer();
		this.middle = player.GetBoundingBox().GetCentralPoint();
		this.OnRetried.Invoke();
	}

	private Retry(): void {
		this.Unmount();
		this.Init();
		this.Update((state) => {
			state.HasMenu = false;
			state.IsSettingMenuVisible = false;
			state.IsSynchronising = false;
			state.IsMultiMenuVisible = false;
			state.HasMultiMenu = false;
			state.HasWarning = false;
			state.TankRequestCount = 0;
			state.TruckRequestCount = 0;
			state.Amount = GameSettings.PocketMoney;
			state.Item = null;
			state.Players = [];
			state.GameStatus = GameStatus.Pending;
			state.StatusDetails = null;
		});
	}

	public Unmount(): void {
		this._gameContext.State.OnGameStatusChanged.Clear();
		this._gameContext.OnItemSelected.Clear();
		this._gameContext.OnPatrolSetting.Clear();
		this._gameContext.State.OnGameStatusChanged.Clear();
		this._interactionService.OnMultiMenuShowed.Clear();
		this._profilService.OnPointsAdded.Clear();
		this._appService.OnRefresh.Off(this._handleRetry);
	}

	public GetCenter(): Point {
		return this.middle;
	}

	static DefaultState(): RuntimeState {
		const state = new RuntimeState();
		state.HasMenu = false;
		state.IsSettingMenuVisible = false;
		state.IsSynchronising = false;
		state.IsMultiMenuVisible = false;
		state.HasMultiMenu = false;
		state.HasWarning = false;
		state.TankRequestCount = 0;
		state.TruckRequestCount = 0;
		state.Amount = GameSettings.PocketMoney;
		state.Item = null;
		state.Players = [];
		state.GameStatus = GameStatus.Pending;
		state.StatusDetails = null;

		return state;
	}

	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.Update((e) => (e.Item = null));
		}
	}

	private HandlePoints(e: any, details: PointDetails): void {
		this.Update((e) => {
			e.StatusDetails = details;
		});
	}

	private HandleMultiMenuShowed(src: any, isDisplayed: boolean): void {
		this.Update((e) => (e.HasMultiMenu = isDisplayed));
	}

	private HandleSelection(obj: any, selectedItem: Item): void {
		Vibrator.Vibrate();
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.Update((e) => (e.Item = selectedItem));
	}

	private HandleGameStatus(obj: any, gs: GameStatus): void {
		if (gs !== this.State.GameStatus) {
			this.Update((e) => (e.GameStatus = gs));
		}
	}

	public Stop(isVictory: boolean): void {
		this._gameContext.SetStatus(isVictory ? GameStatus.Victory : GameStatus.Defeat);
	}

	public SetMenu(): void {
		const hasMenu = !this.State.HasMenu;
		this.Update((e) => (e.HasMenu = hasMenu));

		if (this._soundService.GetGameAudioManager()) {
			if (hasMenu) {
				this._soundService.GetGameAudioManager().PauseAll();
			} else if (!this._soundService.IsMute()) {
				this._soundService.GetGameAudioManager().PlayAll();
			}
		}

		this._gameContext.State.IsPause = hasMenu;
	}

	public SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		return interaction.OnSelect(item);
	}
}
