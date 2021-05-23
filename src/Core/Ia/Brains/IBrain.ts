import { GameContext } from '../../Framework/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IGlobalIa } from './../Decision/IGlobalIa';
export interface IBrain {
	GetBrain(hq: Headquarter, context: GameContext, areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IGlobalIa;
}
