import { Hook } from './Hook';
import { Singletons, SingletonKey } from '../../Singletons';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameworldService } from '../../Services/World/IGameworldService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { ISelectable } from '../../Core/ISelectable';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { Item } from '../../Core/Items/Item';
import { RuntimeState } from '../Model/RuntimeState';
import { StateUpdater } from 'preact/hooks';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Point } from '../../Utils/Geometry/Point';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { IBuilder } from '../../Services/Builder/IBuilder';
import { IKeyService } from '../../Services/Key/IKeyService';
import { Fireworld } from '../../Core/Framework/World/Fireworld';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { Cell } from '../../Core/Items/Cell/Cell';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';
import { Vibrator } from '../../Utils/Vibrator';
import { FieldProp } from '../Components/Canvas/FieldProp';
import { CellGroup } from '../../Core/Items/CellGroup';

export class FireHook extends Hook<RuntimeState> {
	private _gameworldService: IGameworldService<FireBlueprint, Fireworld>;
	private _profilService: IPlayerProfilService;
	private _soundService: IAudioService;
	private _interactionService: IInteractionService<Fireworld>;
	private _gameworld: Fireworld;
	private _keyService: IKeyService;
	private _appService: IBuilder<FireBlueprint>;
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
		this._appService = Singletons.Load<IBuilder<FireBlueprint>>(this._keyService.GetAppKey());
		this._gameworldService = Singletons.Load<IGameworldService<FireBlueprint, Fireworld>>(SingletonKey.Fireworld);
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<Fireworld>>(SingletonKey.Interaction);
		this._gameworld = this._gameworldService.Publish();
		this._gameworld.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._soundService.Pause(AudioLoader.GetAudio(AudioArchive.loungeMusic));
		this._gameworld.OnItemSelected.On(this.HandleSelection.bind(this));
		this._profilService.OnPointsAdded.On(this.HandlePoints.bind(this));
		this._gameworld.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._interactionService.GetMultiSelectionContext().OnModeChanged.On(this.HandleMultiSelection.bind(this));
		this._appService.OnReloaded.On(this._handleRetry);
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
		this._gameworld.State.OnGameStatusChanged.Clear();
		this._gameworld.OnItemSelected.Clear();
		this._interactionService.GetMultiSelectionContext().OnModeChanged.Clear();
		this._gameworld.State.OnGameStatusChanged.Clear();
		this._profilService.OnPointsAdded.Clear();
		this._interactionService.OnMultiMenuShowed.Clear();
		this._appService.OnReloaded.Off(this._handleRetry);
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

		this._gameworld.State.SetPause(hasMenu);
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

	public Stop(isVictory: boolean): void {
		this._gameworld.SetStatus(isVictory ? GameStatus.Victory : GameStatus.Defeat);
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
