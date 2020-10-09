import { h, Component } from 'preact';
import { route } from 'preact-router';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ActiveButtonComponent from '../Common/Button/Stylish/ActiveButtonComponent';

export default class PopupMenuComponent extends Component<
	{ status: GameStatus; callBack: () => void },
	{ Kind: StatsKind }
> {
	constructor() {
		super();
		this.setState({
			Kind: StatsKind.Unit
		});
	}

	componentDidMount() {}

	private Quit(): void {
		route('/Home', true);
	}

	private Cheat(): void {
		GameSettings.ShowEnemies = !GameSettings.ShowEnemies;
		this.setState({});
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-logo" />{' '}
				</div>
				<div class="container-center">
					<ButtonComponent
						callBack={() => {
							this.props.callBack();
						}}
						color={ColorKind.Red}
					>
						<Icon Value="fas fa-arrow-alt-circle-right" /> Resume
					</ButtonComponent>
					<ActiveButtonComponent
						left={
							<span>
								<Icon Value="fas fa-eye" /> Cheat
							</span>
						}
						right={
							<span>
								<Icon Value="fas fa-eye-slash" /> Cheat
							</span>
						}
						leftColor={ColorKind.Black}
						rightColor={ColorKind.Blue}
						isActive={GameSettings.ShowEnemies}
						callBack={() => this.Cheat()}
					/>
					<ButtonComponent
						callBack={() => {
							this.Quit();
						}}
						color={ColorKind.Black}
					>
						<Icon Value="fas fa-undo-alt" /> Quit
					</ButtonComponent>
				</div>
			</div>
		);
	}
}
