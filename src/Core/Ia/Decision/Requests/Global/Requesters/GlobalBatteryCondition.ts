import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';
import { Dictionary } from '../../../../../../Utils/Collections/Dictionary';
import { IGlobalCondition } from '../IGlobalCondition';

export class GlobalBatteryCondition implements IGlobalCondition {
	Condition(brain: Brain): IaArea {
		const reactors = brain.Hq.GetReactors().filter((r) => r.GetPower() === 0 && r.HasStock() === false);
		if (0 < reactors.length) {
			const reactor = reactors[0];
			const kingdomAreas = brain.CellAreas.Values().filter((a) => a.HasFreeFields());
			const candidates = new Dictionary<IaArea>();

			reactor.GetInternal().Values().forEach((c) =>
				kingdomAreas.filter((a) => a.HasCell(c)).forEach((a) => {
					if (!candidates.Exist(a.GetCentralCell().Coo())) {
						candidates.Add(a.GetCentralCell().Coo(), a);
					}
				})
			);

			if (!candidates.IsEmpty()) {
				return candidates.Values()[0];
			}
		}
		return null;
	}
}
