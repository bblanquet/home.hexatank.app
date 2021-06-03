import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ProgressComponent from '../Common/Progress/ProgressComponent';

export default class SmPopupComponent extends Component<
	{ status: GameStatus; points: number },
	{ Kind: StatsKind; points: number }
> {
	private _profilService: IPlayerProfilService;
	constructor() {
		super();
		this.setState({
			Kind: StatsKind.Unit
		});
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._profilService.OnPointChanged.On(() => this.setState({ Kind: this.state.Kind }));
	}

	componentDidMount() {
		this.setState({
			points: this.props.points
		});
		this.AddPoint();
	}

	private AddPoint() {
		setTimeout(() => {
			//this._points -= 1;
			this.setState({
				points: this._profilService.AddPoint(1)
			});
			if (0 < this.state.points) {
				this.AddPoint();
			}
		}, 100);
	}

	private Quit(): void {
		this._profilService.Update();
		route('/Home', true);
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
