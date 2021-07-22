import { LatencyUp } from '../../Items/Unit/PowerUp/LatencyUp';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { BasicOrder } from '../../Ia/Order/BasicOrder';
import { Cell } from '../../Items/Cell/Cell';
import { LatencyCondition } from '../../Items/Unit/PowerUp/Condition/LatencyCondition';
import { VehicleStatus } from './VehicleStatus';
import { GameContext } from '../Context/GameContext';
export class PathResolver {
	constructor(private _context: GameContext) {}

	public Resolve(vehicle: Vehicle, road: string[], cid: string, nextCid: string, latency: number): string {
		let message = '';
		const cells = this._context.GetCellDictionary();
		const path = road.map((coo) => cells.Get(coo));
		const status = new VehicleStatus(vehicle, cid, nextCid);
		if (status.IsDiverging() || status.IsUnsync()) {
			const cell = cells.Get(cid);
			const nextCell = nextCid ? cells.Get(nextCid) : null;
			vehicle.ResetCell(cell, nextCell);
			if (status.IsDiverging()) {
				message = `next ${vehicle.GetNextCell() ? vehicle.GetNextCell().Coo() : 'none'} ! ${nextCell
					? nextCell
					: 'none'}`;
			} else if (status.IsUnsync()) {
				message = `current ${vehicle.GetCurrentCell().Coo()} ! ${cid}`;
			}
		}

		if (path && 0 < path.length) {
			const order = new BasicOrder(vehicle, path);
			vehicle.GiveOrder(order);
			this.LatencyCompensation(latency, vehicle, order, path);
		} else {
			vehicle.CancelOrder();
		}
		return message;
	}

	private LatencyCompensation(latency: number, vehicle: Vehicle, order: BasicOrder, path: Cell[]) {
		if (latency && 0 < latency) {
			vehicle.AddPowerUp(new LatencyUp(vehicle, new LatencyCondition(vehicle, order), latency / path.length));
		}
	}
}
