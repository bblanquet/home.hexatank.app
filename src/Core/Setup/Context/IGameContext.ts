import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { LiteEvent } from '../../Utils/Events/LiteEvent';

export interface IGameContext {
	OnItemSelected: LiteEvent<Item>;
	GetCells(): Cell[];
	GetPlayer(): AliveItem;
}
