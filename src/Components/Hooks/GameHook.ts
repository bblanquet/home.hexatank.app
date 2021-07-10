import { StateUpdater } from 'preact/hooks';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { ISelectable } from '../../Core/ISelectable';
import { Cell } from '../../Core/Items/Cell/Cell';
import { Item } from '../../Core/Items/Item';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IAppService } from '../../Services/App/IAppService';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { Singletons, SingletonKey } from '../../Singletons';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { Groups } from '../../Utils/Collections/Groups';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { Point } from '../../Utils/Geometry/Point';
import { Curve } from '../../Utils/Stats/Curve';
import { RuntimeState } from '../Model/RuntimeState';
import { Hook } from './Hook';

export class GameHook extends Hook<RuntimeState> {
	private _gameContextService: IGameContextService<GameBlueprint, GameContext>;
	private _soundService: IAudioService;
	private _onlineService: IOnlineService;
	private _interactionService: IInteractionService<GameContext>;
	private _appService: IAppService<GameBlueprint>;
	private _gameContext: GameContext;
	public Timeout: SimpleEvent = new SimpleEvent();
	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _handleRetry: any = this.Retry.bind(this);

	constructor(d: [RuntimeState, StateUpdater<RuntimeState>]) {
		super(d[0], d[1]);
		this.Init();
	}

	GetOnlineManager(): IOnlineService {
		return this._onlineService;
	}
	static DefaultState(): RuntimeState {
		const state = new RuntimeState();
		state.HasMenu = false;
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
		return state;
	}
	public Init(): void {
		this._gameContextService = Singletons.Load<IGameContextService<GameBlueprint, GameContext>>(
			SingletonKey.GameContext
		);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.Interaction);
		this._appService = Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App);
		this._gameContext = this._gameContextService.Publish();

		this.Timeout.On(() => {
			this.Stop(true);
		});
		this._soundService.Pause(AudioArchive.loungeMusic);
		const playerHq = this._gameContext.GetPlayerHq();
		playerHq.OnTruckChanged.On(this.HandleTruckChanged.bind(this));
		playerHq.OnTankRequestChanged.On(this.HandleTankChanged.bind(this));
		playerHq.OnDiamondCountChanged.On(this.HandleDiamondChanged.bind(this));
		playerHq.OnCashMissing.On(this.HandleCashMissing.bind(this));
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.OnPatrolSetting.On(this.HandleSettingPatrol.bind(this));
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._appService.OnRetried.On(this.Retry.bind(this));
		if (this._onlineService.GetOnlinePlayerManager()) {
			this._onlineService
				.GetOnlinePlayerManager()
				.OnPlayersChanged.On((src: any, ps: Dictionary<OnlinePlayer>) => {
					this.Update((e) => {
						e.IsSynchronising = ps.Values().some((p) => !p.IsSync());
					});
				});
		}
	}

	private Retry(): void {
		this.Unmount();
		this.Init();
		this.Update((state) => {
			state.HasMenu = false;
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
		});
	}

	public Unmount(): void {
		const playerHq = this._gameContext.GetPlayerHq();
		playerHq.OnTruckChanged.Clear();
		playerHq.OnTankRequestChanged.Clear();
		playerHq.OnDiamondCountChanged.Clear();
		playerHq.OnCashMissing.Clear();
		this._gameContext.OnItemSelected.Clear();
		this._gameContext.OnPatrolSetting.Clear();
		this._gameContext.State.OnGameStatusChanged.Clear();
		this._interactionService.OnMultiMenuShowed.Clear();
		this._appService.OnRetried.Off(this._handleRetry);
	}

	public GetMiddle(): Point {
		const player = this._gameContext.GetPlayer();
		return player.GetBoundingBox().GetCentralPoint();
	}

	public SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
	}

	private HandleMultiMenuShowed(src: any, isDisplayed: boolean): void {
		this.Update((e) => (e.IsSettingMenuVisible = isDisplayed));
	}

	private HandleTruckChanged(obj: any, request: number): void {
		this.Update((e) => (e.TruckRequestCount = request));
	}

	private HandleTankChanged(obj: any, request: number): void {
		this.Update((e) => (e.TankRequestCount = request));
	}

	private HandleDiamondChanged(obj: any, amount: number): void {
		this.Update((e) => (e.Amount = amount));
	}

	private HandleSelection(obj: any, selectedItem: Item): void {
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.Update((e) => (e.Item = selectedItem));
	}

	private HandleSettingPatrol(obj: any, value: boolean): void {
		this.Update((e) => (e.IsSettingPatrol = value));
	}

	private HandleCashMissing(obj: any, value: boolean): void {
		if (value !== this.State.HasWarning) {
			this.Update((e) => (e.HasWarning = value));
		}
	}

	private HandleGameStatus(obj: any, value: GameStatus): void {
		if (value !== this.State.GameStatus) {
			this.Update((e) => (e.GameStatus = value));
		}
	}

	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.Update((e) => (e.Item = null));
		}
	}

	public SetMenu(): void {
		const isSettingMenuVisible = !this.State.IsSettingMenuVisible;
		this.Update((e) => (e.IsSettingMenuVisible = isSettingMenuVisible));

		if (isSettingMenuVisible) {
			this._soundService.GetGameAudioManager().PauseAll();
		} else if (!this._soundService.IsMute()) {
			this._soundService.GetGameAudioManager().PlayAll();
		}

		if (!this._onlineService.IsOnline()) {
			this._gameContext.State.IsPause = isSettingMenuVisible;
		}
	}

	public Stop(isVictory: boolean): void {
		this._gameContext.State.IsPause = true;
		this.Update((e) => {
			e.IsSettingMenuVisible = false;
			e.GameStatus = isVictory ? GameStatus.Victory : GameStatus.Defeat;
		});
	}
	public GetCurves(): Groups<Curve> {
		return this._appService.GetStats().GetCurves();
	}
	public GetRecord(): JsonRecordContent {
		return this._appService.GetRecord().GetRecord();
	}

	public IsListeningCell(): boolean {
		return this._interactionService.GetMultiSelectionContext().IsListeningCell();
	}

	public IsCovered(): boolean {
		return this._gameContext.GetPlayerHq().IsCovered(this.State.Item as Cell);
	}

	public IsListeningVehicle(): boolean {
		return this._interactionService.GetMultiSelectionContext().IsListeningUnit();
	}

	public GetReactor(): number {
		return this._gameContext.GetPlayerHq().GetReactorsCount();
	}
	public GetVehicleCount(): number {
		return this._gameContext.GetPlayerHq().GetVehicleCount();
	}
}
