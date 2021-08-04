import { GameState } from '../../Core/Framework/World/GameState';
import { IGarbage } from '../IGarbage';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
export interface IUpdateService extends IGarbage {
	Register(state: GameState): void;
	Publish(): ItemsUpdater;
}
