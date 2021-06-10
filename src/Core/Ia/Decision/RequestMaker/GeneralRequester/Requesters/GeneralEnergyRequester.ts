import { Dictionnary } from './../../../../../Utils/Collections/Dictionnary';
import { IaArea } from '../../../Utils/IaArea';
import { IGeneralRequester } from './../IGeneralRequester';
import { Brain } from '../../../Brain';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';

export class GeneralEnergyRequester implements IGeneralRequester {
	constructor(private _priority: number) {}

	GetResquest(kingdom: Brain): AreaRequest {
		const reactors = kingdom.Hq.GetReactors().filter((r) => r.GetPower() === 0 && r.HasStock() === false);
		if (0 < reactors.length) {
			const reactor = reactors[0];
			const kingdomAreas = kingdom.CellAreas.Values().map((c) => c.Area).filter((a) => a.HasFreeFields());
			const candidates = new Dictionnary<IaArea>();

			reactor.GetInternal().Values().forEach((c) =>
				kingdomAreas.filter((a) => a.HasCell(c)).forEach((a) => {
					if (!candidates.Exist(a.GetCentralCell().Coo())) {
						candidates.Add(a.GetCentralCell().Coo(), a);
					}
				})
			);

			if (!candidates.IsEmpty()) {
				return new AreaRequest(RequestType.Energy, '10', 1, candidates.Values()[0]);
			}
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
