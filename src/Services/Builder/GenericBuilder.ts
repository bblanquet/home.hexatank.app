import { IInteractionService } from '../Interaction/IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameworldService } from '../World/IGameworldService';
import { IBuilder } from './IBuilder';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { IAudioService } from '../Audio/IAudioService';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { GameState } from '../../Core/Framework/World/GameState';
import { IPlayerProfileService } from '../PlayerProfil/IPlayerProfileService';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { GameAudioManager } from '../../Core/Framework/Audio/GameAudioManager';
import { IAppService } from '../App/IAppService';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { IHqGameworld } from '../../Core/Framework/World/IHqGameworld';
import { IBlueprintService } from '../Blueprint/IBlueprintService';
export class GenericBuilder<TB extends IBlueprint, TG extends IHqGameworld> implements IBuilder<TB> {
	private _blueprint: TB;
	private _appService: IAppService;
	private _interactionManager: PIXI.InteractionManager;
	private _gameAudioService: GameAudioManager;
	private _playerProfilService: IPlayerProfileService;
	private _gameworldService: IGameworldService<TB, TG>;
	private _context: TG;
	private _interactionService: IInteractionService<TG>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _victory: () => void;
	private _defeat: () => void;
	public OnReloaded: SimpleEvent = new SimpleEvent();
	private _blueprintService: IBlueprintService;

	constructor(private _app: SingletonKey, private _world: SingletonKey) {
		this._appService = Singletons.Load<IAppService>(SingletonKey.App);
		this._blueprintService = Singletons.Load<IBlueprintService>(SingletonKey.Blueprint);
		this._gameworldService = Singletons.Load<IGameworldService<TB, TG>>(this._world);
		this._playerProfilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<TG>>(SingletonKey.Interaction);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
	}
	public Register(blueprint: TB, victory: () => void, defeat: () => void): void {
		this._keyService.DefineKey(this._app);
		this._blueprintService.Register(blueprint);
		this._victory = victory;
		this._defeat = defeat;
		const gameState = new GameState();
		this._blueprint = blueprint;
		this._appService.Register(blueprint.MapMode);
		const app = this._appService.Publish();
		this._interactionManager = new PIXI.InteractionManager(app.renderer);
		this._updateService.Register(gameState);
		this._layerService.Register(app);
		this._gameworldService.Register(blueprint, gameState);
		this._context = this._gameworldService.Publish();
		this._interactionService.Register(this._interactionManager, this._context);
		this._gameAudioService = new GameAudioManager(blueprint.MapMode, this._context);
		this._audioService.Register(this._gameAudioService);
		this._context.State.OnGameStatusChanged.On(this.GameStatusChanged.bind(this));
		app.start();
	}
	Reload(): void {
		this._context.State.OnGameStatusChanged.Off(this.GameStatusChanged.bind(this));
		this.Collect();
		this.Register(this._blueprint, this._victory, this._defeat);
		this.OnReloaded.Invoke();
	}
	IsReloadable(): boolean {
		return true;
	}
	private GameStatusChanged(e: any, status: GameStatus) {
		if (status === GameStatus.Victory) {
			this._victory();
		} else if (status === GameStatus.Defeat) {
			this._defeat();
		}
		this._playerProfilService.Save();
	}
	public Collect(): void {
		this._gameAudioService.StopAll();
		this._audioService.Clear();
		this._interactionManager.destroy();
		this._gameworldService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._appService.Collect();
	}
}
