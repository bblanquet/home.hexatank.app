import { IGameworld } from '../../Core/Framework/World/IGameworld';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { IGarbage } from '../IGarbage';
import { GameState } from '../../Core/Framework/World/GameState';
import { ColorKind } from '../../Components/Common/Button/Stylish/ColorKind';
export interface IGameworldService<T extends IBlueprint, T1 extends IGameworld> extends IGarbage {
	Register(mapContext: T, Gamestate: GameState, skins?: ColorKind[]): void;
	Publish(): T1;
}
