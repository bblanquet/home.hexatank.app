import { GameStatus } from './../../Core/Framework/GameStatus';
import { GameContext } from './../../Core/Framework/GameContext';
import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { MapRender } from '../../Core/Setup/Render/MapRender';
import { IGameContextService } from './IGameContextService';
import { AbstractHqRender } from '../../Core/Setup/Render/Hq/AbstractHqRender';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { Factory, FactoryKey } from '../../Factory';

export class GameContextService implements IGameContextService {
	private _gameContext: GameContext;
	private _playerProfilService: IPlayerProfilService;

	Register(hqRender: AbstractHqRender, mapContext: MapContext): void {
		this._playerProfilService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);
		this._gameContext = new MapRender().Render(hqRender, mapContext);
		this._gameContext.GameStatusChanged.On(this.SaveRecord.bind(this));
	}
	Publish(): GameContext {
		return this._gameContext;
	}

	private SaveRecord(e: any, status: GameStatus) {
		if (status === GameStatus.Lost || status === GameStatus.Won) {
			const record = this._gameContext.RecordContext.GetRecord();
			const profil = this._playerProfilService.GetProfil();
			profil.Records.push(record);
		}
	}

	Collect(): void {
		if (this._gameContext.Players) {
			this._gameContext.Players.forEach((p) => {
				p.OnChanged.Clear();
			});
		}
		this._gameContext = null;
	}
}
