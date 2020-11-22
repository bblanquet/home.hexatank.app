import { GameSoundManager } from '../../Core/Framework/Sound/GameSoundManager';
import { GameContext } from './../../Core/Framework/GameContext';
export interface ISoundService {
	Register(gameContext: GameContext): void;
	GetSoundManager(): GameSoundManager;
	Collect(): void;
	On(): void;
	Off(): void;
	IsMute(): boolean;
	Play(content: string, volume: number, loop?: boolean): number | null;
	Stop(content: string, volume: number): void;
	PlayAgain(content: string, id?: number, volume?: number): void;
	Exist(content: string): boolean;
	Clear(): void;
	Pause(content: string, id?: number): void;
}
