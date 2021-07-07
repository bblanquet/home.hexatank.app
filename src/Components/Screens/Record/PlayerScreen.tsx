import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { Component, h } from 'preact';
import { ISelectable } from '../../../Core/ISelectable';
import { RecordCanvasUpdater } from './Updaters/RecordCanvasUpdater';
import RangeComponent from '../../Common/Range/RangeComponent';
import { Item } from '../../../Core/Items/Item';
import UnitMenuComponent from './Parts/UnitMenuComponent';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';
import GameCanvas from '../../Components/GameCanvas';
import { IRecordService } from '../../../Services/Record/IRecordService';
import { Singletons, SingletonKey } from '../../../Singletons';
import { route } from 'preact-router';
import Redirect from '../../Components/Redirect';
import { GameBlueprint } from '../../../Core/Framework/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../../Core/Framework/Context/GameContext';
import Icon from '../../Common/Icon/IconComponent';
import Struct from '../../Components/Struct';
import Navbar from '../../Components/Navbar';
import Visible from '../../Components/Visible';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import SmActiveBtn from '../../Common/Button/Stylish/SmActiveBtn';
import SmBtn from '../../Common/Button/Stylish/SmBtn';
import Switch from '../../Components/Switch';
import LogComponent from '../../Components/LogComponent';
import { RecordContent } from '../../../Core/Framework/Record/Model/RecordContent';

export default class PlayerScreen extends Component<
	{},
	{
		Item: Item;
		IsLog: boolean;
	}
> {
	private _recordService: IRecordService;
	private _gameService: IGameContextService<GameBlueprint, GameContext>;
	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _updater: RecordCanvasUpdater;

	constructor() {
		super();
		this._gameService = Singletons.Load<IGameContextService<GameBlueprint, GameContext>>(SingletonKey.GameContext);
		this._recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
	}
	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.setState({
				Item: null
			});
		}
	}

	componentDidMount() {
		const context = this._gameService.Publish();
		this._updater = new RecordCanvasUpdater(this.GetRecord(), context);
		context.OnItemSelected.On(this.UpdateSelection.bind(this));
		this.setState({ IsLog: false });
	}

	componentWillUnmount() {
		this._gameService.Collect();
	}

	private GetRecord(): RecordContent {
		return this._recordService.Publish();
	}

	private Button(state: boolean, icon: string) {
		return (
			<SmActiveBtn
				isActive={this.state.IsLog === state}
				leftColor={ColorKind.Red}
				rightColor={ColorKind.Black}
				left={<Icon Value={icon} />}
				right={<Icon Value={icon} />}
				callBack={() => this.setState({ IsLog: state })}
			/>
		);
	}

	render() {
		return (
			<Redirect>
				<Struct
					noScrollbar={!this.state.IsLog}
					header={
						<span>
							<Navbar>
								{this.Button(false, 'far fa-map')}
								{this.Button(true, 'fas fa-stream')}
								<SmBtn color={ColorKind.Black} callBack={() => this.SetMenu()}>
									<Icon Value="fas fa-undo-alt" />
								</SmBtn>
							</Navbar>
							<span class="badge badge-primary" style="width:100%;border-radius:0px;margin:0px">
								{this.GetRecord().Title}
							</span>
						</span>
					}
					content={
						<Switch
							isVisible={this.state.IsLog}
							left={<LogComponent Messages={this.GetRecord().Messages} />}
							right={
								<span>
									<GameCanvas gameContext={this._gameService} uncollect={true} />
									<Visible isVisible={this.state.Item !== null && this.state.Item !== undefined}>
										<UnitMenuComponent Vehicle={this.state.Item as Vehicle} />
									</Visible>
								</span>
							}
						/>
					}
					footer={
						<RangeComponent
							dataSet={this.GetRecord().Dates}
							onChange={(e: number) => this.HandleRangeChanged(e)}
						/>
					}
				/>
			</Redirect>
		);
	}

	private SetMenu(): void {
		route('{{sub_path}}Profil', true);
	}

	private UpdateSelection(obj: any, selectedItem: Item): void {
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.setState({
			Item: selectedItem
		});
	}

	private HandleRangeChanged(e: number): void {
		this._updater.SetDate(e);
	}
}
