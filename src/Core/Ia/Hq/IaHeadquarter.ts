import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { Area } from '../Area/Area';
import { ItemSkin } from '../../Items/ItemSkin';
import { Cell } from '../../Items/Cell/Cell';
import { RequestPriority } from './RequestPriority';
import { isNullOrUndefined } from 'util';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { TruckPatrolOrder } from '../Order/TruckPatrolOrder';
import { HqFieldOrder } from '../Order/HqFieldOrder';
import { DiamondFieldOrder } from '../Order/DiamondFieldOrder';
import { Archive } from '../../Framework/ResourceArchiver';
import { AreaRequest } from '../Area/AreaRequest';
import { AreaStatus } from '../Area/AreaStatus';
import { RequestMaker } from './RequestMaker';
import { CenterDecisionMaker } from './CenterDecisionMaker';
import { Timer } from '../../Utils/Timer/Timer';
import { ExpansionMaker } from './ExpansionMaker';
import { IdleUnitContainer } from './IdleUnitContainer';
import { HeldArea } from '../Area/HeldArea';
import { Truck } from '../../Items/Unit/Truck';
import { PlaygroundHelper } from '../../Framework/PlaygroundHelper';
import { Explosion } from '../../Items/Unit/Explosion';
import { Tank } from '../../Items/Unit/Tank';
import { GameSettings } from '../../Framework/GameSettings';

export class IaHeadquarter extends Headquarter {
	public AreasBycell: { [id: string]: HeldArea };
	private _Areas: HeldArea[];
	private _trucks: Array<Truck>;
	private _requestHandler: CenterDecisionMaker;
	public Diamond: Diamond;
	private _timer: Timer;
	private _spreadStrategy: ExpansionMaker;
	public TankBalancer: IdleUnitContainer;

	constructor(public EmptyAreas: Area[], skin: ItemSkin, cell: Cell) {
		super(skin, cell);
		this._timer = new Timer(10);
		this._trucks = new Array<Truck>();
		this._Areas = new Array<HeldArea>();
		this.AreasBycell = {};
		this._requestHandler = new CenterDecisionMaker(this);
		this._spreadStrategy = new ExpansionMaker(this);
		this.TankBalancer = new IdleUnitContainer();
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		this._trucks = this._trucks.filter((t) => t.IsAlive());

		if (this._trucks.length === 0) {
			var truck = this.AddTruck();

			if (!isNullOrUndefined(truck)) {
				truck.SetOrder(
					new TruckPatrolOrder(
						truck,
						new HqFieldOrder(this, truck),
						new DiamondFieldOrder(this.Diamond, truck)
					)
				);
				this._trucks.push(truck);
			}
		}

		if (this._timer.IsElapsed()) {
			const statuses = new Array<AreaStatus>();

			this._Areas.forEach((conquestedArea) => {
				conquestedArea.HasReceivedRequest = false;
				conquestedArea.Update();
				statuses.push(conquestedArea.GetStatus());
			});

			this.TankBalancer.CalculateExcess(statuses);

			const requests: { [id: string]: Array<AreaRequest> } = {};
			requests[RequestPriority.Low] = new Array<AreaRequest>();
			requests[RequestPriority.Medium] = new Array<AreaRequest>();
			requests[RequestPriority.High] = new Array<AreaRequest>();

			statuses.forEach((status) => {
				let request = RequestMaker.GetRequest(status);
				if (request.Priority != RequestPriority.None) {
					requests[request.Priority].push(request);
				}
			});

			if (this.HasRequests(requests)) {
				this._requestHandler.HandleRequests(requests);
			} else {
				var area = this._spreadStrategy.FindArea();
				if (!isNullOrUndefined(area)) {
					if (this.GetAmount() >= GameSettings.TankPrice) {
						this.EmptyAreas.splice(this.EmptyAreas.indexOf(area), 1);
						let hqArea = new HeldArea(this, area);
						this._Areas.push(hqArea);
						this.AreasBycell[area.GetCentralCell().GetCoordinate().ToString()] = hqArea;
						console.log(
							`%c GET NEW AREA  ${hqArea.GetArea().GetCentralCell().GetCoordinate().ToString()}`,
							'font-weight:bold;color:green;'
						);
						this.BuyTankForArea(hqArea);
					}
				}
			}
		}
	}

	private HasRequests(requests: { [id: string]: AreaRequest[] }) {
		return (
			requests[RequestPriority.Low].length > 0 ||
			requests[RequestPriority.Medium].length > 0 ||
			requests[RequestPriority.High].length > 0
		);
	}

	private AddTruck(): Truck {
		let truck = null;
		this.Fields.some((field) => {
			if (!field.GetCell().IsBlocked()) {
				this.Buy(GameSettings.TruckPrice);
				if (field.GetCell().IsVisible()) {
					const explosion = new Explosion(
						field.GetCell().GetBoundingBox(),
						Archive.constructionEffects,
						5,
						false,
						5
					);
					PlaygroundHelper.Playground.Items.push(explosion);
				}
				this.VehicleId += 1;
				truck = new Truck(this);
				truck.Id = `${this.PlayerName}${this.VehicleId}`;
				truck.SetPosition(field.GetCell());
				PlaygroundHelper.VehiclesContainer.Add(truck);
				PlaygroundHelper.Playground.Items.push(truck);
				this.NotifyTruck(truck);
				return true;
			}
			return false;
		});

		return truck;
	}

	public BuyTankForArea(area: HeldArea): boolean {
		let isCreated = false;
		if (this.GetAmount() >= GameSettings.TankPrice) {
			for (let field of this.Fields) {
				if (!field.GetCell().IsBlocked()) {
					var cell = area.GetAvailablecell();
					if (!isNullOrUndefined(cell)) {
						this.Buy(GameSettings.TankPrice);
						if (field.GetCell().IsVisible()) {
							const explosion = new Explosion(
								field.GetCell().GetBoundingBox(),
								Archive.constructionEffects,
								5,
								false,
								5
							);
							PlaygroundHelper.Playground.Items.push(explosion);
						}
						this.VehicleId += 1;
						var tank = new Tank(this);
						tank.Id = `${this.PlayerName}${this.VehicleId}`;
						tank.SetPosition(field.GetCell());
						area.AddTroop(tank, cell);
						PlaygroundHelper.VehiclesContainer.Add(tank);
						PlaygroundHelper.Playground.Items.push(tank);
						isCreated = true;
						this.NotifyTank(tank);
						return true;
					}
				}
			}
		}
		return isCreated;
	}
}
