import { HqLessShieldField } from './../../Items/Cell/Field/Bonus/HqLessShieldField';
import { CellLessHeadquarter } from '../Render/PowerRenderer/CellLessHeadquarter';
import { IHqGameContext } from './IHqGameContext';
import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { Identity } from '../../Items/Identity';

export class PowerContext implements IHqGameContext {
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	public OnGameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	private _cells: Dictionary<Cell>;
	constructor(
		cells: Cell[],
		private _unit: AliveItem,
		private _fakeHq: CellLessHeadquarter,
		private _target: HqLessShieldField
	) {
		this._cells = Dictionary.To((c) => c.Coo(), cells);
		this._target.OnDestroyed.On((source: any, data: Item) => {
			this.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
		});
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return this._unit;
	}

	GetPlayerHq(): IHeadquarter {
		return this._fakeHq;
	}

	GetHqFromId(identity: Identity): IHeadquarter {
		if (this._fakeHq.Identity.Name === identity.Name) {
			return this._fakeHq;
		}
		return null;
	}
}
