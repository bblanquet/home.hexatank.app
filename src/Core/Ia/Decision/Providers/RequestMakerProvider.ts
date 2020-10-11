import { Kingdom } from './../Kingdom';
import { FarmRequester } from './../RequestMaker/AreaRequester/FarmRequester';
import { IAreaRequestMaker } from '../RequestMaker/IAreaRequestMaker';
import { IRequestMakerProvider } from './IRequestMakerProvider';
import { ClearAreaRequester } from '../RequestMaker/AreaRequester/ClearAreaRequester';
import { HealUnitRequester } from '../RequestMaker/AreaRequester/HealUnitRequester';
import { ReactorRequester } from '../RequestMaker/AreaRequester/ReactorRequester';
import { RoadRequester } from '../RequestMaker/AreaRequester/RoadRequester';
import { ShieldAreaRequester } from '../RequestMaker/AreaRequester/ShieldAreaRequester';
import { ShieldBorderRequester } from '../RequestMaker/AreaRequester/ShieldBorderRequester';
import { TankRequester } from '../RequestMaker/AreaRequester/TankRequester';
import { TruckRequest } from '../RequestMaker/AreaRequester/TruckRequester';

export class RequestMakerProvider implements IRequestMakerProvider {
	constructor(private _kingdom: Kingdom) {}

	Get(): IAreaRequestMaker[] {
		return [
			new ShieldBorderRequester(),
			new ReactorRequester(),
			new ShieldAreaRequester(),
			new HealUnitRequester(this._kingdom),
			new ClearAreaRequester(),
			new TruckRequest(),
			new RoadRequester(),
			new FarmRequester(),
			new TankRequester()
		];
	}
}
