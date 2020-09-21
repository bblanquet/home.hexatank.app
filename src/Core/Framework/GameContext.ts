import { DateValue } from './../Utils/Stats/DateValue';
import { StatsKind } from './../Utils/Stats/StatsKind';
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
import { Groups } from '../Utils/Collections/Groups';
import { Curve } from '../Utils/Stats/Curve';

export class GameContext {
	//events
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public GameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();

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

	//stat
	private _curves: Groups<Curve> = new Groups<Curve>();
	private _refDate: number;

	public Setup(mainHq: Headquarter, hqs: Headquarter[], cells: Cell[]) {
		this._mainHq = mainHq;
		this._hqs = hqs;
		this._cells = Dictionnary.To((c) => c.Coo(), cells);
		this._refDate = new Date().getTime();

		this._mainHq.OnDestroyed.On(() => {
			this.GameStatusChanged.Invoke(this, GameStatus.Lost);
		});

		this._hqs.forEach((hq) => {
			this._curves.Add(StatsKind[StatsKind.Unit], new Curve(new Array<DateValue>(), hq.GetSkin().GetColor()));
			this._curves.Add(StatsKind[StatsKind.Diamond], new Curve(new Array<DateValue>(), hq.GetSkin().GetColor()));
			this._curves.Add(StatsKind[StatsKind.Cell], new Curve(new Array<DateValue>(), hq.GetSkin().GetColor()));
			this._curves.Add(StatsKind[StatsKind.Energy], new Curve(new Array<DateValue>(), hq.GetSkin().GetColor()));
			hq.OnDiamondCountChanged.On(this.HandleDiamondChanged.bind(this));
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
			hq.OnFieldCountchanged.On(this.HandleFieldChanged.bind(this));
			hq.OnEnergyChanged.On(this.HandleEnergyChanged.bind(this));
		});

		const foes = this._hqs.filter((hq) => hq !== this._mainHq);
		foes.forEach((foe) => {
			foe.OnDestroyed.On(() => {
				if (foes.every((e) => !e.IsAlive())) {
					this.GameStatusChanged.Invoke(this, GameStatus.Won);
				}
			});
		});
	}

	GetCurves(): Groups<Curve> {
		return this._curves;
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

	private HandleDiamondChanged(src: Headquarter, diamond: number): void {
		this._hqs.forEach((hq) => {
			const curve = this._curves
				.Get(StatsKind[StatsKind.Diamond])
				.find((c) => c.Color === hq.GetSkin().GetColor());
			curve.Points.push(new DateValue(new Date().getTime() - this._refDate, hq.GetDiamondCount()));
		});
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		vehicule.Id = `${src.PlayerName}${this._vehicleCount}`;
		this._vehicleCount += 1;
		this._vehicles.Add(vehicule.Id, vehicule);
		this._hqs.forEach((hq) => {
			const curve = this._curves.Get(StatsKind[StatsKind.Unit]).find((c) => c.Color === hq.GetSkin().GetColor());
			curve.Points.push(new DateValue(new Date().getTime() - this._refDate, hq.GetVehicleCount()));
		});
	}

	private HandleFieldChanged(src: Headquarter, field: number): void {
		this._hqs.forEach((hq) => {
			const curve = this._curves.Get(StatsKind[StatsKind.Cell]).find((c) => c.Color === hq.GetSkin().GetColor());
			curve.Points.push(new DateValue(new Date().getTime() - this._refDate, hq.GetDiamondCount()));
		});
	}

	private HandleEnergyChanged(src: Headquarter, energy: number): void {
		this._hqs.forEach((hq) => {
			const curve = this._curves
				.Get(StatsKind[StatsKind.Energy])
				.find((c) => c.Color === hq.GetSkin().GetColor());
			curve.Points.push(new DateValue(new Date().getTime() - this._refDate, hq.GetCellTotalEnergy()));
		});
	}
}
