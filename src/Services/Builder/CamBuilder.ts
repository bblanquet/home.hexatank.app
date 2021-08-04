import { CamouflageAudioManager } from '../../Core/Framework/Audio/CamouflageAudioManager';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { IInteractionService } from '../Interaction/IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameworldService } from '../World/IGameworldService';
import { IBuilder } from './IBuilder';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { Camouflageworld } from '../../Core/Framework/World/Camouflageworld';
import { IAudioService } from '../Audio/IAudioService';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { GameState } from '../../Core/Framework/World/GameState';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { IAppService } from '../App/IAppService';
export class CamBuilder implements IBuilder<CamouflageBlueprint> {
	private _blueprint: CamouflageBlueprint;
	private _appService: IAppService;
	private _input: PIXI.InteractionManager;
	private _playerProfilService: IPlayerProfilService;
	private _gameworldService: IGameworldService<CamouflageBlueprint, Camouflageworld>;
	private _interactionService: IInteractionService<Camouflageworld>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _gameAudioService: CamouflageAudioManager;
	private _context: Camouflageworld;
	private _victory: () => void;
	private _defeat: () => void;
	public OnReloaded: SimpleEvent = new SimpleEvent();
	private _gameStatusChanged: any = this.GameStatusChanged.bind(this);

	constructor() {
		this._appService = Singletons.Load<IAppService>(SingletonKey.App);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._appService = Singletons.Load<IAppService>(SingletonKey.App);
		this._gameworldService = Singletons.Load<IGameworldService<CamouflageBlueprint, Camouflageworld>>(
			SingletonKey.Camouflageworld
		);
		this._interactionService = Singletons.Load<IInteractionService<Camouflageworld>>(
			SingletonKey.CamouflageInteraction
		);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
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
	public Register(blueprint: CamouflageBlueprint, victory: () => void, defeat: () => void): void {
		this._keyService.DefineKey(this);
		this._victory = victory;
		this._defeat = defeat;
		const gameState = new GameState();
		this._blueprint = blueprint;
		this._appService.Register(blueprint.MapMode);
		const app = this._appService.Publish();
		this._input = new PIXI.InteractionManager(app.renderer);
		this._updateService.Register(gameState);
		this._layerService.Register(app);
		this._gameworldService.Register(blueprint, gameState);
		this._context = this._gameworldService.Publish();
		this._interactionService.Register(this._input, this._context);
		this._gameAudioService = new CamouflageAudioManager(blueprint, this._context);
		this._audioService.Register(this._gameAudioService);
		this._context.State.OnGameStatusChanged.On(this._gameStatusChanged);
		app.start();
	}
	private GameStatusChanged(e: any, status: GameStatus) {
		if (status === GameStatus.Victory) {
			this._victory();
		} else if (status === GameStatus.Defeat) {
			this._defeat();
		}
		this._playerProfilService.Save();
	}
	public Context(): CamouflageBlueprint {
		return this._blueprint;
	}
	public Collect(): void {
		this._gameAudioService.StopAll();
		this._input.destroy();
		this._gameworldService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._audioService.Clear();
		this._appService.Collect();
	}
}
