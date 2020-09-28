import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import PanelComponent from '../Common/Panel/PanelComponent';

export default class LoadingComponent extends Component<any, { percentage: number }> {
	constructor() {
		super();
	}

	componentDidMount() {
		setTimeout(() => {
			const listener = SpriteProvider.LoadAll();
			listener.On((obj: any, percentage: number) => {
				this.setState({
					percentage: percentage
				});

				if (percentage === 100) {
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
					<RedButtonComponent icon={'fas fa-dungeon'} title={'Continue'} callBack={() => this.ToHome()} />
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
