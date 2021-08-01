import { Hook } from './Hook';
import { Singletons, SingletonKey } from '../../Singletons';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
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
import { FireContext } from '../../Core/Framework/Context/FireContext';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { Cell } from '../../Core/Items/Cell/Cell';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';
import { Vibrator } from '../../Utils/Vibrator';

export class FireHook extends Hook<RuntimeState> {
	private _gameContextService: IGameContextService<FireBlueprint, FireContext>;
	private _profilService: IPlayerProfilService;
	private _soundService: IAudioService;
	private _interactionService: IInteractionService<FireContext>;
	private _gameContext: FireContext;
	private _keyService: IKeyService;
	private _appService: IAppService<CamouflageBlueprint>;
	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _handleRetry: any = this.Retry.bind(this);
	public OnRefresh: SimpleEvent = new SimpleEvent();
	public middle: Point;

	constructor(d: [RuntimeState, StateUpdater<RuntimeState>]) {
		super(d[0], d[1]);
		this.Init();
	}

	static DefaultState(): RuntimeState {
		const state = new RuntimeState();
		state.HasMenu = false;
		state.IsSettingMenuVisible = false;
		state.SelectionKind = SelectionKind.None;
		state.IsSettingPatrol = false;
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

	private Init() {
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService<CamouflageBlueprint>>(this._keyService.GetAppKey());
		this._gameContextService = Singletons.Load<IGameContextService<FireBlueprint, FireContext>>(
			SingletonKey.FireGameContext
		);
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<FireContext>>(SingletonKey.Interaction);
		this._gameContext = this._gameContextService.Publish();
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._soundService.Pause(AudioLoader.GetAudio(AudioArchive.loungeMusic));
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._profilService.OnPointsAdded.On(this.HandlePoints.bind(this));
		this._gameContext.OnPatrolSetting.On(this.HandleSettingPatrol.bind(this));
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._interactionService.GetMultiSelectionContext().OnModeChanged.On(this.HandleMultiSelection.bind(this));
		this._appService.OnRefresh.On(this._handleRetry);
		const player = this._gameContext.GetPlayer();
		this.middle = player.GetBoundingBox().GetCentralPoint();
		this.OnRefresh.Invoke();
	}

	private Retry(): void {
		this.Unmount();
		this.Init();
		this.Update((state) => {
			state.HasMenu = false;
			state.SelectionKind = SelectionKind.None;
			state.IsSettingMenuVisible = false;
			state.IsSettingPatrol = false;
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
		this._interactionService.GetMultiSelectionContext().OnModeChanged.Clear();
		this._gameContext.State.OnGameStatusChanged.Clear();
		this._profilService.OnPointsAdded.Clear();
		this._interactionService.OnMultiMenuShowed.Clear();
		this._appService.OnRefresh.Off(this._handleRetry);
	}

	private HandlePoints(e: any, details: PointDetails): void {
		this.Update((e) => {
			e.StatusDetails = details;
		});
	}

	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.Update((e) => (e.Item = null));
		}
	}

	private HandleMultiSelection(src: any, kind: SelectionKind): void {
		this.Update((e) => (e.SelectionKind = kind));
	}

	private HandleMultiMenuShowed(src: any, isDisplayed: boolean): void {
		this.Update((e) => (e.HasMultiMenu = isDisplayed));
	}

	private HandleSelection(obj: any, selectedItem: Item): void {
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		Vibrator.Vibrate();
		this.Update((e) => (e.Item = selectedItem));
	}

	private HandleSettingPatrol(obj: any, isSettingPatrol: boolean): void {
		this.Update((e) => (e.IsSettingPatrol = isSettingPatrol));
	}

	private HandleGameStatus(obj: any, gs: GameStatus): void {
		if (gs !== this.State.GameStatus) {
			this.Update((e) => (e.GameStatus = gs));
		}
	}

	public GetCenter(): Point {
		return this.middle;
	}

	public SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
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

	public IsCovered(): boolean {
		return this._gameContext.GetPlayerHq().IsCovered(this.State.Item as Cell);
	}

	public GetReactor(): number {
		return this._gameContext.GetPlayerHq().GetReactorsCount();
	}
	public GetVehicleCount(): number {
		return this._gameContext.GetPlayerHq().GetVehicleCount();
	}

	public Stop(isVictory: boolean): void {
		this._gameContext.SetStatus(isVictory ? GameStatus.Victory : GameStatus.Defeat);
	}
}
