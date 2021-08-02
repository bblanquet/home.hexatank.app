import { Item } from '../../Core/Items/Item';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';

export class RuntimeState {
	SelectionKind: SelectionKind;

	HasMenu: boolean;
	IsSettingMenuVisible: boolean;
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

	StatusDetails: PointDetails;
}
