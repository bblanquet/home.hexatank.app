import { Item } from '../../Core/Items/Item';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { OnlinePlayer } from '../../Network/OnlinePlayer';

export class RuntimeState {
	HasMenu: boolean;
	IsSettingMenuVisible: boolean;
	IsSettingPatrol: boolean;
	IsSynchronising: boolean;
	IsMultiMenuVisible: boolean;

	HasMultiMenu: boolean;
	HasWarning: boolean;
	TankRequestCount: number;
	TruckRequestCount: number;

	Amount: number;
	Item: Item;
	Players: OnlinePlayer[];
	GameStatus: GameStatus;
}