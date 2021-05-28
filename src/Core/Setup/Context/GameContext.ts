import { Identity } from '../../Items/Identity';
import { IGameContext } from './IGameContext';
import { Tank } from '../../Items/Unit/Tank';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Item } from '../../Items/Item';
import { Cell } from '../../Items/Cell/Cell';
import { GameStatus } from '../../Framework/GameStatus';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { AliveItem } from '../../Items/AliveItem';

export class GameContext implements IGameContext {
	//should not be here
	public static Error: Error;
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();

	//ok
	public GameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();

	//elements
	private _playerHq: Headquarter;
	private _hqs: Headquarter[];
	private _cells: Dictionnary<Cell>;
	private _vehicles: Dictionnary<Vehicle> = new Dictionnary<Vehicle>();
	private _vehicleCount: number = 0;
	constructor(cells: Cell[], hqs: Headquarter[] = null, playerHq: Headquarter = null) {
		this._playerHq = playerHq;
		this._hqs = hqs;
		this._cells = Dictionnary.To((c) => c.Coo(), cells);

		if (hqs) {
			this._hqs.forEach((hq) => {
				hq.OnVehicleCreated.On(this.DefineVehicleName.bind(this));
			});
		}

		if (this._playerHq) {
			this._playerHq.OnDestroyed.On(() => {
				this.GameStatusChanged.Invoke(this, GameStatus.Lost);
			});
			const foes = this._hqs.filter((hq) => hq !== this._playerHq);
			foes.forEach((foe) => {
				foe.OnDestroyed.On(() => {
					if (foes.every((e) => !e.IsAlive())) {
						this.GameStatusChanged.Invoke(this, GameStatus.Won);
					}
				});
			});
		}
	}
	GetPlayer(): AliveItem {
		return this._playerHq;
	}

	public ExistUnit(id: string): Boolean {
		return this._vehicles.Exist(id);
	}

	public GetPlayerHq(): Headquarter {
		return this._playerHq;
	}

	public GetHqs(): Headquarter[] {
		return this._hqs;
	}

	public GetHq(coo: string) {
		return this._hqs.find((e) => e.GetCell().Coo() === coo);
	}

	public GetHqFromId(id: Identity) {
		return this._hqs.find((hq) => hq.Identity.Name === id.Name);
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}

	public GetCell(coo: string): Cell {
		return this._cells.Get(coo);
	}

	public GetTank(id: string): Tank {
		const result = this._vehicles.Get(id);
		if (isNullOrUndefined(result) || !(result instanceof Tank)) {
			throw 'synchronized issue';
		}
		return result as Tank;
	}

	public GetUnit(id: string): Vehicle {
		const result = this._vehicles.Get(id);
		if (isNullOrUndefined(result)) {
			throw 'synchronized issue';
		}
		return result;
	}

	private DefineVehicleName(src: Headquarter, vehicule: Vehicle): void {
		vehicule.Id = `${src.Identity.Name}${this._vehicleCount}`;
		this._vehicleCount += 1;
		this._vehicles.Add(vehicule.Id, vehicule);
	}
}