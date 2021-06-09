import { ReactorField } from './../Bonus/ReactorField';
import { Headquarter } from './Headquarter';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { HqNetworkLink } from './HqNetworkLink';

export class HqNetwork extends Item {
	private _links: HqNetworkLink[];

	constructor(private _hq: Headquarter) {
		super();
		this._links = new Array<HqNetworkLink>();
		this._hq.OnReactorAdded.On(this.ReactorAdded.bind(this));
	}

	private ReactorAdded(source: any, reactor: ReactorField): void {
		const otherReactors = this._hq.GetReactors().filter((e) => e !== reactor);
		otherReactors.forEach((otherReactor) => {
			if (otherReactor.IsCovered(reactor.GetCell())) {
				this._links.push(new HqNetworkLink(otherReactor, reactor));
			}
		});
	}

	public GetBoundingBox(): BoundingBox {
		throw new Error('Method not implemented.');
	}

	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		this._links.forEach((link) => {
			link.Update(viewX, viewY);
		});
	}
}
