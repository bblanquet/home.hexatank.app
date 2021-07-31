import { Brain } from '../../../Brain';
import { BrainArea } from '../../../Utils/BrainArea';
import { Dictionary } from '../../../../../../Utils/Collections/Dictionary';
import { IGlobalCondition } from '../IGlobalCondition';
import { GlobalRequestResult } from '../GlobalRequestResult';

export class GlobalBatteryCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		const noJuiceReactors = brain.Hq.GetReactors().filter((r) => r.GetPower() === 0 && r.HasStock() === false);
		if (0 < noJuiceReactors.length) {
			const noJuiceReactor = noJuiceReactors[0];
			const iaAreas = brain.CellAreas.Values().filter((a) => a.HasFreeFields());
			const candidates = new Dictionary<BrainArea>();

			noJuiceReactor.GetInternal().Values().forEach((c) =>
				iaAreas.filter((a) => a.HasCell(c)).forEach((a) => {
					if (!candidates.Exist(a.GetCentralCell().Coo())) {
						candidates.Add(a.GetCentralCell().Coo(), a);
					}
				})
			);

			if (!candidates.IsEmpty()) {
				return new GlobalRequestResult(true, candidates.Values()[0]);
			}
		}
		return new GlobalRequestResult(false, null);
	}
}
