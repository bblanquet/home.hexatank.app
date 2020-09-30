import { h, Component } from 'preact';
import { route } from 'preact-router';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';

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
					<RedButtonComponent
						icon={'fas fa-arrow-alt-circle-right'}
						title={'Resume'}
						callBack={() => this.props.callBack()}
					/>
					{GameSettings.ShowEnemies ? (
						<BlackButtonComponent icon={'fas fa-eye'} title={'Cheat'} callBack={() => this.Cheat()} />
					) : (
						<RedButtonComponent icon={'fas fa-eye'} title={'Cheat'} callBack={() => this.Cheat()} />
					)}
					<BlackButtonComponent icon={'fas fa-undo-alt'} title={'Quit'} callBack={() => this.Quit()} />{' '}
				</div>
			</div>
		);
	}
}
