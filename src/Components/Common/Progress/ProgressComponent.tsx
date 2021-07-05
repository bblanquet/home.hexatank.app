import { h, Component } from 'preact';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { Singletons, SingletonKey } from '../../../Singletons';
import Switch from '../../Components/Switch';

export default class ProgressComponent extends Component<{ width: number; maxWidth: number }, { Percentage: number }> {
	private _profilService: IPlayerProfilService;
	private _iconDiv: HTMLDivElement;
	private _bounceFunc: any = this.BounceBadge.bind(this);
	constructor() {
		super();
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	}

	private BounceBadge(): void {
		if (this._iconDiv) {
			this._iconDiv.classList.add('slow-bounce');
		}
	}

	componentDidMount() {
		this._profilService.OnPointChanged.On(() => {
			this.setState({
				Percentage: this._profilService.GetNextLevelPercentage()
			});
		});
		this._profilService.OnLevelUp.On(this._bounceFunc);
	}

	componentWillUnmount() {
		this._profilService.OnLevelUp.Off(this._bounceFunc);
	}

	render() {
		return (
			<div
				class="d-flex justify-content-start"
				style={`flex-direction:row;align-items:center;width:${this.props.width}%`}
			>
				<div
					class="bagde-container"
					ref={(dom) => {
						this._iconDiv = dom;
					}}
				>
					<div class="bagde-background" style={`background-color:${this._profilService.GetColorLevel()}`} />
					<div class="fill-icon-level " />
					<div class="bagde-frontground">{this._profilService.GetLevel()}</div>
				</div>

				<Switch
					isVisible={this.props.maxWidth === 0}
					left={
						<div
							class="progress"
							style={`width:100%;height:25px; border: 4px solid rgb(198, 198, 198);margin-left:10px;`}
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
					right={
						<div
							class="progress"
							style={`width:100%;max-width:${this.props
								.maxWidth}px;height:25px; border: 4px solid rgb(198, 198, 198);margin-left:10px;`}
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
