import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { GameState } from './GameState';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { LiteEvent } from '../../Utils/Events/LiteEvent';

export interface IGameContext {
	OnItemSelected: LiteEvent<Item>;
	GetCells(): Cell[];
	GetVehicles(): Vehicle[];
	GetPlayer(): AliveItem;
	State: GameState;
}
