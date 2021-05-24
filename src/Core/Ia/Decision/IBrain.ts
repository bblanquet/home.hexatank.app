import { Diamond } from '../../Items/Cell/Field/Diamond';
import { IaArea } from './Utils/IaArea';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
export interface IBrain {
	GetIaAreaByCell(): Dictionnary<IaArea>;
	GetDiamond(): Diamond;
	Update(): void;
}
