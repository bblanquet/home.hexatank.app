import { Hook } from './Hook';
import { LoadingState } from '../Model/LoadingState';
import { AudioService } from '../../Services/Audio/AudioService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { Singletons, SingletonKey } from '../../Singletons';
import { AssetLoader } from '../../Core/Framework/AssetLoader';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { AssetExplorer } from '../../Core/Framework/AssetExplorer';
import { SvgLoader } from '../../Core/Framework/SvgLoader';
import { route } from 'preact-router';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { SingletonContainer } from '../../SingletonContainer';
import { LoadingSentences } from '../Model/Text';
import { StateUpdater } from 'preact/hooks';

export class LoadingHook extends Hook<LoadingState> {
	private _sentenceIndex: number = 0;
	private _sentencePercentage: number = 0;

	constructor(d: [LoadingState, StateUpdater<LoadingState>]) {
		super(d[0], d[1]);
	}

	static DefaultState(): LoadingState {
		return new LoadingState(0, 0, 0, false);
	}

	public GetSentence(): string {
		return LoadingSentences[this._sentenceIndex];
	}

	public OnStart(): void {
		this.Update((e) => {
			e.IsLoading = true;
			e.Percentage = 0;
			e.Svg = 0;
			e.Audio = 0;
		});
		const svgLoad = new SvgLoader();
		const onLoaded = new AssetLoader(svgLoad, 150).LoadAll(new AssetExplorer().GetAssets());
		onLoaded.On((obj: any, percentage: number) => {
			const roundedPercentage = Math.round(percentage);
			if (roundedPercentage % 10 === 0 && roundedPercentage !== this._sentencePercentage) {
				this._sentencePercentage = roundedPercentage;
				this._sentenceIndex = (this._sentenceIndex + 1) % LoadingSentences.length;
			}
			this.SetSvg(percentage);
		});
		const audioService = new AudioService();
		Singletons.Register(SingletonKey.Audio, audioService);
		const audioLoad = new AudioLoader(audioService);
		const onAudioLoaded = new AssetLoader(audioLoad, 4).LoadAll(audioLoad.Audios());
		onLoaded.On((obj: any, percentage: number) => {
			const roundedPercentage = Math.round(percentage);
			if (roundedPercentage % 10 === 0 && roundedPercentage !== this._sentencePercentage) {
				this._sentencePercentage = roundedPercentage;
				this._sentenceIndex = (this._sentenceIndex + 1) % LoadingSentences.length;
			}
			this.SetAudio(percentage);
		});
	}

	public SetAudio(audio: number): void {
		const percentage = Math.round(audio / 2 + this.State.Svg / 2);
		this.Update((e) => {
			e.Percentage = percentage;
			e.Audio = audio;
		});
		this.Check(percentage);
	}

	public SetSvg(svg: number): void {
		const percentage = Math.round(svg / 2 + this.State.Audio / 2);
		this.Update((e) => {
			e.Percentage = percentage;
			e.Svg = svg;
		});
		this.Check(percentage);
	}

	Check(p: number) {
		if (p === 100) {
			new SingletonContainer().Register();
			SpriteProvider.SetLoaded(true);
			const profil = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
			const soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
			soundService.SetMute(profil.GetProfil().IsMute);
			soundService.PlayLoungeMusic();
			route('{{sub_path}}Home', true);
		}
	}

	public Unmount(): void {}
}
