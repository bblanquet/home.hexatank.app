import { CamouflageAudioManager } from '../../Core/Framework/Audio/CamouflageAudioManager';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { IInteractionService } from '../Interaction/IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameContextService } from '../GameContext/IGameContextService';
import { AppProvider } from '../../Core/Framework/App/AppProvider';
import { IAppService } from './IAppService';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { CellStateSetter } from '../../Core/Items/Cell/CellStateSetter';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { CamouflageContext } from '../../Core/Framework/Context/CamouflageContext';
import { IAudioService } from '../Audio/IAudioService';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { GameState } from '../../Core/Framework/Context/GameState';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { CellState } from '../../Core/Items/Cell/CellState';

export class CamouflageAppService implements IAppService<CamouflageBlueprint> {
	private _blueprint: CamouflageBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _input: PIXI.InteractionManager;

	private _playerProfilService: IPlayerProfilService;
	private _gameContextService: IGameContextService<CamouflageBlueprint, CamouflageContext>;
	private _interactionService: IInteractionService<CamouflageContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _gameAudioService: CamouflageAudioManager;
	private _context: CamouflageContext;
	private _gameStatusChanged: any = this.GameStatusChanged.bind(this);
	private _victory: () => void;
	private _defeat: () => void;
	public OnRefresh: SimpleEvent = new SimpleEvent();

	Retry(): void {
		this._context.State.OnGameStatusChanged.Off(this.GameStatusChanged.bind(this));
		this.Collect();
		this.Register(this._blueprint, this._victory, this._defeat);
		this.OnRefresh.Invoke();
	}

	IsRetriable(): boolean {
		return true;
	}

	public Register(blueprint: CamouflageBlueprint, victory: () => void, defeat: () => void): void {
		this._appProvider = new AppProvider();
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._gameContextService = Singletons.Load<IGameContextService<CamouflageBlueprint, CamouflageContext>>(
			SingletonKey.CamouflageGameContext
		);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);

		this._interactionService = Singletons.Load<IInteractionService<CamouflageContext>>(
			SingletonKey.CamouflageInteraction
		);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._keyService.DefineKey(this);

		this._victory = victory;
		this._defeat = defeat;
		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		const gameState = new GameState();
		this._blueprint = blueprint;
		this._app = this._appProvider.Provide(blueprint);
		this._input = new PIXI.InteractionManager(this._app.renderer);
		this._updateService.Register(gameState);
		this._layerService.Register(this._app);
		this._gameContextService.Register(blueprint, gameState);
		this._context = this._gameContextService.Publish();
		this._interactionService.Register(this._input, this._context);
		this._gameAudioService = new CamouflageAudioManager(blueprint, this._context);
		this._audioService.Register(this._gameAudioService);
		this._context.State.OnGameStatusChanged.On(this._gameStatusChanged);

		this._app.start();
		CellStateSetter.SetStates(this._context.GetCells());
		this._context.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});
	}

	private GameStatusChanged(e: any, status: GameStatus) {
		if (status === GameStatus.Victory) {
			this._victory();
		} else if (status === GameStatus.Defeat) {
			this._defeat();
		}
		this._playerProfilService.Save();
	}

	GetStats(): StatsContext {
		return null;
	}
	GetRecord(): RecordContext {
		return null;
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): CamouflageBlueprint {
		return this._blueprint;
	}

	public Collect(): void {
		this._gameAudioService.StopAll();
		this._input.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._audioService.Clear();
		this._app.destroy();
		this._app = null;
	}
}
