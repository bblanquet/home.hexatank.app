import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import PanelComponent from '../Components/Panel/PanelComponent';
import { AssetLoader } from '../../Core/Framework/AssetLoader';
import Visible from '../Components/Visible';
import { LoadingSentences } from '../Model/Text';

export default class LoadingScreen extends Component<any, { percentage: number }> {
	private _sentenceIndex: number = 0;
	private _sentencePercentage: number = 0;
	constructor() {
		super();
	}

	componentDidMount() {
		setTimeout(() => {
			const onLoaded = new AssetLoader().LoadAll();
			onLoaded.On((obj: any, percentage: number) => {
				const roundedPercentage = Math.round(percentage);
				if (roundedPercentage % 10 === 0 && roundedPercentage !== this._sentencePercentage) {
					this._sentencePercentage = roundedPercentage;
					this._sentenceIndex = (this._sentenceIndex + 1) % LoadingSentences.length;
				}

				if (percentage === 100) {
					SpriteProvider.SetLoaded(true);
					onLoaded.Clear();
				}

				this.setState({
					percentage: percentage
				});
			});
		}, 2000);
	}

	private ToHome(): void {
		route('{{sub_path}}Home', true);
	}

	render() {
		return (
			<PanelComponent>
				<div class="progress" style="height:20px; border: 4px solid rgb(198, 198, 198);">
					<div
						class="progress-bar bg-danger "
						role="progressbar"
						style={'width:' + this.state.percentage + '%'}
						aria-valuenow="100"
						aria-valuemin="0"
						aria-valuemax="100"
					/>
				</div>
				<Visible isVisible={this.state.percentage < 100}>
					<div class="container-center" style="color:white;font-weight:bold;text-align:center;">
						{LoadingSentences[this._sentenceIndex]}
					</div>
				</Visible>
				<Visible isVisible={this.state.percentage === 100}>
					<div class="container-center">
						<ButtonComponent
							callBack={() => {
								this.ToHome();
							}}
							color={ColorKind.Red}
						>
							<Icon Value="fas fa-dungeon" /> Continue
						</ButtonComponent>
					</div>
				</Visible>
			</PanelComponent>
		);
	}
}
