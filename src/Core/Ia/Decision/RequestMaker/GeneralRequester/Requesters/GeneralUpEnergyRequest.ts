import { Dictionnary } from '../../../../../Utils/Collections/Dictionnary';
import { IaArea } from '../../../Utils/IaArea';
import { IGeneralRequester } from '../IGeneralRequester';
import { GlobalIa } from '../../../GlobalIa';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';

export class GeneralUpEnergyRequester implements IGeneralRequester {
	constructor(private _priority: number) {}

	GetResquest(kingdom: GlobalIa): AreaRequest {
		const reactors = kingdom.Hq.GetReactors().filter((r) => r.GetPower() < 2);
		if (0 < reactors.length) {
			const reactor = reactors[0];
			const kingdomAreas = kingdom.CellAreas.Values().map((c) => c.Area).filter((a) => a.HasFreeFields());
			const candidates = new Dictionnary<IaArea>();

			reactor.GetInternal().All().forEach((c) =>
				kingdomAreas.filter((a) => a.HasCell(c)).forEach((a) => {
					if (!candidates.Exist(a.GetCentralCell().Coo())) {
						candidates.Add(a.GetCentralCell().Coo(), a);
					}
				})
			);

			if (!candidates.IsEmpty()) {
				return new AreaRequest(RequestType.Energy, this._priority.toString(), 1, candidates.Values()[0]);
			}
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
