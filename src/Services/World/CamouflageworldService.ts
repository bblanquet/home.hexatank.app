import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { Camouflageworld } from '../../Core/Framework/World/Camouflageworld';
import { GameState } from '../../Core/Framework/World/GameState';
import { CamouflageworldMaker } from '../../Core/Framework/Worldmaker/Camouflage/CamouflageworldMaker';
import { IGameworldService } from './IGameworldService';

export class CamouflageworldService implements IGameworldService<CamouflageBlueprint, Camouflageworld> {
	private _gameContext: Camouflageworld;

	Register(mapContext: CamouflageBlueprint, gameState: GameState): void {
		this._gameContext = new CamouflageworldMaker().Make(mapContext, gameState);
	}
	Publish(): Camouflageworld {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
