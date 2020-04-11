import { Diamond } from './../../Items/Cell/Field/Diamond';
import { IExpansionMaker } from './ExpansionMaker/IExpansionMaker';
import { IKingdomDecisionMaker } from './IKingdomDecisionMaker';
import { IDoable } from './IDoable';
import { Groups } from '../../Utils/Collections/Groups';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { BasicAreaDecisionMaker } from './Area/BasicAreaDecisionMaker';
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
import { IRequestMaker } from './RequestMaker/IRequestMaker';
import { Tank } from '../../Items/Unit/Tank';

export class Kingdom implements IDoable, IKingdomDecisionMaker {
	public AreaDecisions: BasicAreaDecisionMaker[];
	public Trucks: Array<Truck> = new Array<Truck>();
	public Tanks: Array<Tank> = new Array<Tank>();
	public CellAreas: Dictionnary<BasicAreaDecisionMaker>;
	public Diamond: Diamond;
	private _idleTimer: Timer = new Timer(125);
	public IdleTanks: IdleUnitContainer;
	private _requestMaker: IRequestMaker;
	private _requestHandler: IRequestHandler;
	private _expansionMaker: IExpansionMaker;

	constructor(private _hq: Headquarter, public RemainingAreas: Area[]) {
		this.AreaDecisions = new Array<BasicAreaDecisionMaker>();
		this.CellAreas = new Dictionnary<BasicAreaDecisionMaker>();
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
	public GetDiamond(): Diamond {
		return this.Diamond;
	}

	public Setup(requestMaker: IRequestMaker, requestHandler: IRequestHandler, expansionMaker: IExpansionMaker) {
		this._requestHandler = requestHandler;
		this._requestMaker = requestMaker;
		this._expansionMaker = expansionMaker;
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

			const requests = new Groups<AreaRequest>();

			areas.forEach((status) => {
				let request = this._requestMaker.GetRequest(status);
				if (request.Priority != RequestPriority.None) {
					requests.Add(request.Priority, request);
				}
			});

			const hCount = requests.Exist(RequestPriority.High) ? requests.Get(RequestPriority.High).length : 0;
			const mCount = requests.Exist(RequestPriority.Medium) ? requests.Get(RequestPriority.Medium).length : 0;
			const lCount = requests.Exist(RequestPriority.Low) ? requests.Get(RequestPriority.Low).length : 0;
			console.log(
				`%c [MONEY] ${this._hq.GetAmount()} [A] ${this.AreaDecisions
					.length} [H] ${hCount} [M] ${mCount} [L] ${lCount}`,
				'font-weight:bold;color:red;'
			);

			if (requests.Any()) {
				this._requestHandler.HandleRequests(requests);
			} else {
				this._expansionMaker.Expand();
			}
		}
	}
}
