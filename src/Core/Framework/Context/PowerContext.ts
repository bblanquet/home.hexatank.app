import { HqLessShieldField } from './../../Items/Cell/Field/Bonus/HqLessShieldField';
import { CellLessHeadquarter } from '../Render/PowerRenderer/CellLessHeadquarter';
import { IHqGameContext } from './IHqGameContext';
import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { Identity } from '../../Items/Identity';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { GameState } from './GameState';

export class PowerContext implements IHqGameContext {
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	private _cells: Dictionary<Cell>;
	public State: GameState;

	constructor(
		state: GameState,
		cells: Cell[],
		private _unit: AliveItem,
		private _fakeHq: CellLessHeadquarter,
		private _target: HqLessShieldField
	) {
		this._cells = Dictionary.To((c) => c.Coo(), cells);
		this.State = state;
		this._target.OnDestroyed.On((source: any, data: Item) => {
			this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
		});
	}

	GetVehicles(): Vehicle[] {
		return [];
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
