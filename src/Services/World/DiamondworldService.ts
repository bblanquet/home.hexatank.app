import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { Diamondworld } from '../../Core/Framework/World/Diamondworld';
import { IGameworldService } from './IGameworldService';
import { DiamondworlMaker } from '../../Core/Framework/Worldmaker/Diamond/DiamondworlMaker';
import { GameState } from '../../Core/Framework/World/GameState';

export class DiamondworldService implements IGameworldService<DiamondBlueprint, Diamondworld> {
	private _gameContext: Diamondworld;

	Register(blueprint: DiamondBlueprint, gameState: GameState): void {
		this._gameContext = new DiamondworlMaker().Make(blueprint, gameState);
	}
	Publish(): Diamondworld {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
