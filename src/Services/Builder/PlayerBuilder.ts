import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IInteractionService } from '../Interaction/IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameworldService } from '../World/IGameworldService';
import { IBuilder } from './IBuilder';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { GameState } from '../../Core/Framework/World/GameState';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { IAppService } from '../App/IAppService';

export class PlayerBuilder implements IBuilder<GameBlueprint> {
	private _context: GameBlueprint;
	private _appService: IAppService;
	private _interactionManager: PIXI.InteractionManager;
	public OnReloaded: SimpleEvent = new SimpleEvent();

	private _gameworldService: IGameworldService<GameBlueprint, Gameworld>;
	private _interactionService: IInteractionService<Gameworld>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _keyService: IKeyService;

	constructor() {
		this._appService = Singletons.Load<IAppService>(SingletonKey.App);
		this._gameworldService = Singletons.Load<IGameworldService<GameBlueprint, Gameworld>>(SingletonKey.Gameworld);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<Gameworld>>(SingletonKey.RecordInteraction);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
	}
	Reload(): void {}

	IsReloadable(): boolean {
		return false;
	}

	Restart(): void {}

	public Register(blueprint: GameBlueprint): void {
		this._keyService.DefineKey(this);
		const gameState = new GameState();
		this._context = blueprint;
		this._appService.Register(blueprint.MapMode);
		const app = this._appService.Publish();
		this._interactionManager = new PIXI.InteractionManager(app.renderer);
		this._updateService.Register(gameState);
		this._layerService.Register(app);
		this._gameworldService.Register(blueprint, gameState);
		const context = this._gameworldService.Publish();
		this._interactionService.Register(this._interactionManager, context);
		app.start();
	}

	public Context(): GameBlueprint {
		return this._context;
	}

	public Collect(): void {
		this._interactionManager.destroy();
		this._gameworldService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._appService.Collect();
	}
}
