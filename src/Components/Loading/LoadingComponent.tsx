import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { ComponentsHelper } from '../ComponentsHelper';

export default class LoadingComponent extends Component<any, { percentage: number }> {
	constructor() {
		super();
	}
	private _isFirstRender = true;

	componentDidMount() {
		this._isFirstRender = false;

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

	private ToHome(e: any): void {
		route('/Home', true);
	}

	private Continue() {
		if (this.state.percentage === 100) {
			return (
				<div class="container-center">
					{ComponentsHelper.GetRedButton(this._isFirstRender, 'fas fa-dungeon', 'Continue', this.ToHome)}
				</div>
			);
		}
		return '';
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="logo-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-logo" />
				</div>
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
			</div>
		);
	}
}
