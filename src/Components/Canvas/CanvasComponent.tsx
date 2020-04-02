import { Component, h } from 'preact';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { PeerHandler } from '../Network/Host/On/PeerHandler';
import { route } from 'preact-router';
import { Item } from '../../Core/Items/Item';
import { GameContext } from '../../Core/Framework/GameContext';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import { Cell } from '../../Core/Items/Cell/Cell';
import { ISelectable } from '../../Core/ISelectable';
import { InfluenceField } from '../../Core/Items/Cell/Field/InfluenceField';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { CombinationProvider } from '../../Core/Interaction/CombinationProvider';
import { SelectableChecker } from '../../Core/Interaction/SelectableChecker';
import { Headquarter } from '../../Core/Items/Cell/Field/Headquarter';
import { AppHandler } from './AppHandler';
import FactoryMenuComponent from './FactoryMenuComponent';
import HqMenuComponent from './HqMenuComponent';
import TankMenuComponent from './TankMenuComponent';
import CellMenuComponent from './CellMenuComponent';
import TruckMenuComponent from './TruckMenuComponent';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { RenderingHandler } from '../../Core/Setup/Render/RenderingHandler';
import { RenderingGroups } from '../../Core/Setup/Render/RenderingGroups';
import { MapRender } from '../../Core/Setup/Render/MapRender';

export default class CanvasComponent extends Component<
	any,
	{
		HasMenu: boolean;
		TankRequestCount: number;
		TruckRequestCount: number;
		Amount: number;
		HasFlag: boolean;
		Item: Item;
		PingStatus: string;
		HasWarning: boolean;
	}
