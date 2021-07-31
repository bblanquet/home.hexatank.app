import { Tank } from './../../../../Items/Unit/Tank';
import { IaArea } from '../../Utils/IaArea';
import { Brain } from '../../Brain';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { CellHelper } from '../../../../Items/Cell/CellHelper';
import { ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class TankHighRequestHandler implements IHandler {
	constructor(private _brain: Brain, private _mediumRequest: IHandler) {}

	Handle(request: AreaRequest): void {
		var troopAreas = this.GetReinforcement(request);

		const isPassed = troopAreas.some((area) => {
			if (area.HasTank()) {
				return this.Assign(request, () => area.Drop());
			}
			return false;
		});

		if (!isPassed) {
			this._mediumRequest.Handle(request);
		}

		if (!isPassed) {
			this._brain.GetSquads().forEach((squad) => {
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
			return true;
		} else {
			return false;
		}
	}

	private GetReinforcement(request: AreaRequest) {
		const troopAreas = new Array<IaArea>();
		const kgAreas = this._brain.GetIaAreaByCell();
		const cells = CellHelper.OrderByDistance(
			kgAreas.Values().map((c) => c.GetCentralCell()),
			request.Area.GetCentralCell()
		);
		for (const cell of cells) {
			const coordinate = cell.Coo();
			if (this._brain.CellAreas.Exist(coordinate)) {
				const aroundArea = this._brain.CellAreas.Get(coordinate);
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
