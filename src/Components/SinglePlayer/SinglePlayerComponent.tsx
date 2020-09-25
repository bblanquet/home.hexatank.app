import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SinglePlayerState } from './SinglePlayerState';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import PanelComponent from '../Common/Panel/PanelComponent';

export default class SinglePlayerComponent extends Component<any, SinglePlayerState> {
	private _isFirstRender = true;

	constructor(props: any) {
		super(props);
		this.setState({
			IaNumber: 1,
			Mode: '',
			MapType: 'Flower',
			Size: 12
		});
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	render() {
		return (
			<PanelComponent>
				<div class="col-auto my-1">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
								IA
							</span>
						</div>
						<select
							onInput={(e: any) => {
								this.setState({ IaNumber: Number(e.target.children[e.target.selectedIndex].text) });
							}}
							class="custom-select mr-sm-2"
							id="inlineFormCustomSelect"
						>
							<option>1</option>
							<option>2</option>
							<option>3</option>
						</select>
					</div>
				</div>
				<div class="col-auto my-1 whiteText">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
								Mode
							</span>
						</div>
						<select
							onInput={(e: any) => {
								this.setState({ Mode: e.target.children[e.target.selectedIndex].text });
							}}
							class="custom-select mr-sm-2"
							id="inlineFormCustomSelect"
						>
							<option value="0">Sand</option>
							<option value="1">Forest</option>
							<option value="2">Ice</option>
						</select>
					</div>
				</div>
				<div class="col-auto my-1 whiteText">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
								Size
							</span>
						</div>
						<select
							onInput={(e: any) => {
								this.setState({ Size: Number(e.target.children[e.target.selectedIndex].text) });
							}}
							class="custom-select mr-sm-2"
							id="inlineFormCustomSelect"
						>
							<option value="8">small</option>
							<option selected value="12">
								medium
							</option>
							<option value="16">big</option>
						</select>
					</div>
				</div>
				<div class="col-auto my-1 whiteText">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
								Shape
							</span>
						</div>
						<select
							onInput={(e: any) => {
								this.setState({ MapType: e.target.children[e.target.selectedIndex].text });
							}}
							class="custom-select mr-sm-2"
							id="inlineFormCustomSelect"
						>
							<option value="Donut">Donut</option>
							<option value="Cheese">Cheese</option>
							<option selected value="Flower">
								Flower
							</option>
						</select>
					</div>
				</div>
				<p />
				<div class="container-center-horizontal">
					<BlackButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Back'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.Back()}
					/>
					<RedButtonComponent
						icon={'fas fa-arrow-alt-circle-right'}
						title={'Play'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.Start()}
					/>
				</div>
			</PanelComponent>
		);
	}

	private Back() {
		route('/Home', true);
	}

	Start(): void {
		GameHelper.MapContext = new MapGenerator().GetMapDefinition(
			+this.state.Size,
			this.state.MapType,
			+this.state.IaNumber + 1,
			+this.state.Mode as MapMode
		);
		GameHelper.MapContext.Hqs[0].PlayerName = GameHelper.MapContext.PlayerName;
		let index = 0;
		GameHelper.MapContext.Hqs.forEach((hq) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
		route('/Canvas', true);
	}
}
