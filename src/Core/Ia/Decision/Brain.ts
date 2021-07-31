import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { IExpansionMaker } from './ExpansionMaker/IExpansionMaker';
import { IBrain } from './IBrain';
import { Groups } from '../../../Utils/Collections/Groups';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { ExcessTankFinder } from './ExcessTankFinder';
import { AreaRequest } from './Utils/AreaRequest';
import { IaArea } from './Utils/IaArea';
import { Truck } from '../../Items/Unit/Truck';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Area } from './Utils/Area';
import { IHandlerIterator } from './Handlers/IHandlerIterator';
import { Tank } from '../../Items/Unit/Tank';
import { IAreaRequestIterator } from './Requests/IAreaRequestIterator';
import { IGlobalRequestIterator } from './Requests/Global/IGlobalRequestIterator';
import { Cell } from '../../Items/Cell/Cell';
import { Squad } from './Troop/Squad';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { ITimer } from '../../../Utils/Timer/ITimer';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';
import { RequestType } from './Utils/RequestType';

export class Brain implements IBrain {
	public AreaDecisions: IaArea[];
	public Squads: Squad[];
	public Trucks: Array<Truck> = new Array<Truck>();
	public Tanks: Array<Tank> = new Array<Tank>();
	public CellAreas: Dictionary<IaArea>;
	public IdleTanks: ExcessTankFinder;

	public HasDiamondRoad: boolean = false;
	private _idleTimer: ITimer = new TimeTimer(1000);
	private _requesters: IAreaRequestIterator;
	private _handlers: IHandlerIterator;
	private _expansionMaker: IExpansionMaker;
	private _globalRequester: IGlobalRequestIterator;
	public AllAreas: Area[];

	constructor(public Hq: Headquarter, public Areas: Area[], private _diamond: Diamond, private _isIa: boolean) {
		this.AreaDecisions = new Array<IaArea>();
		this.Squads = new Array<Squad>();
		this.CellAreas = new Dictionary<IaArea>();
		this.IdleTanks = new ExcessTankFinder();

		this.AllAreas = new Array<Area>();
		this.Areas.forEach((a) => {
			this.AllAreas.push(a);
		});

		this.Hq.OnVehicleCreated.On((hq: any, vehicle: Vehicle) => {
			if (vehicle instanceof Truck) {
				const truck = vehicle as Truck;
				this.Trucks.push(truck);
			} else {
				const tank = vehicle as Tank;
				this.Tanks.push(tank);
			}
		});
		this.Hq.OnReactorConquested.On((e: any, obj: ReactorField) => {
			const c = obj.GetCell();
			let area = this.Areas.filter((a) => a.Contains(c))[0];
			if (!isNullOrUndefined(area)) {
				this._expansionMaker.CreateArea(area);
			}
		});

		this.Hq.OnReactorLost.On((e: any, field: ReactorField) => {
			const cell = field.GetCell();
			let foundArea: IaArea = null;
			this.GetIaAreaByCell().Values().some((area) => {
				if (!area.HasCell(cell)) {
					foundArea = area;
					return true;
				}
				return false;
			});
			this.GetIaAreaByCell().Remove(foundArea.GetCentralCell().Coo());
			this.Areas.push(foundArea.GetSpot());
		});
	}
	IsIa(): boolean {
		return this._isIa;
	}

	public IsConquested(area: Area): boolean {
		return this.AreaDecisions.some((e) => e.GetSpot() === area);
	}

	public GetDecisionArea(cell: Cell): IaArea {
		const areas = this.AreaDecisions.filter((c) => c.HasCell(cell));
		if (0 < areas.length) {
			return areas[0];
		}
		return null;
	}

	public GetDiamond(): Diamond {
		return this._diamond;
	}

	GetSquads() {
		return this.Squads;
	}

	public Inject(
		expansionMaker: IExpansionMaker,
		globalRequesters: IGlobalRequestIterator,
		requesters: IAreaRequestIterator,
		handlers: IHandlerIterator
	) {
		this._handlers = handlers;
		this._requesters = requesters;
		this._expansionMaker = expansionMaker;
		this._globalRequester = globalRequesters;

		this._requesters.GetIds().concat(this._globalRequester.GetIds()).forEach((id) => {
			if (!this._handlers.Exist(id)) {
				ErrorHandler.Throw(
					ErrorCat.invalidComputation,
					`Handler unhandle ${id.Priority} ${RequestType[id.Type]}`
				);
			}
		});
	}

	public GetIaAreaByCell(): Dictionary<IaArea> {
		return Dictionary.To<IaArea>((t) => t.GetCentralCell().Coo(), this.AreaDecisions.map((m) => m));
	}

	public Update(): void {
		if (this._idleTimer.IsElapsed()) {
			this.Trucks = this.Trucks.filter((t) => t.IsAlive());
			this.Tanks = this.Tanks.filter((t) => t.IsAlive());
			this.Squads = this.Squads.filter((s) => !s.IsDone());
			this.Squads.forEach((squad) => {
				squad.Update();
			});
			const areas = new Array<IaArea>();
			this.AreaDecisions = this.AreaDecisions.filter((t) => !t.IsDestroyed());
			this.AreaDecisions.forEach((areaDecision) => {
				areaDecision.CalculateFoes();
				areaDecision.HasReceivedRequest = false;
				areas.push(areaDecision);
			});
			this.IdleTanks.CalculateExcess(areas);
			const requests = this.GetRequests(areas);
			this._handlers.Iterate(requests);
			this._expansionMaker.Expand();
		}
	}

	private GetRequests(areas: IaArea[]): Groups<AreaRequest> {
		const requests = new Groups<AreaRequest>();
		this._globalRequester.GetResquest(this).forEach((r) => {
			requests.Add(r.Priority, r);
		});

		areas.forEach((status) => {
			this._requesters.GetRequest(status).forEach((r) => {
				requests.Add(r.Priority, r);
			});
		});
		return requests;
	}
}
