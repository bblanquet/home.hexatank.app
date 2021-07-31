import { Dictionary } from '../../../../../../Utils/Collections/Dictionary';
import { IaArea } from '../../../Utils/IaArea';
import { Brain } from '../../../Brain';
import { IGlobalCondition } from '../IGlobalCondition';

export class EnergyUpCondition implements IGlobalCondition {
	Condition(brain: Brain): IaArea {
		const reactors = brain.Hq.GetReactors().filter((r) => r.GetPower() < 2);
		if (0 < reactors.length) {
			const reactor = reactors[0];
			const kingdomAreas = brain.CellAreas
				.Values()
				.map((c) => c)
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
				return areas[0];
			}
		}
		return null;
	}
}
