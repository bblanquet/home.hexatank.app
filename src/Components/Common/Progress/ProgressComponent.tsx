import { h, Component } from 'preact';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { Singletons, SingletonKey } from '../../../Singletons';
import Side from '../Visible/SideComponent';

export default class ProgressComponent extends Component<{ width: number; maxWidth: number }, { Percentage: number }> {
	private _profilService: IPlayerProfilService;
	private _iconDiv: HTMLDivElement;
	private _bounceFunc: any = this.BounceBadge.bind(this);

	constructor() {
		super();
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._profilService.OnPointChanged.On(() => {
			this.setState({
				Percentage: this._profilService.GetNextLevelPercentage()
			});
		});
		this._profilService.OnLevelUp.On(this._bounceFunc);
	}

	private BounceBadge(): void {
		if (this._iconDiv) {
			this._iconDiv.classList.add('slow-bounce');
		}
	}

	componentWillMount() {
		this._profilService.OnLevelUp.Off(this._bounceFunc);
	}

	render() {
		return (
			<div class="d-flex justify-content-start" style={`width:${this.props.width}%`}>
				<div
					ref={(dom) => {
						this._iconDiv = dom;
					}}
					class="bagde-container"
					style={`background-color:${this._profilService.GetColorLevel()}`}
				>
					{this._profilService.GetLevel()}
				</div>
				<Side
					isVisible={this.props.maxWidth === 0}
					left={
						<div class="progress" style={`width:100%;height:25px; border: 4px solid rgb(198, 198, 198)`}>
							<div
								class="progress-bar bg-danger"
								role="progressbar"
								style={'width:' + this.state.Percentage + '%'}
								aria-valuenow={this.state.Percentage}
								aria-valuemin="0"
								aria-valuemax="100"
							/>
						</div>
					}
					right={
						<div
							class="progress"
							style={`width:100%;max-width:${this.props
								.maxWidth}px;height:25px; border: 4px solid rgb(198, 198, 198)`}
						>
							<div
								class="progress-bar bg-danger"
								role="progressbar"
								style={'width:' + this.state.Percentage + '%'}
								aria-valuenow={this.state.Percentage}
								aria-valuemin="0"
								aria-valuemax="100"
							/>
						</div>
					}
				/>
			</div>
		);
	}
}