> {
	private _gameCanvas: HTMLDivElement;
	private _loop: { (): void };
	private _stop: boolean;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
	private _appHandler: AppHandler;
	private _gameContext: GameContext;
	constructor() {
		super();
		this._stop = true;
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this._loop = this.GameLoop.bind(this);

		this.setState({
			HasMenu: false,
			TankRequestCount: 0,
			TruckRequestCount: 0,
			Amount: GameSettings.PocketMoney,
			HasFlag: false,
			PingStatus: 'no data',
			HasWarning: false
		});
	}

	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.SelectionChanged.Off(this._onItemSelectionChanged);
			this.setState({
				...this.state,
				Item: null
			});
		}
	}

	componentDidMount() {
		this._stop = false;
		this._appHandler = new AppHandler();
		this._appHandler.InitApp();
		GameHelper.Updater = this._appHandler.Playground;
		GameHelper.Render = new RenderingHandler(
			new RenderingGroups(
				{
					zs: [ -1, 0, 1, 2, 3, 4, 5 ],
					parent: this._appHandler.GetViewport()
				},
				{
					zs: [ 6, 7 ],
					parent: this._appHandler.GetApp().stage
				}
			)
		);

		this._appHandler.GetApp().start();
		this._gameCanvas.appendChild(this._appHandler.GetApp().view);

		if (!GameHelper.MapContext) {
			throw 'context missing, cannot implement map';
		}

		this._gameContext = new MapRender().Render(GameHelper.MapContext);
		const checker = new SelectableChecker(this._gameContext.MainHq);
		this._appHandler.InteractionContext = new InteractionContext(
			this._appHandler.InputManager,
			new CombinationProvider().GetCombination(this._appHandler, checker, this._gameContext),
			checker,
			this._appHandler.GetViewport()
		);
		this._appHandler.InteractionContext.Listen();
		this._appHandler.SetBackgroundColor(GameHelper.MapContext.MapMode);

		this._appHandler.InteractionManager.on(
			'pointerdown',
			this._appHandler.InputManager.OnMouseDown.bind(this._appHandler.InputManager),
			false
		);
		this._appHandler.InteractionManager.on(
			'pointermove',
			this._appHandler.InputManager.OnMouseMove.bind(this._appHandler.InputManager),
			false
		);
		this._appHandler.InteractionManager.on(
			'pointerup',
			this._appHandler.InputManager.OnMouseUp.bind(this._appHandler.InputManager),
			false
		);
		this._appHandler.ResizeTheCanvas();
		window.addEventListener('resize', () => this._appHandler.ResizeTheCanvas());
		window.addEventListener('DOMContentLoaded', () => this._appHandler.ResizeTheCanvas());
		this._appHandler.InteractionManager.autoPreventDefault = false;
		this.SetCenter();
		this._gameContext.MainHq.OnTruckRequestChanged.On((obj: any, e: number) => {
			this.setState({
				...this.state,
				TruckRequestCount: e
			});
		});
		this._gameContext.MainHq.OnTankRequestChanged.On((obj: any, e: number) => {
			this.setState({
				...this.state,
				TankRequestCount: e
			});
		});
		this._gameContext.MainHq.OnDiamondCountChanged.On((obj: any, e: number) => {
			this.setState({
				...this.state,
				Amount: e
			});
		});
		this._gameContext.OnItemSelected.On((obj: any, e: Item) => {
			((e as unknown) as ISelectable).SelectionChanged.On(this._onItemSelectionChanged);
			this.setState({
				...this.state,
				Item: e
			});
		});
		this._gameContext.MainHq.OnCashMissing.On((obj: any, e: boolean) => {
			if (e !== this.state.HasWarning) {
				this.setState({
					...this.state,
					HasWarning: e
				});
			}
		});
		this._loop();
	}

	public SetCenter(): void {
		const hqPoint = this._gameContext.MainHq.GetBoundingBox().GetCentralPoint();
		const halfWidth = GameSettings.ScreenWidth / 2;
		const halfHeight = GameSettings.ScreenHeight / 2;
		console.log('x: ' + -(hqPoint.X - halfWidth));
		console.log('y: ' + -(hqPoint.Y - halfHeight));
		this._appHandler.Playground.ViewContext.SetX(-(hqPoint.X - halfWidth));
		this._appHandler.Playground.ViewContext.SetY(-(hqPoint.Y - halfHeight));
	}

	private LeftMenuRender() {
		if (this.state.Item) {
			if (this.state.Item instanceof Tank) {
				return <TankMenuComponent AppHandler={this._appHandler} />;
			} else if (this.state.Item instanceof Truck) {
				return <TruckMenuComponent AppHandler={this._appHandler} />;
			} else if (this.state.Item instanceof Headquarter) {
				return (
					<HqMenuComponent
						SetFlag={this.SetFlag.bind(this)}
						TankRequestCount={this.state.TankRequestCount}
						TruckRequestCount={this.state.TruckRequestCount}
						HasFlag={this.state.HasFlag}
						AppHandler={this._appHandler}
						GameContext={this._gameContext}
					/>
				);
			} else if (this.state.Item instanceof InfluenceField) {
				return (
					<FactoryMenuComponent
						Item={this.state.Item}
						AppHandler={this._appHandler}
						GameContext={this._gameContext}
					/>
				);
			} else if (this.state.Item instanceof Cell) {
				return (
					<CellMenuComponent
						Item={this.state.Item}
						AppHandler={this._appHandler}
						GameContext={this._gameContext}
					/>
				);
			}
		}
		return '';
	}

	private GameLoop(): void {
		if (this._stop) {
			return;
		}
		requestAnimationFrame(this._loop);
		GameHelper.Updater.Update();
	}

	componentWillUnmount() {
		this._stop = true;
		this._appHandler.GetApp().stop();
		GameHelper.Updater.Items.forEach((item) => {
			item.Destroy();
		});
		GameHelper.Updater.Items = [];
	}

	componentDidUpdate() {}

	private Cheat(e: any): void {
		GameSettings.ShowEnemies = !GameSettings.ShowEnemies;
	}

	private Quit(e: any): void {
		route('/Home', true);
		this._appHandler.InteractionContext.Mute();
		PeerHandler.Stop();
	}

	private SetMenu(e: any): void {
		this.setState({
			HasMenu: !this.state.HasMenu
		});
	}

	private SetFlag(): void {
		this._gameContext.IsFlagingMode = !this._gameContext.IsFlagingMode;
		this.setState({
			...this.state,
			HasFlag: this._gameContext.IsFlagingMode
		});
	}

	render() {
		return (
			<div style="width=100%">
				{/* {GameHelper.IsOnline ? this.TopLeftInfo() : ''} */}
				{this.TopMenuRender()}
				<div
					ref={(dom) => {
						this._gameCanvas = dom;
					}}
				/>
				{this.state.HasMenu ? '' : this.LeftMenuRender()}
				{this.state.HasMenu ? this.MenuRender() : ''}
			</div>
		);
	}

	private TopLeftInfo() {
		return <div style="position: fixed;left: 0%; color:white;">{this.state.PingStatus}</div>;
	}

	private TopMenuRender() {
		return (
			<div style="position: fixed;left: 50%;transform: translateX(-50%);">
				<button type="button" class="btn btn-dark space-out">
					{this.ShowNoMoney()}
					{this.state.Amount.toPrecision(2)}
					<span class="fill-diamond badge badge-secondary very-small-space middle very-small-left-margin very-small-right-margin">
						{' '}
					</span>
				</button>
				<button
					type="button"
					class="btn btn-dark small-space space-out fill-option"
					onClick={(e: any) => this.SetMenu(e)}
				/>
			</div>
		);
	}

	private ShowNoMoney() {
		if (this.state.HasWarning) {
			return (
				<span class="fill-noMoney badge badge-warning very-small-space middle very-small-right-margin blink_me">
					{' '}
				</span>
			);
		} else {
			return '';
		}
	}

	private MenuRender() {
		return (
			<div class="base">
				<div class="centered">
					<div class="container">
						<div class="title-container">Menu</div>
						<div class="container-center">
							<div class="btn-group-vertical btn-block">
								<button
									type="button"
									class="btn btn-primary-blue btn-block"
									onClick={(e: any) => this.SetMenu(e)}
								>
									Resume
								</button>
								<button
									type="button"
									class="btn btn-primary-blue btn-block"
									onClick={(e: any) => this.Cheat(e)}
								>
									Cheat
								</button>
								<button type="button" class="btn btn-dark btn-block" onClick={(e: any) => this.Quit(e)}>
									Quit
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	private EndMessage() {
		return (
			<div class="base">
				<div class="centered">
					<div class="container">
						You won
						<div class="bottom-container">
							<div style="float:right;">
								<button type="button" class="btn btn-dark btn-sm">
									Back
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
