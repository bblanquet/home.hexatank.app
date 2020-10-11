import { h, Component } from 'preact';
import { route } from 'preact-router';
import { StatsKind } from '../../Core/Utils/Stats/StatsKind';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import ActiveButtonComponent from '../Common/Button/Stylish/ActiveButtonComponent';
import { Factory, FactoryKey } from '../../Factory';
import { GameContextService } from '../../Services/GameContext/GameContextService';

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

	private Save(): void {
		const data = Factory.Load<GameContextService>(FactoryKey.GameContext)
			.Publish()
			.TrackingContext.GetTrackingObject();
		const url = document.createElement('a');
		const file = new Blob([ JSON.stringify(data) ], { type: 'application/json' });
		url.href = URL.createObjectURL(file);
		url.download = `${data.Title}.json`;
		url.click();
		URL.revokeObjectURL(url.href);
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
						rightColor={ColorKind.Red}
						isActive={GameSettings.ShowEnemies}
						callBack={() => this.Cheat()}
					/>
					<ButtonComponent
						callBack={() => {
							this.Save();
						}}
						color={ColorKind.Blue}
					>
						<Icon Value="fas fa-save" /> Save
					</ButtonComponent>
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
