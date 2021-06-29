import { GameState } from '../../Core/Framework/Context/GameState';
import { IGarbage } from '../IGarbage';
import { ItemsUpdater } from './../../Core/ItemsUpdater';
export interface IUpdateService extends IGarbage {
	Register(state: GameState): void;
	Publish(): ItemsUpdater;
}
