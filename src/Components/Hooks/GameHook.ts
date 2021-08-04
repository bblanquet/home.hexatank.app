import { StateUpdater } from 'preact/hooks';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { ISelectable } from '../../Core/ISelectable';
import { Cell } from '../../Core/Items/Cell/Cell';
import { Item } from '../../Core/Items/Item';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IBuilder } from '../../Services/Builder/IBuilder';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameworldService } from '../../Services/World/IGameworldService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import { Singletons, SingletonKey } from '../../Singletons';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { Groups } from '../../Utils/Collections/Groups';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { Point } from '../../Utils/Geometry/Point';
import { Curve } from '../../Utils/Stats/Curve';
import { RuntimeState } from '../Model/RuntimeState';
import { Hook } from './Hook';
import { Vibrator } from '../../Utils/Vibrator';
import { FieldProp } from '../Components/Canvas/FieldProp';
import { CellGroup } from '../../Core/Items/CellGroup';
import { IRecordContextService } from '../../Services/Record/IRecordContextService';
import { IStatsService } from '../../Services/Stats/IStatsService';

export class GameHook extends Hook<RuntimeState> {
	private _gameworldService: IGameworldService<GameBlueprint, Gameworld>;
	private _soundService: IAudioService;
	private _recordContextService: IRecordContextService;
	private _statsService: IStatsService;
	private _onlineService: IOnlineService;
	private _profilService: IPlayerProfilService;
	private _interactionService: IInteractionService<Gameworld>;
	private _appService: IBuilder<GameBlueprint>;
	private _gameworld: Gameworld;
	public Timeout: SimpleEvent = new SimpleEvent();
	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _handleRetry: any = this.Retry.bind(this);
	public OnRefresh: SimpleEvent = new SimpleEvent();
	public middle: Point;

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
		state.IsSynchronising = false;
		state.IsMultiMenuVisible = false;
		state.SelectionKind = SelectionKind.None;
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
	public Init(): void {
		this._gameworldService = Singletons.Load<IGameworldService<GameBlueprint, Gameworld>>(SingletonKey.Gameworld);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._interactionService = Singletons.Load<IInteractionService<Gameworld>>(SingletonKey.Interaction);
		this._appService = Singletons.Load<IBuilder<GameBlueprint>>(SingletonKey.GameBuilder);
		this._gameworld = this._gameworldService.Publish();

		this.Timeout.On(() => {
			this.Stop(true);
		});
		this._soundService.Pause(AudioLoader.GetAudio(AudioArchive.loungeMusic));
		const playerHq = this._gameworld.GetPlayerHq();
		playerHq.OnTruckChanged.On(this.HandleTruckChanged.bind(this));
		playerHq.OnTankRequestChanged.On(this.HandleTankChanged.bind(this));
		playerHq.OnDiamondCountChanged.On(this.HandleDiamondChanged.bind(this));
		playerHq.OnCashMissing.On(this.HandleCashMissing.bind(this));
		this._profilService.OnPointsAdded.On(this.HandlePoints.bind(this));
		this._gameworld.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameworld.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._interactionService.GetMultiSelectionContext().OnModeChanged.On(this.HandleMultiSelection.bind(this));
		this._appService.OnReloaded.On(this.Retry.bind(this));
		if (this._onlineService.GetOnlinePlayerManager()) {
			this._onlineService
				.GetOnlinePlayerManager()
				.OnPlayersChanged.On((src: any, ps: Dictionary<OnlinePlayer>) => {
					this.Update((e) => {
						e.IsSynchronising = ps.Values().some((p) => !p.IsSync());
					});
				});
		}
		const player = this._gameworld.GetPlayer();
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
		const playerHq = this._gameworld.GetPlayerHq();
		playerHq.OnTruckChanged.Clear();
		playerHq.OnTankRequestChanged.Clear();
		playerHq.OnDiamondCountChanged.Clear();
		playerHq.OnCashMissing.Clear();
		this._interactionService.GetMultiSelectionContext().OnModeChanged.Clear();
		this._gameworld.OnItemSelected.Clear();
		this._profilService.OnPointsAdded.Clear();
		this._gameworld.State.OnGameStatusChanged.Clear();
		this._interactionService.OnMultiMenuShowed.Clear();
		this._appService.OnReloaded.Off(this._handleRetry);
	}

	private HandlePoints(e: any, details: PointDetails): void {
		this.Update((e) => {
			e.StatusDetails = details;
		});
	}

	public GetCenter(): Point {
		return this.middle;
	}

	public SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
	}

	private HandleMultiMenuShowed(src: any, isDisplayed: boolean): void {
		this.Update((e) => (e.IsSettingMenuVisible = isDisplayed));
	}

	private HandleMultiSelection(src: any, kind: SelectionKind): void {
		this.Update((e) => (e.SelectionKind = kind));
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
		Vibrator.Vibrate();
		this.Update((e) => (e.Item = selectedItem));
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
			this._gameworld.State.SetPause(isSettingMenuVisible);
		}
	}

	public Stop(isVictory: boolean): void {
		this._gameworld.State.SetPause(true);
		this._gameworld.SetStatus(isVictory ? GameStatus.Victory : GameStatus.Defeat);
	}

	public GetCurves(): Groups<Curve> {
		return this._statsService.Get().GetCurves();
	}
	public GetRecord(): JsonRecordContent {
		return this._recordContextService.Publish().GetRecord();
	}

	public IsCovered(): boolean {
		return this._gameworld.GetPlayerHq().IsCovered(this.State.Item as Cell);
	}

	public GetReactor(): number {
		return this._gameworld.GetPlayerHq().GetReactorsCount();
	}
	public GetVehicleCount(): number {
		return this._gameworld.GetPlayerHq().GetVehicleCount();
	}

	GetFields(): FieldProp[] {
		if (this.State.Item instanceof Cell) {
			const cell = this.State.Item;
			const hq = this._gameworld.GetPlayerHq();
			if (hq.IsCovered(cell)) {
				return FieldProp.All(hq, (e: Item) => {
					this.SendContext(e);
				});
			} else {
				return FieldProp.OnlyReactor(hq, (e: Item) => {
					this.SendContext(e);
				});
			}
		} else if (this.State.Item instanceof CellGroup) {
			return FieldProp.AllExceptReactor((e: Item) => {
				this.SendContext(e);
			});
		}
	}
}
