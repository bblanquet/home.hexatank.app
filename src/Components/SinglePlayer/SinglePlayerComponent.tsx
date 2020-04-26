import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SinglePlayerState } from './SinglePlayerState';
import linkState from 'linkstate';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { IconProvider } from '../IconProvider';

export default class SinglePlayerComponent extends Component<any, SinglePlayerState> {
	private _isFirstRender = true;

	constructor(props: any) {
		super(props);
		this.setState({
			IaNumber: 1,
			Mode: '0',
			MapType: 'Flower',
			Size: '12'
		});
		SpriteProvider.GetAssets().forEach((a) => {
			var preloadLink = document.createElement('link');
			preloadLink.href = a;
			preloadLink.crossOrigin = 'anonymous';
			preloadLink.rel = 'preload';
			preloadLink.as = 'image';
			document.head.appendChild(preloadLink);
		});
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="title-container">Single player</div>
				<div class="col-auto my-1">
					<label class="mr-sm-2 whiteText" for="inlineFormCustomSelect">
						IA
					</label>
					<select
						onChange={linkState(this, 'IaNumber')}
						class="custom-select mr-sm-2"
						id="inlineFormCustomSelect"
					>
						<option>1</option>
						<option>2</option>
						<option>3</option>
					</select>
				</div>
				<div class="col-auto my-1 whiteText">
					<label class="mr-sm-2" for="inlineFormCustomSelect">
						Mode
					</label>
					<select
						onChange={linkState(this, 'Mode')}
						class="custom-select mr-sm-2"
						id="inlineFormCustomSelect"
					>
						<option value="0">Sand</option>
						<option value="1">Forest</option>
						<option value="2">Ice</option>
					</select>
				</div>
				<div class="col-auto my-1 whiteText">
					<label class="mr-sm-2" for="inlineFormCustomSelect">
						Size
					</label>
					<select
						onChange={linkState(this, 'Size')}
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
				<div class="col-auto my-1 whiteText">
					<label class="mr-sm-2" for="inlineFormCustomSelect">
						Shape
					</label>
					<select
						onChange={linkState(this, 'MapType')}
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
				<p />

				<button type="button" class="btn btn-primary btn-sm btn-light left" onClick={(e) => this.Back(e)}>
					{IconProvider.GetIcon(this._isFirstRender, 'fas fa-undo-alt')} Back
				</button>
				<button type="button" class="btn btn-danger btn-sm right" onClick={(e) => this.Start(e)}>
					{IconProvider.GetIcon(this._isFirstRender, 'far fa-play-circle')} Start
				</button>
			</div>
		);
	}

	private Back(e: any) {
		route('/Home', true);
	}

	Start(e: MouseEvent): void {
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
				hq.PlayerName = `IA${index}`;
			}
			index += 1;
		});
		route('/Canvas', true);
	}
}
