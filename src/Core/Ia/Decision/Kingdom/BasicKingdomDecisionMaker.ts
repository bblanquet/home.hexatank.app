import { GameSettings } from './../../../Framework/GameSettings';
import { IDoable } from './../IDoable';
import { Groups } from './../../../Utils/Collections/Groups';
import { Dictionnary } from './../../../Utils/Collections/Dictionnary';
import { BasicAreaDecisionMaker } from './../Area/BasicAreaDecisionMaker';
import { ExpansionMaker } from './ExpansionMaker';
import { IdleUnitContainer } from './../../Hq/IdleUnitContainer';
import { Headquarter } from './../../../Items/Cell/Field/Headquarter';
import { TruckPatrolOrder } from './../../Order/TruckPatrolOrder';
import { isNullOrUndefined } from 'util';
import { HqFieldOrder } from '../../Order/HqFieldOrder';
import { DiamondFieldOrder } from '../../Order/DiamondFieldOrder';
import { AreaStatus } from '../../Utils/AreaStatus';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestPriority } from '../../Hq/RequestPriority';
import { KingdomArea } from '../../Utils/KingdomArea';
import { Truck } from '../../../Items/Unit/Truck';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { Timer } from '../../../Utils/Timer/Timer';
import { Tank } from '../../../Items/Unit/Tank';
import { BasicRequestHandler } from './BasicRequestHandler';
import { RequestMaker } from '../../Hq/RequestMaker';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Area } from '../../Utils/Area';
import { CellContext } from '../../../Items/Cell/CellContext';
import { Cell } from '../../../Items/Cell/Cell';

export class BasicKingdomDecisionMaker implements IDoable {
	private _areaDecisions: BasicAreaDecisionMaker[];
	private _trucks: Array<Truck>;
	private _requestHandler: BasicRequestHandler;
	public CellAreas: Dictionnary<KingdomArea>;

	public Diamond: Diamond;
	private _timer: Timer;
	private _spreadStrategy: ExpansionMaker;
	public IdleTanks: IdleUnitContainer;

	constructor(private _hq: Headquarter, private _cells: CellContext<Cell>, public EmptyAreas: Area[]) {
		this._timer = new Timer(10);
		this._trucks = new Array<Truck>();
		this._areaDecisions = new Array<BasicAreaDecisionMaker>();
		this.CellAreas = new Dictionnary<KingdomArea>();
		this._requestHandler = new BasicRequestHandler(this, _cells);
		this._spreadStrategy = new ExpansionMaker(this._hq, this);
		this.IdleTanks = new IdleUnitContainer();
		this._hq.OnVehiculeCreated.On((hq: any, vehicle: Vehicle) => {
			if (vehicle instanceof Truck) {
				const truck = vehicle as Truck;
				truck.SetOrder(
					new TruckPatrolOrder(
						truck,
						new HqFieldOrder(this._hq, truck),
						new DiamondFieldOrder(this.Diamond, truck)
					)
				);
				this._trucks.push(truck);
			}
		});
	}

	public Do(): void {
		this._trucks = this._trucks.filter((t) => t.IsAlive());

		if (this._trucks.length === 0) {
			this._hq.CreateTruck();
		}

		if (this._timer.IsElapsed()) {
			const statuses = new Array<AreaStatus>();

			this._areaDecisions.forEach((areaDecision) => {
				areaDecision.Area.HasReceivedRequest = false;
				areaDecision.Update();
				statuses.push(areaDecision.Area.GetStatus());
			});

			this.IdleTanks.CalculateExcess(statuses);

			const requests = new Groups<AreaRequest>();

			statuses.forEach((status) => {
				let request = RequestMaker.GetRequest(status);
				if (request.Priority != RequestPriority.None) {
					requests.Add(request.Priority, request);
				}
			});

			if (requests.Any()) {
				this._requestHandler.HandleRequests(requests);
			} else {
				var area = this._spreadStrategy.FindArea();
				if (!isNullOrUndefined(area)) {
					if (this._hq.GetAmount() >= GameSettings.TankPrice) {
						this.CreateArea(area);
					}
				}
			}
		}
	}

	private CreateArea(area: Area) {
		this.EmptyAreas.splice(this.EmptyAreas.indexOf(area), 1);
		const areaDecision = new BasicAreaDecisionMaker(new KingdomArea(this._hq, area, this._cells), this._cells);
		this._areaDecisions.push(areaDecision);
		this.CellAreas.Add(area.GetCentralCell().GetCoordinate().ToString(), areaDecision.Area);
		this.Log(areaDecision);
		this.BuyTankForArea(areaDecision.Area);
	}

	private Log(areaDecision: BasicAreaDecisionMaker) {
		console.log(
			`%c GET NEW AREA  ${areaDecision.Area.GetArea().GetCentralCell().GetCoordinate().ToString()}`,
			'font-weight:bold;color:green;'
		);
	}

	public BuyTankForArea(area: KingdomArea): boolean {
		let isCreated = false;
		var cell = area.GetRandomFreeCell();
		if (!isNullOrUndefined(cell) && this._hq.Buy(GameSettings.TankPrice)) {
			var lambda: any = function(obj: any, vehicle: Vehicle) {
				if (vehicle instanceof Tank) {
					const tank = vehicle as Tank;
					area.AddTroop(tank, cell);
				}
			};
			this._hq.OnVehiculeCreated.On(lambda);

			this._hq.CreateTank();
			this._hq.OnVehiculeCreated.On(lambda);
		}

		return isCreated;
	}
}
