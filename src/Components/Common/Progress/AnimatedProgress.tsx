import { h, Component } from 'preact';
import { PointDetails } from '../../../Services/PlayerProfil/PointDetails';
import { PlayerUtils } from '../../../Services/PlayerProfil/PlayerUtils';

export default class AnimatedProgress extends Component<
	{ Width: number; MaxWidth: number; Details: PointDetails },
	{ Percentage: number; Points: number; Level: number }
> {
	private _timeout: NodeJS.Timeout;
	private _iconDiv: HTMLDivElement;
	constructor() {
		super();
	}

	private AddPoint(point: number): void {
		const previousLevel = this.state.Level;
		const newPoints = point + this.state.Points;
		this.setState({
			Points: newPoints,
			Percentage: PlayerUtils.GetNextLevelPercentage(newPoints)
		});
		if (previousLevel < PlayerUtils.GetLevel(this.state.Points)) {
			this.BounceBadge();
		}
	}

	private Animation(remainingPoints: number) {
		this._timeout = setTimeout(() => {
			remainingPoints--;
			this.AddPoint(1);
			if (0 < remainingPoints) {
				this.Animation(remainingPoints);
			}
		}, 200);
	}

	private BounceBadge(): void {
		if (this._iconDiv) {
			this._iconDiv.classList.add('slow-bounce');
		}
	}

	componentDidMount() {
		this.setState({
			Points: this.props.Details.Points,
			Level: PlayerUtils.GetLevel(this.props.Details.Points)
		});
		this.Animation(this.props.Details.AddedPoints);
	}

	componentWillUnmount() {
		clearTimeout(this._timeout);
	}

	render() {
		return (
			<div class="d-flex" style={`flex-direction:row;align-items:center;width:${this.props.Width}%`}>
				<div
					class="bagde-container"
					ref={(dom) => {
						this._iconDiv = dom;
					}}
				>
					<div
						class="bagde-background"
						style={`background-color:${PlayerUtils.GetColorLevel(this.state.Points)}`}
					/>
					<div class="fill-icon-level " />
					<div class="bagde-frontground">{PlayerUtils.GetLevel(this.state.Points)}</div>
				</div>

				<div style="width: 100%; text-align: center; margin-left: 15px; margin-right: 15px;">
					<div class="progress progress-striped">
						<div
							class="progress-bar"
							style={`width:${PlayerUtils.GetNextLevelPercentage(this.state.Points)}%`}
						/>
					</div>
				</div>
			</div>
		);
	}
}
