import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { CamouflageContext } from '../../Core/Framework/Context/CamouflageContext';
import { GameState } from '../../Core/Framework/Context/GameState';
import { CamouflageRenderer } from '../../Core/Framework/Render/Camouflage/CamouflageRenderer';
import { IGameContextService } from './IGameContextService';

export class CamouflageGameContextService implements IGameContextService<CamouflageBlueprint, CamouflageContext> {
	private _gameContext: CamouflageContext;

	Register(mapContext: CamouflageBlueprint, gameState: GameState): void {
		this._gameContext = new CamouflageRenderer().Render(mapContext, gameState);
	}
	Publish(): CamouflageContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
