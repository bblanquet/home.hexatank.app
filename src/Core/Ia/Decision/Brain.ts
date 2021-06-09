import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { MoneyOrder } from '../Order/Composite/MoneyOrder';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { IExpansionMaker } from './ExpansionMaker/IExpansionMaker';
import { IBrain } from './IBrain';
import { Groups } from '../../Utils/Collections/Groups';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { IAreaDecisionMaker } from './Area/IAreaDecisionMaker';
import { ExcessTankFinder } from './ExcessTankFinder';
import { AreaRequest } from './Utils/AreaRequest';
import { IaArea } from './Utils/IaArea';
import { Truck } from '../../Items/Unit/Truck';
import { TickTimer } from '../../Utils/Timer/TickTimer';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Area } from './Utils/Area';
import { IRequestHandler } from './RequestHandler/IRequestHandler';
import { Tank } from '../../Items/Unit/Tank';
import { IAreaRequestListMaker } from './RequestMaker/IAreaRequestListMaker';
import { IGeneralListRequester } from './RequestMaker/GeneralRequester/IGeneralListRequester';
import { Cell } from '../../Items/Cell/Cell';
import { Squad } from './Troop/Squad';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class Brain implements IBrain {
	public AreaDecisions: IAreaDecisionMaker[];
	public Squads: Squad[];
	public Trucks: Array<Truck> = new Array<Truck>();
	public Tanks: Array<Tank> = new Array<Tank>();
	public CellAreas: Dictionnary<IAreaDecisionMaker>;
	public IdleTanks: ExcessTankFinder;

	public HasDiamondRoad: boolean = false;
	private _diamond: Diamond;
	private _idleTimer: TickTimer = new TickTimer(25);
	private _requestMaker: IAreaRequestListMaker;
	private _requestHandler: IRequestHandler;
	private _expansionMaker: IExpansionMaker;
	private _generalRequestMaker: IGeneralListRequester;
	public AllAreas: Area[];

	constructor(public Hq: Headquarter, public Areas: Area[]) {
		this.AreaDecisions = new Array<IAreaDecisionMaker>();
		this.Squads = new Array<Squad>();
		this.CellAreas = new Dictionnary<IAreaDecisionMaker>();
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

		this.Hq.OnReactorLost.On((e: any, obj: ReactorField) => {
			const c = obj.GetCell();
			let foundArea: IaArea = null;
			this.GetIaAreaByCell().Values().some((area) => {
				if (!area.HasCell(c)) {
					foundArea = area;
					return true;
				}
				return false;
			});
			this.GetIaAreaByCell().Remove(foundArea.GetCentralCell().Coo());
			this.Areas.push(foundArea.GetSpot());
		});
	}

	public IsConquested(area: Area): boolean {
		return this.AreaDecisions.some((e) => e.Area.GetSpot() === area);
	}

	public SetDiamond(diamond: Diamond): void {
		this._diamond = diamond;
		this._diamond.OnDestroyed.On(this.DiamondDestroyed.bind(this));
	}

	public GetDecisionArea(cell: Cell): IaArea {
		const areas = this.AreaDecisions.filter((c) => c.Area.HasCell(cell));
		if (0 < areas.length) {
			return areas[0].Area;
		}
		return null;
	}

	private DiamondDestroyed(): void {
		this._diamond.OnDestroyed.Clear();
		this.Trucks.forEach((truck) => {
			truck.CancelOrder();
			truck.SetOrder(new MoneyOrder(truck));
		});
	}

	public GetDiamond(): Diamond {
		return this._diamond;
	}

	GetSquads() {
		return this.Squads;
	}

	public Setup(
		requestMaker: IAreaRequestListMaker,
		requestHandler: IRequestHandler,
		expansionMaker: IExpansionMaker,
		generalRequestMaker: IGeneralListRequester
	) {
		this._requestHandler = requestHandler;
		this._requestMaker = requestMaker;
		this._expansionMaker = expansionMaker;
		this._generalRequestMaker = generalRequestMaker;
	}

	public GetIaAreaByCell(): Dictionnary<IaArea> {
		return Dictionnary.To<IaArea>((t) => t.GetCentralCell().Coo(), this.AreaDecisions.map((m) => m.Area));
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
				areaDecision.Area.CalculateFoes();
				areaDecision.HasReceivedRequest = false;
				areaDecision.Update();
				areas.push(areaDecision.Area);
			});
			this.IdleTanks.CalculateExcess(areas);
			const requests = this.GetRequests(areas);
			this.Log(requests);
			if (requests.Any()) {
				this._requestHandler.HandleRequests(requests);
			}
			this._expansionMaker.Expand();
		}
	}

	private GetRequests(areas: IaArea[]): Groups<AreaRequest> {
		const requests = new Groups<AreaRequest>();
		this._generalRequestMaker.GetResquest(this).forEach((r) => {
			requests.Add(r.Priority, r);
		});

		areas.forEach((status) => {
			this._requestMaker.GetRequest(status).forEach((r) => {
				requests.Add(r.Priority, r);
			});
		});
		return requests;
	}

	private Log(requests: Groups<AreaRequest>) {
		// const hCount = requests.Exist(RequestPriority.High) ? requests.Get(RequestPriority.High).length : 0;
		// const hTypes = requests.Exist(RequestPriority.High)
		// 	? requests.Get(RequestPriority.High).map((c) => c.RequestType)
		// 	: '';
		// const mCount = requests.Exist(RequestPriority.Medium) ? requests.Get(RequestPriority.Medium).length : 0;
		// const mTypes = requests.Exist(RequestPriority.Medium)
		// 	? requests.Get(RequestPriority.Medium).map((c) => c.RequestType)
		// 	: '';
		// console.log(
		// 	`%c [MONEY] ${this.Hq.Identity.Name[this.Hq.Identity.Name.length - 1]} - ${this.Hq.GetAmount()}`,
		// 	'font-weight:bold;color:#940c0c;'
		// );
		// console.log(`%c [H] ${hCount} ${hTypes.toString()} `, 'font-weight:bold;color:#94570c;');
		// console.log(`%c [M] ${mCount} ${mTypes.toString()} `, 'font-weight:bold;color:#94770c;');
		// console.log(`%c ----------------------- `, 'font-weight:bold;color:#94770c;');
	}
}

// const mCount = requests.Exist(RequestPriority.Medium) ? requests.Get(RequestPriority.Medium).length : 0;
// const lCount = requests.Exist(RequestPriority.Low) ? requests.Get(RequestPriority.Low).length : 0;
