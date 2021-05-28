import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { LiteEvent } from '../../Utils/Events/LiteEvent';

export interface IGameContext {
	GetCells(): Cell[];
	OnItemSelected: LiteEvent<Item>;
	GetPlayer(): AliveItem;
}
