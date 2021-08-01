import { IHqGameContext } from './IHqGameContext';
import { Identity } from '../../Items/Identity';
import { Tank } from '../../Items/Unit/Tank';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { Item } from '../../Items/Item';
import { Cell } from '../../Items/Cell/Cell';
import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { GameState } from './GameState';

export class GameContext implements IHqGameContext {
	//should not be here
	public static Error: Error;
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	public State: GameState;

	//elements
	private _playerHq: Headquarter;
	private _hqs: Headquarter[];
	private _cells: Dictionary<Cell>;
	private _vehicles: Dictionary<Vehicle> = new Dictionary<Vehicle>();
	private _vehicleCount: number = 0;
	constructor(state: GameState, cells: Cell[], hqs: Headquarter[] = null, playerHq: Headquarter = null) {
		this.State = state;
		this._playerHq = playerHq;
		this._hqs = hqs;
		this._cells = Dictionary.To((c) => c.Coo(), cells);

		if (hqs) {
			this._hqs.forEach((hq) => {
				hq.OnVehicleCreated.On(this.DefineVehicleName.bind(this));
			});
		}

		if (this._playerHq) {
			this._playerHq.OnDestroyed.On(() => {
				if (this.State.GameStatus === GameStatus.Pending) {
					this.State.GameStatus = GameStatus.Defeat;
					this.State.OnGameStatusChanged.Invoke(this, this.State.GameStatus);
				}
			});
			const foes = this._hqs.filter((hq) => hq !== this._playerHq);
			foes.forEach((foe) => {
				foe.OnDestroyed.On(() => {
					if (foes.every((e) => !e.IsAlive())) {
						if (this.State.GameStatus === GameStatus.Pending) {
							this.State.GameStatus = GameStatus.Victory;
							this.State.OnGameStatusChanged.Invoke(this, this.State.GameStatus);
						}
					}
				});
			});
		}
	}
	SetStatus(status: GameStatus): void {
		if (status === GameStatus.Defeat) {
			this._playerHq.Destroy();
		} else if (status === GameStatus.Victory) {
			this._hqs.forEach((hq) => {
				if (hq !== this._playerHq) {
					hq.Destroy();
				}
			});
		}
	}
	GetVehicles(): Vehicle[] {
		return this._vehicles.Values();
	}
	GetPlayer(): AliveItem {
		return this._playerHq;
	}

	public ExistUnit(id: string): Boolean {
		return this._vehicles.Exist(id);
	}

	public GetPlayerHq(): IHeadquarter {
		return this._playerHq;
	}

	public GetHqs(): Headquarter[] {
		return this._hqs;
	}

	public GetHqFromId(id: Identity) {
		return this._hqs.find((hq) => hq.Identity.Name === id.Name);
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}

	public GetCellDictionary(): Dictionary<Cell> {
		return this._cells;
	}

	public GetCell(coo: string): Cell {
		return this._cells.Get(coo);
	}

	public GetTank(id: string): Tank {
		return this._vehicles.Get(id) as Tank;
	}

	public GetVehicle(id: string): Vehicle {
		return this._vehicles.Get(id);
	}

	private DefineVehicleName(src: Headquarter, vehicule: Vehicle): void {
		vehicule.Id = `${src.Identity.Name}${this._vehicleCount}`;
		this._vehicleCount += 1;
		this._vehicles.Add(vehicule.Id, vehicule);
	}
}
