import { Headquarter } from './Headquarter';
import { ReactorField } from './../Bonus/ReactorField';
import { BatteryField } from './../Bonus/BatteryField';
import { ElectronLink } from './ElectronLink';
import { Item } from '../../../Item';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { AStarEngine } from '../../../../Ia/AStarEngine';

export class ElectronNetwork extends Item {
	private _electronLinks: ElectronLink[] = new Array<ElectronLink>();

	constructor(hq: Headquarter, battery: BatteryField, target: ReactorField) {
		super();
		const reactorPaths: ReactorField[][] = [];
		const sources = hq.GetReactors().filter((r) => r.IsCovered(battery.GetCell()));
		sources.forEach((source) => {
			var path = new AStarEngine<ReactorField>((e) => true, (e) => 1).GetPath(source, target);
			path.splice(0, 0, source);
			reactorPaths.push(path);
		});

		var min = Math.min(...reactorPaths.map((c) => c.length));
		const shortestPath = reactorPaths.find((e) => e.length === min);
		const pairs = new Array<ReactorField>();
		shortestPath.forEach((reactor) => {
			pairs.push(reactor);
			if (pairs.length === 2) {
				this._electronLinks.push(new ElectronLink(pairs[0].GetCell(), pairs[1].GetCell()));
				pairs.shift();
			}
		});
	}

	public GetBoundingBox(): BoundingBox {
		return new BoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		this._electronLinks.forEach((e) => {
			e.Update(viewX, viewY);
		});
	}
}
