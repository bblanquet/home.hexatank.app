import { MoneyOrder } from './../Order/MoneyOrder';
import { IGeneralRequester } from './RequestMaker/GeneralRequester/IGeneralRequester';
import { Diamond } from './../../Items/Cell/Field/Diamond';
import { IExpansionMaker } from './ExpansionMaker/IExpansionMaker';
import { IKingdomDecisionMaker } from './IKingdomDecisionMaker';
import { IDoable } from './IDoable';
import { Groups } from '../../Utils/Collections/Groups';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { IAreaDecisionMaker } from './Area/IAreaDecisionMaker';
import { IdleUnitContainer } from './IdleUnitContainer';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { AreaRequest } from './Utils/AreaRequest';
import { RequestPriority } from './Utils/RequestPriority';
import { KingdomArea } from './Utils/KingdomArea';
import { Truck } from '../../Items/Unit/Truck';
import { Timer } from '../../Utils/Timer/Timer';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Area } from './Utils/Area';
import { IRequestHandler } from './RequestHandler/IRequestHandler';
import { Tank } from '../../Items/Unit/Tank';
import { IAreaRequestListMaker } from './RequestMaker/IAreaRequestListMaker';
import { RequestType } from './Utils/RequestType';
import { IGeneralListRequester } from './RequestMaker/GeneralRequester/IGeneralListRequester';

export class Kingdom implements IDoable, IKingdomDecisionMaker {
	public AreaDecisions: IAreaDecisionMaker[];
	public Trucks: Array<Truck> = new Array<Truck>();
	public Tanks: Array<Tank> = new Array<Tank>();
	public CellAreas: Dictionnary<IAreaDecisionMaker>;
	private _diamond: Diamond;
	private _idleTimer: Timer = new Timer(25);
	public IdleTanks: IdleUnitContainer;
	private _requestMaker: IAreaRequestListMaker;
	private _requestHandler: IRequestHandler;
	private _expansionMaker: IExpansionMaker;
	private _generalRequestMaker: IGeneralListRequester;

	constructor(private _hq: Headquarter, public RemainingAreas: Area[]) {
		this.AreaDecisions = new Array<IAreaDecisionMaker>();
		this.CellAreas = new Dictionnary<IAreaDecisionMaker>();
		this.IdleTanks = new IdleUnitContainer();

		this._hq.OnVehiculeCreated.On((hq: any, vehicle: Vehicle) => {
			if (vehicle instanceof Truck) {
				const truck = vehicle as Truck;
				this.Trucks.push(truck);
			} else {
				const tank = vehicle as Tank;
				this.Tanks.push(tank);
			}
		});
	}

	public SetDiamond(diamond: Diamond): void {
		this._diamond = diamond;
		this._diamond.OnDestroyed.On(this.DiamondDestroyed.bind(this));
	}

	private DiamondDestroyed(): void {
		this._diamond.OnDestroyed.Clear();
		this.Trucks.forEach((truck) => {
			truck.SetOrder(new MoneyOrder(truck));
		});
	}

	public GetDiamond(): Diamond {
		return this._diamond;
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

	public GetKingdomAreas(): Dictionnary<KingdomArea> {
		return Dictionnary.To<KingdomArea>(
			(t) => t.GetCentralCell().GetCoordinate().ToString(),
			this.AreaDecisions.map((m) => m.Area)
		);
	}

	public Do(): void {
		this.Trucks = this.Trucks.filter((t) => t.IsAlive());
		this.Tanks = this.Tanks.filter((t) => t.IsAlive());

		if (this._idleTimer.IsElapsed()) {
			const areas = new Array<KingdomArea>();

			this.AreaDecisions.forEach((areaDecision) => {
				areaDecision.HasReceivedRequest = false;
				areaDecision.Update();
				areas.push(areaDecision.Area);
			});

			this.IdleTanks.CalculateExcess(areas);
			const requests = this.GetRequests(areas);

			this.Log(requests);

			if (requests.Any()) {
				this._requestHandler.HandleRequests(requests);
			} else {
				this._expansionMaker.Expand();
			}
		}
	}

	private GetRequests(areas: KingdomArea[]) {
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
		const hCount = requests.Exist(RequestPriority.High) ? requests.Get(RequestPriority.High).length : 0;
		const hTypes = requests.Exist(RequestPriority.High)
			? requests.Get(RequestPriority.High).map((c) => c.RequestType)
			: '';
		// const mCount = requests.Exist(RequestPriority.Medium) ? requests.Get(RequestPriority.Medium).length : 0;
		// const lCount = requests.Exist(RequestPriority.Low) ? requests.Get(RequestPriority.Low).length : 0;
		console.log(
			`%c [MONEY] ${this._hq.GetAmount()} [A] ${this.AreaDecisions.length} [H] ${hCount} ${hTypes.toString()} `,
			'font-weight:bold;color:red;'
		);
	}
}
