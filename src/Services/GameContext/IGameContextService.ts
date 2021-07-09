import { IGameContext } from '../../Core/Framework/Context/IGameContext';
import { IBlueprint } from './../../Core/Framework/Blueprint/IBlueprint';
import { IGarbage } from '../IGarbage';
import { GameState } from '../../Core/Framework/Context/GameState';
import { ColorKind } from '../../Components/Common/Button/Stylish/ColorKind';
export interface IGameContextService<T extends IBlueprint, T1 extends IGameContext> extends IGarbage {
	Register(mapContext: T, Gamestate: GameState, skins?: ColorKind[]): void;
	Publish(): T1;
}
