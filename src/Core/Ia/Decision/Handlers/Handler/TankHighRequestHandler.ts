import { Tank } from './../../../../Items/Unit/Tank';
import { IaArea } from '../../Utils/IaArea';
import { Brain } from '../../Brain';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { CellHelper } from '../../../../Items/Cell/CellHelper';
import { ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class TankHighRequestHandler implements ISimpleRequestHandler {
	constructor(private _kingdom: Brain, private _mediumRequest: ISimpleRequestHandler) {}

	Type(): RequestType {
		return RequestType.Tank;
	}
	Handle(request: AreaRequest): void {
		var troopAreas = this.GetReinforcement(request);

		troopAreas.forEach((area) => {
			while (area.HasTank()) {
				if (request.RequestCount === 0) {
					return;
				}
				if (!this.Assign(request, () => area.Drop())) {
					return;
				}
			}
		});

		if (0 < request.RequestCount) {
			this._mediumRequest.Handle(request);
		}

		if (0 < request.RequestCount) {
			this._kingdom.GetSquads().forEach((squad) => {
				while (squad.HasTank()) {
					if (!this.Assign(request, () => squad.Drop())) {
						return;
					}
				}
			});
		}
	}

	private Assign(request: AreaRequest, drop: () => Tank): boolean {
		if (request.Area.HasFreeUnitCell()) {
			const tank = drop();
			ErrorHandler.ThrowNull(tank);
			request.Area.Add(tank);
			request.RequestCount -= 1;
			return true;
		} else {
			return false;
		}
	}

	private GetReinforcement(request: AreaRequest) {
		const troopAreas = new Array<IaArea>();
		const kgAreas = this._kingdom.GetIaAreaByCell();
		const cells = CellHelper.OrderByDistance(
			kgAreas.Values().map((c) => c.GetCentralCell()),
			request.Area.GetCentralCell()
		);
		for (const cell of cells) {
			const coordinate = cell.Coo();
			if (this._kingdom.CellAreas.Exist(coordinate)) {
				const aroundArea = this._kingdom.CellAreas.Get(coordinate);
				if (!aroundArea.HasReceivedRequest) {
					aroundArea.HasReceivedRequest = true;
					if (aroundArea.HasTank()) {
						troopAreas.push(aroundArea);
					}
				}
			}
		}
		return troopAreas;
	}
}
