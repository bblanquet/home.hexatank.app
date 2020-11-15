import { GameSoundManager } from '../../Core/Framework/Sound/GameSoundManager';
import { GameContext } from './../../Core/Framework/GameContext';
export interface ISoundService {
	Register(gameContext: GameContext): void;
	GetSoundManager(): GameSoundManager;
}
