import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { AssetLoader } from '../../Core/Framework/AssetLoader';
import { AudioLoader } from '../../Core/Framework/AudioLoader';
import { AssetExplorer } from '../../Core/Framework/AssetExplorer';
import { SvgLoader } from '../../Core/Framework/SvgLoader';
import { LoadingSentences } from '../Model/Text';
import { SingletonContainer } from '../../SingletonContainer';
import Background from '../Components/Background';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { Singletons, SingletonKey } from '../../Singletons';
import Switch from '../Common/Struct/Switch';
import { AudioService } from '../../Services/Audio/AudioService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';

export default class LoadingScreen extends Component<
	any,
	{ Percentage: number; Svg: number; Audio: number; IsLoading: boolean }
> {
	private _sentenceIndex: number = 0;
	private _sentencePercentage: number = 0;

	public OnStart(): void {
		this.setState({
			IsLoading: true,
			Percentage: 0,
			Svg: 0,
			Audio: 0
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
		const percentage = Math.round(audio / 2 + this.state.Svg / 2);
		this.setState({
			Percentage: percentage,
			Audio: audio
		});
	}

	public SetSvg(svg: number): void {
		const percentage = Math.round(svg / 2 + this.state.Audio / 2);
		this.setState({
			Percentage: percentage,
			Svg: svg
		});
	}

	componentDidUpdate() {
		if (this.state.Percentage === 100) {
			new SingletonContainer().Register();
			SpriteProvider.SetLoaded(true);
			const profil = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
			const soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
			soundService.SetMute(profil.GetProfil().IsMute);
			soundService.PlayLoungeMusic();
			route('{{sub_path}}Home', true);
		}
	}

	render() {
		return (
			<Background>
				<div class="sizeContainer absolute-center-middle-2">
					<div class="logo-container">
						<div class="fill-logo-back-container">
							<div class="fill-logo-back spin-fade" />
						</div>
						<div class="fill-tank-logo slow-bounce" />
						<div class="fill-logo" />
					</div>
					<div class="container">
						<div class="progress progress-striped">
							<div class="progress-bar" style={`width:${this.state.Percentage}%`} />
						</div>
					</div>
					<Switch
						isLeft={this.state.IsLoading}
						left={
							<div class="container-center" style="color:white;font-weight:bold;text-align:center;">
								{LoadingSentences[this._sentenceIndex]}
							</div>
						}
						right={
							<div class="container-center">
								<Btn OnClick={() => this.OnStart()} Color={ColorKind.Red}>
									<Icon Value="fas fa-dungeon" /> Continue
								</Btn>
							</div>
						}
					/>
				</div>
			</Background>
		);
	}
}
