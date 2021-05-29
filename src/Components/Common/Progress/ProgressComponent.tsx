import { h, Component } from 'preact';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { Factory, FactoryKey } from '../../../Factory';

export default class ProgressComponent extends Component<{ width: number }, any> {
	private _profilService: IPlayerProfilService;
	constructor() {
		super();
		this._profilService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);
		this.setState({
			profil: this._profilService.GetProfil()
		});
	}

	render() {
		return (
			<div class="d-flex justify-content-start" style={`width:${this.props.width}%`}>
				<div class="bagde-container" style={`background-color:${this._profilService.GetColorLevel()}`}>
					{this._profilService.GetLevel()}
				</div>
				<div
					class="progress"
					style={`width:100%;max-width:150px;height:25px; border: 4px solid rgb(198, 198, 198)`}
				>
					<div
						class="progress-bar bg-danger"
						role="progressbar"
						style={'width:' + this._profilService.GetNextLevelPercentage() + '%'}
						aria-valuenow={this._profilService.GetNextLevelPercentage()}
						aria-valuemin="0"
						aria-valuemax="100"
					/>
				</div>
			</div>
		);
	}
}
