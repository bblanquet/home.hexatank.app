import { Diamond } from '../../Items/Cell/Field/Diamond';
import { IaArea } from './Utils/IaArea';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
export interface IBrain {
	GetIaAreaByCell(): Dictionary<IaArea>;
	GetDiamond(): Diamond;
	Update(): void;
	IsIa(): boolean;
}
