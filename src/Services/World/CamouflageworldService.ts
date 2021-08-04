import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { Camouflageworld } from '../../Core/Framework/World/Camouflageworld';
import { GameState } from '../../Core/Framework/World/GameState';
import { CamouflageworldMaker } from '../../Core/Framework/Worldmaker/Camouflage/CamouflageworldMaker';
import { IGameworldService } from './IGameworldService';

export class CamouflageworldService implements IGameworldService<CamouflageBlueprint, Camouflageworld> {
	private _gameworld: Camouflageworld;

	Register(mapContext: CamouflageBlueprint, gameState: GameState): void {
		this._gameworld = new CamouflageworldMaker().Make(mapContext, gameState);
	}
	Publish(): Camouflageworld {
		return this._gameworld;
	}

	Collect(): void {
		this._gameworld = null;
	}
}
