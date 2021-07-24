import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IBrain } from '../Decision/IBrain';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
export interface IBrainProvider {
	GetBrain(hq: Headquarter, hqs: IHeadquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain;
}
