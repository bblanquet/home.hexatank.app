import { h, Component } from 'preact';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { PlayerUtils } from '../../../Services/PlayerProfil/PlayerUtils';
import { Singletons, SingletonKey } from '../../../Singletons';

export default class Progress extends Component<{}, {}> {
	private _profilService: IPlayerProfilService;
	constructor() {
		super();
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	}

	render() {
		return (
			<div class="d-flex" style={`flex-direction:row;justify-content:flex-start; align-items:center;width:175px`}>
				<div class="bagde-container">
					<div
						class="bagde-background"
						style={`background-color:${PlayerUtils.GetColorLevel(this._profilService.GetPoints())}`}
					/>
					<div class="fill-icon-level " />
					<div class="bagde-frontground">{PlayerUtils.GetLevel(this._profilService.GetPoints())}</div>
				</div>
				<div class="progress-container">
					<div class="progress progress-striped" style="width:100%">
						<div
							class="progress-bar"
							style={`width:${PlayerUtils.GetNextLevelPercentage(this._profilService.GetPoints())}%`}
						/>
					</div>
				</div>
			</div>
		);
	}
}
