import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { AssetLoader } from '../../Core/Framework/AssetLoader';
import { AssetExplorer } from '../../Core/Framework/AssetExplorer';
import { SvgLoader } from '../../Core/Framework/SvgLoader';
import Visible from '../Common/Struct/Visible';
import { LoadingSentences } from '../Model/Text';
import { SingletonContainer } from '../../SingletonContainer';
import Background from '../Components/Background';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { Singletons, SingletonKey } from '../../Singletons';

export default class LoadingScreen extends Component<any, { Percentage: number }> {
	private _sentenceIndex: number = 0;
	private _sentencePercentage: number = 0;
	constructor() {
		super();
	}

	componentDidMount() {
		const svgLoad = new SvgLoader();
		const onLoaded = new AssetLoader(svgLoad, 150).LoadAll(new AssetExplorer().GetAssets());
		onLoaded.On((obj: any, percentage: number) => {
			const roundedPercentage = Math.round(percentage);
			if (roundedPercentage % 10 === 0 && roundedPercentage !== this._sentencePercentage) {
				this._sentencePercentage = roundedPercentage;
				this._sentenceIndex = (this._sentenceIndex + 1) % LoadingSentences.length;
			}
			this.setState({
				Percentage: percentage
			});
		});
	}

	componentDidUpdate() {
		if (this.state.Percentage === 100) {
			new SingletonContainer().Register();
			SpriteProvider.SetLoaded(true);
		}
	}

	private ToHome(): void {
		const soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		soundService.PlayLoungeMusic();
		route('{{sub_path}}Home', true);
	}

	render() {
		return (
			<Background>
				<div class="generalContainer absolute-center-middle">
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
					<Visible isVisible={this.state.Percentage < 100}>
						<div class="container-center" style="color:white;font-weight:bold;text-align:center;">
							{LoadingSentences[this._sentenceIndex]}
						</div>
					</Visible>
					<Visible isVisible={this.state.Percentage === 100}>
						<div class="container-center">
							<Btn
								callBack={() => {
									this.ToHome();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="fas fa-dungeon" /> Continue
							</Btn>
						</div>
					</Visible>
				</div>
			</Background>
		);
	}
}
