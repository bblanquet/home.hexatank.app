import { RuntimeState } from '../Model/RuntimeState';
import { Hook } from './Hook';
import { IAppService } from '../../Services/App/IAppService';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../Singletons';
import { Point } from '../../Utils/Geometry/Point';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { ISelectable } from '../../Core/ISelectable';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from '../../Core/Framework/Context/DiamondContext';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { Item } from '../../Core/Items/Item';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { StateUpdater } from 'preact/hooks';
import { Cell } from '../../Core/Items/Cell/Cell';
import { IKeyService } from '../../Services/Key/IKeyService';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';
import { Vibrator } from '../../Utils/Vibrator';
import { FieldProp } from '../Components/Canvas/FieldProp';
import { CellGroup } from '../../Core/Items/CellGroup';

export class DiamondHook extends Hook<RuntimeState> {
	private _gameContextService: IGameContextService<DiamondBlueprint, DiamondContext>;
	private _soundService: IAudioService;
	private _profilService: IPlayerProfilService;
	private _interactionService: IInteractionService<GameContext>;
	private _appService: IAppService<DiamondBlueprint>;
	private _keyService: IKeyService;
	private _gameContext: DiamondContext;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
	private _handleRetry: any = this.Retry.bind(this);
	public OnRefresh: SimpleEvent = new SimpleEvent();
	public middle: Point;

	constructor(d: [RuntimeState, StateUpdater<RuntimeState>]) {
		super(d[0], d[1]);
		this.Init();
	}

	public Unmount(): void {
		const playerHq = this._gameContext.GetPlayerHq();
		playerHq.OnTruckChanged.Clear();
		playerHq.OnTankRequestChanged.Clear();
		this._profilService.OnPointsAdded.Clear();
		playerHq.OnDiamondCountChanged.Clear();
		playerHq.OnCashMissing.Clear();
		this._gameContext.OnItemSelected.Clear();
		this._interactionService.GetMultiSelectionContext().OnModeChanged.Clear();
		this._gameContext.State.OnGameStatusChanged.Clear();
		this._interactionService.OnMultiMenuShowed.Clear();
		this._appService.OnRefresh.Off(this._handleRetry);
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
			state.SelectionKind = SelectionKind.None;
			state.Amount = GameSettings.PocketMoney;
			state.Item = null;
			state.Players = [];
			state.GameStatus = GameStatus.Pending;
			state.StatusDetails = null;
		});
	}

	public Init(): void {
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService<DiamondBlueprint>>(this._keyService.GetAppKey());
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._gameContextService = Singletons.Load<IGameContextService<DiamondBlueprint, DiamondContext>>(
			SingletonKey.DiamondGameContext
		);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.Interaction);
		this._gameContext = this._gameContextService.Publish();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		const playerHq = this._gameContext.GetPlayerHq();
		playerHq.OnTruckChanged.On(this.HandleTruckChanged.bind(this));
		playerHq.OnTankRequestChanged.On(this.HandleTankChanged.bind(this));
		playerHq.OnDiamondCountChanged.On(this.HandleDiamondChanged.bind(this));
		playerHq.OnCashMissing.On(this.HandleCashMissing.bind(this));
		this._profilService.OnPointsAdded.On(this.HandlePoints.bind(this));
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._interactionService.GetMultiSelectionContext().OnModeChanged.On(this.HandleMultiSelection.bind(this));
		this._appService.OnRefresh.On(this._handleRetry);
		this._soundService.Pause(AudioLoader.GetAudio(AudioArchive.loungeMusic));
		const player = this._gameContext.GetPlayer();
		this.middle = player.GetBoundingBox().GetCentralPoint();
		this.OnRefresh.Invoke();
	}

	private HandlePoints(e: any, details: PointDetails): void {
		this.Update((e) => {
			e.StatusDetails = details;
		});
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
		state.SelectionKind = SelectionKind.None;
		state.StatusDetails = null;
		return state;
	}

	public Stop(isVictory: boolean): void {
		this._gameContext.SetStatus(isVictory ? GameStatus.Victory : GameStatus.Defeat);
	}

	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.Update((e) => (e.Item = null));
		}
	}

	private HandleMultiMenuShowed(src: any, isDisplayed: boolean): void {
		this.Update((e) => (e.HasMultiMenu = isDisplayed));
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
		Vibrator.Vibrate();
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.Update((e) => (e.Item = selectedItem));
	}

	private HandleCashMissing(obj: any, hasWarning: boolean): void {
		if (hasWarning !== this.State.HasWarning) {
			this.Update((e) => (e.HasWarning = hasWarning));
		}
	}

	private HandleGameStatus(obj: any, gs: GameStatus): void {
		if (gs !== this.State.GameStatus) {
			this.Update((e) => (e.GameStatus = gs));
		}
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

		this._gameContext.State.SetPause(hasMenu);
	}

	public GetCenter(): Point {
		return this.middle;
	}

	public SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
	}

	private HandleMultiSelection(src: any, kind: SelectionKind): void {
		this.Update((e) => (e.SelectionKind = kind));
	}

	public GetReactor(): number {
		return this._gameContext.GetPlayerHq().GetReactorsCount();
	}
	public GetVehicleCount(): number {
		return this._gameContext.GetPlayerHq().GetVehicleCount();
	}

	public GetDuration(): number {
		return this._gameContext.Duration;
	}

	public OnTimerDone(): SimpleEvent {
		return this._gameContext.OnTimerDone;
	}

	public IsCovered(): boolean {
		return this._gameContext.GetPlayerHq().IsCovered(this.State.Item as Cell);
	}

	GetGoalDiamond(): number {
		return this._gameContext.GetDiamond();
	}

	GetFields(): FieldProp[] {
		if (this.State.Item instanceof Cell) {
			const cell = this.State.Item;
			const hq = this._gameContext.GetPlayerHq();
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
