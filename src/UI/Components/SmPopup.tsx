import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { Singletons, SingletonKey } from '../../Singletons';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ProgressComponent from '../Common/Progress/ProgressComponent';

export default class SmPopup extends Component<{ status: GameStatus; points: number }, { Kind: StatsKind }> {
	private _profilService: IPlayerProfilService;

	constructor() {
		super();
		this.setState({
			Kind: StatsKind.Unit
		});
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	}

	componentDidMount() {
		this.setState({});
		this._profilService.AddPoints(this.props.points);
	}

	private Quit(): void {
		//this._profilService.Update();
		route('{{sub_path}}Home', true);
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					{this.props.status === GameStatus.Victory ? (
						<div class="fill-won light-bounce" />
					) : (
						<div class="fill-defeat light-bounce" />
					)}
				</div>
				<div class="container-center">
					<div class="container-center-horizontal" style="margin-top:15px;margin-bottom:15px;width:100%">
						<ProgressComponent width={80} maxWidth={0} />
					</div>

					<div class="container-center-horizontal">
						<ButtonComponent
							callBack={() => {
								this.Quit();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
					</div>
				</div>
			</div>
		);
	}
}
