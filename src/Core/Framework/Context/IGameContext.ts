import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { GameState } from './GameState';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { GameStatus } from '../GameStatus';

export interface IGameContext {
	OnItemSelected: LiteEvent<Item>;
	GetCells(): Cell[];
	GetVehicles(): Vehicle[];
	GetPlayer(): AliveItem;
	SetStatus(status: GameStatus): void;
	State: GameState;
}
