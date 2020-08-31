import { Tank } from './../Items/Unit/Tank';
import { isNullOrUndefined } from 'util';
import { GameStatus } from './../../Components/Canvas/GameStatus';
import { Headquarter } from './../Items/Cell/Field/Hq/Headquarter';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { Vehicle } from './../Items/Unit/Vehicle';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { Player } from '../../Network/Player';

export class GameContext {
	//events
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnGameEnded: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();

	//elements
	private _mainHq: Headquarter;
	private _hqs: Headquarter[];
	private _cells: Dictionnary<Cell>;
	private _vehicles: Dictionnary<Vehicle> = new Dictionnary<Vehicle>();

	//context
	public IsFlagingMode: boolean;

	//stats
	private _vehicleCount: number = 0;

	//online
	public Players: Player[];

	public Setup(mainHq: Headquarter, hqs: Headquarter[], cells: Cell[]) {
		this._mainHq = mainHq;
		this._hqs = hqs;
		this._cells = Dictionnary.To((c) => c.Coo(), cells);

		this._mainHq.OnDestroyed.On(() => {
			this.OnGameEnded.Invoke(this, GameStatus.Lost);
		});

		this._hqs.forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});

		const foes = this._hqs.filter((hq) => hq !== this._mainHq);
		foes.forEach((foe) => {
			foe.OnDestroyed.On(() => {
				if (foes.every((e) => !e.IsAlive())) {
					this.OnGameEnded.Invoke(this, GameStatus.Won);
				}
			});
		});
	}

	ExistUnit(id: string) {
		return this._vehicles.Exist(id);
	}

	public GetMainHq(): Headquarter {
		return this._mainHq;
	}

	public GetHqs(): Headquarter[] {
		return this._hqs;
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}

	public GetCell(coo: string): Cell {
		return this._cells.Get(coo);
	}

	public GetHq(coo: string) {
		return this._hqs.find((e) => e.GetCell().Coo() === coo);
	}

	GetTank(id: string): Tank {
		const result = this._vehicles.Get(id);
		if (isNullOrUndefined(result) || !(result instanceof Tank)) {
			throw 'synchronized issue';
		}
		return result as Tank;
	}

	GetUnit(id: string): Vehicle {
		const result = this._vehicles.Get(id);
		if (isNullOrUndefined(result)) {
			throw 'synchronized issue';
		}
		return result;
	}

	private HandleVehicleCreated(obj: Headquarter, vehicule: Vehicle): void {
		vehicule.Id = `${obj.PlayerName}${this._vehicleCount}`;
		this._vehicleCount += 1;
		this._vehicles.Add(vehicule.Id, vehicule);
	}
}
