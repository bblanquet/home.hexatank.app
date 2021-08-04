import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { IInteractionService } from '../Interaction/IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameworldService } from '../World/IGameworldService';
import { AppProvider } from '../../Core/Framework/App/AppProvider';
import { IAppService } from './IAppService';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { CellStateSetter } from '../../Core/Items/Cell/CellStateSetter';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { GameState } from '../../Core/Framework/World/GameState';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { CellState } from '../../Core/Items/Cell/CellState';

export class PlayerAppService implements IAppService<GameBlueprint> {
	private _context: GameBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;
	public OnRefresh: SimpleEvent = new SimpleEvent();

	private _gameContextService: IGameworldService<GameBlueprint, Gameworld>;
	private _interactionService: IInteractionService<Gameworld>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _keyService: IKeyService;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Singletons.Load<IGameworldService<GameBlueprint, Gameworld>>(
			SingletonKey.GameContext
		);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<Gameworld>>(SingletonKey.RecordInteraction);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
	}
	Retry(): void {}

	IsRetriable(): boolean {
		return false;
	}
	GetStats(): StatsContext {
		return null;
	}
	GetRecord(): RecordContext {
		return null;
	}

	Restart(): void {}

	public Register(blueprint: GameBlueprint): void {
		this._keyService.DefineKey(this);

		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		const gameState = new GameState();

		this._context = blueprint;
		this._app = this._appProvider.Provide(blueprint);
		this._interactionManager = new PIXI.InteractionManager(this._app.renderer);
		this._updateService.Register(gameState);
		this._layerService.Register(this._app);
		this._gameContextService.Register(blueprint, gameState);
		const context = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, context);

		this._app.start();
		CellStateSetter.SetStates(context.GetCells());
		context.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): GameBlueprint {
		return this._context;
	}

	public Collect(): void {
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._app.destroy();
		this._app = null;
	}
}
