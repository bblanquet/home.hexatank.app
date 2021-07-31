import { Diamond } from '../../Items/Cell/Field/Diamond';
import { BrainArea } from './Utils/BrainArea';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
export interface IBrain {
	GetIaAreaByCell(): Dictionary<BrainArea>;
	GetDiamond(): Diamond;
	Update(): void;
	IsIa(): boolean;
}
