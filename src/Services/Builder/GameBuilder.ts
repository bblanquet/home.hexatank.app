import { IOnlineService } from '../Online/IOnlineService';
import { IAudioService } from '../Audio/IAudioService';
import { GameAudioManager } from '../../Core/Framework/Audio/GameAudioManager';
import { IKeyService } from '../Key/IKeyService';
import { IInteractionService } from '../Interaction/IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IBuilder } from './IBuilder';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IPlayerProfileService } from '../PlayerProfil/IPlayerProfileService';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { IGameworldService } from '../World/IGameworldService';
import { GameState } from '../../Core/Framework/World/GameState';
import { IAppService } from '../App/IAppService';
import { IStatsService } from '../Stats/IStatsService';
import { IRecordContextService } from '../Record/IRecordContextService';
import { IBlueprintService } from '../Blueprint/IBlueprintService';

export class GameBuilder implements IBuilder<GameBlueprint> {
	private _blueprint: GameBlueprint;
	private _gameworld: Gameworld;
	private _appService: IAppService;
	private _interactionManager: PIXI.InteractionManager;
	private _gameAudioService: GameAudioManager;
	private _blueprintService: IBlueprintService;

	private _gameContextService: IGameworldService<GameBlueprint, Gameworld>;
	private _interactionService: IInteractionService<Gameworld>;
	private _layerService: ILayerService;
	private _statService: IStatsService;
	private _recordService: IRecordContextService;
	private _updateService: IUpdateService;
	private _onlineService: IOnlineService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _playerProfilService: IPlayerProfileService;
	private _gameStatusChanged: any = this.GameStatusChanged.bind(this);
	private _victory: () => void;
	private _defeat: () => void;
	public OnReloaded: SimpleEvent = new SimpleEvent();
	constructor() {
		this._appService = Singletons.Load<IAppService>(SingletonKey.App);
		this._blueprintService = Singletons.Load<IBlueprintService>(SingletonKey.Blueprint);
		this._gameContextService = Singletons.Load<IGameworldService<GameBlueprint, Gameworld>>(SingletonKey.Gameworld);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._statService = Singletons.Load<IStatsService>(SingletonKey.Stats);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<Gameworld>>(SingletonKey.Interaction);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._playerProfilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._recordService = Singletons.Load<IRecordContextService>(SingletonKey.RecordContext);
	}
	public Register(blueprint: GameBlueprint, victory: () => void, defeat: () => void): void {
		this._keyService.DefineKey(SingletonKey.GameBuilder);
		this._blueprintService.Register(blueprint);
		const gameState = new GameState();
		this._blueprint = blueprint;
		this._victory = victory;
		this._defeat = defeat;
		this._appService.Register(blueprint.MapMode);
		const app = this._appService.Publish();
		this._layerService.Register(app);
		this._updateService.Register(gameState);
		this._interactionManager = new PIXI.InteractionManager(app.renderer);
		this._gameContextService.Register(blueprint, gameState);
		this._gameworld = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, this._gameworld);
		this._statService.Register(this._gameworld);
		this._recordService.Register(blueprint, this._gameworld);
		this._gameAudioService = new GameAudioManager(blueprint.MapMode, this._gameworld);
		this._audioService.Register(this._gameAudioService);
		this._gameworld.State.OnGameStatusChanged.On(this._gameStatusChanged);
		app.start();
	}
	Reload(): void {
		this._gameworld.State.OnGameStatusChanged.Off(this.GameStatusChanged.bind(this));
		this.Collect();
		this.Register(this._blueprint, this._victory, this._defeat);
		this.OnReloaded.Invoke();
	}
	IsReloadable(): boolean {
		return !this._onlineService.IsOnline();
	}
	private GameStatusChanged(e: any, status: GameStatus): void {
		if (status === GameStatus.Defeat || status === GameStatus.Victory) {
			if (status === GameStatus.Victory) {
				this._victory();
			}
			if (status === GameStatus.Defeat) {
				this._defeat();
			}
			this._playerProfilService.Save();

			const recordContext = this._recordService.Publish();
			recordContext.Stop(status === GameStatus.Victory);
			const record = recordContext.GetRecord();
			this._playerProfilService.Load();
			const profil = this._playerProfilService.GetProfil();
			profil.Records.push(record);
			this._playerProfilService.Save();
		}
	}
	public Collect(): void {
		this._gameAudioService.StopAll();
		this._audioService.Clear();
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._onlineService.Collect();
		this._appService.Collect();
	}
}
