import { h, Component } from 'preact';
import { route } from 'preact-router';
import { AudioContent } from '../../Core/Framework/AudioArchiver';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { Factory, FactoryKey } from '../../Factory';
import { ISoundService } from '../../Services/Sound/ISoundService';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import PanelComponent from '../Common/Panel/PanelComponent';

export default class LoadingComponent extends Component<any, { percentage: number }> {
	componentDidMount() {
		Factory.Load<ISoundService>(FactoryKey.Sound).Play(AudioContent.menuMusic, 0.005, true);
		setTimeout(() => {
			const listener = SpriteProvider.LoadAll();
			listener.On((obj: any, percentage: number) => {
				this.setState({
					percentage: percentage
				});

				if (percentage === 100) {
					SpriteProvider.SetLoaded(true);
					listener.Clear();
				}
			});
		}, 1000);
	}

	private ToHome(): void {
		route('/Home', true);
	}

	private Continue() {
		if (this.state.percentage === 100) {
			return (
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
			);
		}
		return '';
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
				{this.Continue()}
			</PanelComponent>
		);
	}
}
