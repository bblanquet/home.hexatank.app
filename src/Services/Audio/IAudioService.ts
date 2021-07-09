import { IGameAudioManager } from '../../Core/Framework/Audio/IGameAudioManager';
export interface IAudioService {
	Register(gameAudioManager: IGameAudioManager): void;
	GetGameAudioManager(): IGameAudioManager;
	On(): void;
	Off(): void;
	IsMute(): boolean;
	Play(content: string, volume: number, loop?: boolean): number | null;
	Stop(content: string, volume: number): void;
	PlayAgain(content: string, id?: number, volume?: number): void;
	Clear(): void;
	Pause(content: string, id?: number): void;
	PlayLoungeMusic(): void;
}
