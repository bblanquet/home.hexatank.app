import { Howl } from 'howler';
import { IGameAudioManager } from '../../Core/Framework/Audio/IGameAudioManager';
export interface IAudioService {
	Add(path: string, howl: Howl): void;
	Register(gameAudioManager: IGameAudioManager): void;
	GetGameAudioManager(): IGameAudioManager;
	SetMute(value: boolean): void;
	IsMute(): boolean;
	IsPlaying(content: string): boolean;
	Play(content: string, volume: number, loop?: boolean): number | null;
	Stop(content: string, volume: number): void;
	PlayAgain(content: string, id?: number, volume?: number): void;
	Clear(): void;
	Pause(content: string, id?: number): void;
}
