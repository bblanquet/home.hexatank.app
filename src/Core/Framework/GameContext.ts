import { MapEnv } from './../Setup/Generator/MapEnv';
import { MapContext } from './../Setup/Generator/MapContext';
import { RecordContext } from './Record/RecordContext';
import { StatsContext } from './Stats/StatsContext';
import { Tank } from './../Items/Unit/Tank';
import { Headquarter } from './../Items/Cell/Field/Hq/Headquarter';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { Vehicle } from './../Items/Unit/Vehicle';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { Player } from '../../Network/Player';
import { GameStatus } from './GameStatus';
import { isNullOrUndefined } from '../Utils/ToolBox';
import { MultiSelectionContext } from '../Menu/Smart/MultiSelectionContext';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { Factory, FactoryKey } from '../../Factory';

export class GameContext {
	private _playerProfilService: IPlayerProfilService;

	public static Error: Error;

	public StatsContext: StatsContext;
	public RecordContext: RecordContext;
	public MultiSelectionContext: MultiSelectionContext;

	//events
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	public GameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();

	//elements
	private _playerHq: Headquarter;
	private _hqs: Headquarter[];
	private _cells: Dictionnary<Cell>;
	private _vehicles: Dictionnary<Vehicle> = new Dictionnary<Vehicle>();

	//context
	public IsFlagingMode: boolean;

	//stats
	private _vehicleCount: number = 0;

	//online
	public Players: Player[];

	private _mapContext: MapContext;

	constructor() {
		this._playerProfilService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);
	}

	public Setup(mapContext: MapContext, hqs: Headquarter[], cells: Cell[], playerHq: Headquarter = null) {
		this._playerHq = playerHq;
		this._mapContext = mapContext;
		this._hqs = hqs;
		this._cells = Dictionnary.To((c) => c.Coo(), cells);

		this._hqs.forEach((hq) => {
			hq.OnVehicleCreated.On(this.DefineVehicleName.bind(this));
		});
		if (this._playerHq) {
			this._playerHq.OnDestroyed.On(() => {
				this.SaveRecord();
				this.GameStatusChanged.Invoke(this, GameStatus.Lost);
			});
			const foes = this._hqs.filter((hq) => hq !== this._playerHq);
			foes.forEach((foe) => {
				foe.OnDestroyed.On(() => {
					if (foes.every((e) => !e.IsAlive())) {
						this.SaveRecord();
						this.GameStatusChanged.Invoke(this, GameStatus.Won);
					}
				});
			});
		}

		this.StatsContext = new StatsContext(this);
	}

	private SaveRecord() {
		const record = this.RecordContext.GetRecord();
		const profil = this._playerProfilService.GetProfil();
		profil.Records.push(record);
	}

	public GetMapMode(): MapEnv {
		return this._mapContext.MapMode;
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

	private DefineVehicleName(src: Headquarter, vehicule: Vehicle): void {
		vehicule.Id = `${src.PlayerName}${this._vehicleCount}`;
		this._vehicleCount += 1;
		this._vehicles.Add(vehicule.Id, vehicule);
	}
}
