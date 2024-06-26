import { Hook } from '../Framework/Hook';
import { Singletons, SingletonKey } from '../../Singletons';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { Camouflageworld } from '../../Core/Framework/World/Camouflageworld';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
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
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { Vibrator } from '../../Utils/Vibrator';
import { ViewTranslator } from '../../Core/ViewTranslator';
import { Camouflage } from '../Model/Dialogues';
import { ILayerService } from '../../Services/Layer/ILayerService';

export class CamouflageHook extends Hook<RuntimeState> {
	private _gameworldService: IGameworldService<CamouflageBlueprint, Camouflageworld>;
	private _appService: IBuilder<CamouflageBlueprint>;
	private _profilService: IPlayerProfileService;
	private _soundService: IAudioService;
	private _layerService: ILayerService;
	private _keyService: IKeyService;
	private _interactionService: IInteractionService<Camouflageworld>;
	private _gameworld: Camouflageworld;
	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _handleRetry: any = this.Retry.bind(this);
	public OnRetried: SimpleEvent = new SimpleEvent();
	private _steps = 0;
	private _viewTranslator: ViewTranslator;

	constructor(d: [RuntimeState, StateUpdater<RuntimeState>]) {
		super(d[0], d[1]);
		this.Init();
	}

	private Init() {
		this._gameworldService = Singletons.Load<IGameworldService<CamouflageBlueprint, Camouflageworld>>(
			SingletonKey.Camouflageworld
		);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IBuilder<CamouflageBlueprint>>(this._keyService.GetAppKey());
		this._profilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<Camouflageworld>>(
			SingletonKey.CamouflageInteraction
		);
		this._gameworld = this._gameworldService.Publish();

		this._gameworld.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameworld.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._profilService.OnPointsAdded.On(this.HandlePoints.bind(this));
		this._appService.OnReloaded.On(this._handleRetry);
		this.OnRetried.Invoke();
		this._gameworld.State.SetInteraction(false);
		this._steps = 0;
		this._viewTranslator = new ViewTranslator(
			[ this._gameworld.ArrivalCell.GetBoundingBox(), this._gameworld.DepartCell.GetBoundingBox() ],
			3000
		);
		this._layerService.PauseNavigation();
		this._viewTranslator.OnDone.On(this.OnTranslationDone.bind(this));
	}

	private Retry(): void {
		this.Unmount();
		this.Init();
		this.Update((state) => {
			state.HasMenu = false;
			state.IsSettingMenuVisible = false;
			state.IsSynchronising = false;
			state.HasMultiMenu = false;
			state.HasWarning = false;
			state.Amount = GameSettings.PocketMoney;
			state.Item = null;
			state.Players = [];
			state.GameStatus = GameStatus.Pending;
			state.StatusDetails = null;
			state.Sentence = Camouflage[0];
		});
	}

	public Unmount(): void {
		this._viewTranslator.OnDone.Clear();
		this._gameworld.State.OnGameStatusChanged.Clear();
		this._gameworld.OnItemSelected.Clear();
		this._gameworld.State.OnGameStatusChanged.Clear();
		this._interactionService.OnMultiMenuShowed.Clear();
		this._profilService.OnPointsAdded.Clear();
		this._appService.OnReloaded.Off(this._handleRetry);
	}

	public GetCenter(): Point {
		return this._gameworld.ArrivalCell.GetBoundingBox().GetCentralPoint();
	}

	static DefaultState(): RuntimeState {
		const state = new RuntimeState();
		state.HasMenu = false;
		state.IsSettingMenuVisible = false;
		state.IsSynchronising = false;
		state.HasMultiMenu = false;
		state.HasWarning = false;
		state.Amount = GameSettings.PocketMoney;
		state.Item = null;
		state.Players = [];
		state.GameStatus = GameStatus.Pending;
		state.StatusDetails = null;
		state.Sentence = Camouflage[0];
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
		this._gameworld.SetStatus(isVictory ? GameStatus.Victory : GameStatus.Defeat);
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

	public SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		return interaction.OnSelect(item);
	}

	public SetNextSentence(): void {
		this._steps++;
		this.Update((e) => {
			e.Sentence = Camouflage[this._steps];
		});
		if (1 === this._steps) {
			this._viewTranslator.Next();
		}
	}

	private OnTranslationDone(): void {
		this._gameworld.State.SetInteraction(true);
		this._layerService.StartNavigation();
	}
}
