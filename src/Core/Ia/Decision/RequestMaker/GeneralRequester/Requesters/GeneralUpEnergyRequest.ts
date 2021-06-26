import { Dictionary } from '../../../../../Utils/Collections/Dictionary';
import { IaArea } from '../../../Utils/IaArea';
import { IGeneralRequester } from '../IGeneralRequester';
import { Brain } from '../../../Brain';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';

export class GeneralUpEnergyRequester implements IGeneralRequester {
	constructor(private _priority: number) {}

	GetResquest(kingdom: Brain): AreaRequest {
		const reactors = kingdom.Hq.GetReactors().filter((r) => r.GetPower() < 2);
		if (0 < reactors.length) {
			const reactor = reactors[0];
			const kingdomAreas = kingdom.CellAreas
				.Values()
				.map((c) => c.Area)
				.filter((a) => a.HasFreeFields() && a.GetInnerFoeCount() === 0);
			let candidates = new Dictionary<IaArea>();

			reactor.GetInternal().Values().forEach((c) =>
				kingdomAreas.filter((a) => a.HasCell(c)).forEach((a) => {
					if (!candidates.Exist(a.GetCentralCell().Coo())) {
						candidates.Add(a.GetCentralCell().Coo(), a);
					}
				})
			);
			const areas = candidates.Values().filter((a) => 0 < a.GetFreeCoveredCells().length);
			if (0 < areas.length) {
				return new AreaRequest(RequestType.Energy, this._priority.toString(), 1, areas[0]);
			}
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
