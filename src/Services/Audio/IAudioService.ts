import { IGameAudioManager } from '../../Core/Framework/Audio/IGameAudioManager';
export interface IAudioService {
	Register(gameAudioManager: IGameAudioManager): void;
	GetGameAudioManager(): IGameAudioManager;
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
	PlayLoungeMusic(): void;
}
