import { GameSoundManager } from '../../Core/Framework/Sound/GameSoundManager';
import { GameBlueprint } from '../../Core/Setup/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../Core/Setup/Context/GameContext';
export interface ISoundService {
	Register(mapContext: GameBlueprint, gameContext: GameContext): void;
	GetSoundManager(): GameSoundManager;
	Collect(): void;
	On(): void;
	Off(): void;
	Reload(): void;
	IsMute(): boolean;
	Play(content: string, volume: number, loop?: boolean): number | null;
	Stop(content: string, volume: number): void;
	PlayAgain(content: string, id?: number, volume?: number): void;
	Exist(content: string): boolean;
	Clear(): void;
	Pause(content: string, id?: number): void;
}
