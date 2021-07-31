import { Tank } from './../../../../Items/Unit/Tank';
import { IaArea } from '../../Utils/IaArea';
import { Brain } from '../../Brain';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { CellHelper } from '../../../../Items/Cell/CellHelper';
import { ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class TankHighRequestHandler implements IHandler {
	private _delta: number = 0;

	constructor(private _kingdom: Brain, private _mediumRequest: IHandler) {}

	Handle(request: AreaRequest): void {
		this._delta = request.Area.Tanks.length - request.Area.GetFoesCount();
		var troopAreas = this.GetReinforcement(request);

		troopAreas.forEach((area) => {
			while (area.HasTank()) {
				if (this._delta === 0) {
					return;
				}
				if (!this.Assign(request, () => area.Drop())) {
					return;
				}
			}
		});

		if (0 < this._delta) {
			this._mediumRequest.Handle(request);
		}

		if (0 < this._delta) {
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
			this._delta -= 1;
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
