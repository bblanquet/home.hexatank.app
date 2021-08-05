import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { IGameworldService } from './IGameworldService';
import { GameState } from '../../Core/Framework/World/GameState';
import { Outpostworld } from '../../Core/Framework/World/Outpostworld';
import { OutpostworlddMaker } from '../../Core/Framework/Worldmaker/Outpost/OutpostworldMaker';

export class OutpostworldService implements IGameworldService<FireBlueprint, Outpostworld> {
	private _gameworld: Outpostworld;

	Register(blueprint: FireBlueprint, gameState: GameState): void {
		this._gameworld = new OutpostworlddMaker().Make(blueprint, gameState);
	}
	Publish(): Outpostworld {
		return this._gameworld;
	}

	Collect(): void {
		this._gameworld = null;
	}
}
