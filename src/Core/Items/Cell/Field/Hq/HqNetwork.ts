import { ReactorField } from './../Bonus/ReactorField';
import { HqNetworkLink } from './HqNetworkLink';
import { IHeadquarter } from './IHeadquarter';

export class HqNetwork {
	private _links: HqNetworkLink[];

	constructor(private _hq: IHeadquarter) {
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
}
