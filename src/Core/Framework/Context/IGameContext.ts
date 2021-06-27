import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { LiteEvent } from '../../Utils/Events/LiteEvent';

export interface IGameContext {
	OnGameStatusChanged: LiteEvent<GameStatus>;
	OnItemSelected: LiteEvent<Item>;
	GetCells(): Cell[];
	GetVehicles(): Vehicle[];
	GetPlayer(): AliveItem;
}
