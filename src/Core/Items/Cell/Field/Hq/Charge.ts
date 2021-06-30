import { ReactorField } from '../Bonus/ReactorField';
import { BatteryField } from '../Bonus/BatteryField';
import { ChargeLink } from './ChargeLink';
import { Item } from '../../../Item';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { AStarEngine } from '../../../../Ia/AStarEngine';
import { Cell } from '../../Cell';
import { IHeadquarter } from './IHeadquarter';

export class Charge extends Item {
	private _links: ChargeLink[] = new Array<ChargeLink>();
	private _reactorPath: ReactorField[];
	private _ref: any;
	constructor(hq: IHeadquarter, private _battery: BatteryField, private _target: ReactorField) {
		super();
		const reactorPaths: ReactorField[][] = [];
		const sources = hq.GetReactors().filter((r) => r.IsCovered(_battery.GetCell()));
		sources.forEach((source) => {
			var path = new AStarEngine<ReactorField>((e) => true, (e) => 1).GetPath(source, _target);
			if (path) {
				path.splice(0, 0, source);
				reactorPaths.push(path);
			}
		});

		var min = Math.min(...reactorPaths.map((c) => c.length));
		this._reactorPath = reactorPaths.find((e) => e.length === min);
		const pairs = new Array<ReactorField>();
		this._reactorPath.forEach((reactor) => {
			pairs.push(reactor);
			if (pairs.length === 2) {
				this._links.push(new ChargeLink(pairs[0].GetCell(), pairs[1].GetCell()));
				pairs.shift();
			}
			this._ref = this.ReactorLost.bind(this);
			reactor.OnDestroyed.On(this._ref);
		});
		this._battery.SetUsed(true);
	}

	private ReactorLost(source: any, r: Item) {
		this.Destroy();
	}

	public Destroy(): void {
		super.Destroy();
		this._reactorPath.forEach((e) => {
			if (e.IsUpdatable) {
				e.OnLost.Off(this._ref);
			}
		});

		if (this._battery.IsUpdatable) {
			this._battery.SetUsed(false);
			this._links.forEach((link) => {
				link.Destroy();
			});
			this._links = [];
		}
	}

	public GetDistance(): number {
		return this.GetCell().GetDistance(this._target.GetCell());
	}

	public GetCell(): Cell {
		return this._battery.GetCell();
	}

	public GetBoundingBox(): BoundingBox {
		return new BoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		this._links.forEach((e) => {
			e.Update(viewX, viewY);
		});
	}
}
