import { Diamond } from '../../Items/Cell/Field/Diamond';
import { IaArea } from './Utils/IaArea';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
export interface IGlobalIa {
	GetIaAreaByCell(): Dictionnary<IaArea>;
	GetDiamond(): Diamond;
	Update(): void;
}
