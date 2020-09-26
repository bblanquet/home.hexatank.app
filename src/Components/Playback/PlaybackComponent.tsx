import { h, Component } from 'preact';
import { route } from 'preact-router';
import PanelComponent from '../Common/Panel/PanelComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';

export default class PlaybackComponent extends Component<any, { contexts: any[] }> {
	constructor() {
		super();
		this.setState({
			contexts: []
		});
	}
	private _isFirstRender = true;

	private ToHome(): void {
		route('/Home', true);
	}

	private Play(): void {
		GameHelper.MapContext = new MapGenerator().GetMapDefinition(+16, 'Flower', 2, MapMode.forest);
		GameHelper.MapContext.Hqs[0].PlayerName = GameHelper.MapContext.PlayerName;
		let index = 0;
		GameHelper.MapContext.Hqs.forEach((hq) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
		route('/LightCanvas', true);
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	componentWillUnmount() {}

	private Upload(e: any): void {
		var reader = new FileReader();
		reader.readAsText(e.target.files[0], 'UTF-8');
		reader.onload = (ev: ProgressEvent<FileReader>) => {
			const context = JSON.parse(ev.target.result as string);
			this.state.contexts.push(context);
			this.setState({
				contexts: this.state.contexts
			});
		};
	}

	render() {
		return (
			<PanelComponent>
				<div class="input-group mb-3">
					<div class="custom-file">
						<input
							type="file"
							class="custom-file-input"
							id="inputGroupFile02"
							onChange={(e: any) => this.Upload(e)}
						/>
						<label class="custom-file-label" for="inputGroupFile02">
							Choose file
						</label>
					</div>
				</div>
				<div class="container-center-horizontal">
					<BlackButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Back'}
						isFirstRender={this._isFirstRender}
						callBack={() => {
							this.ToHome();
						}}
					/>
					<RedButtonComponent
						icon={'fas fa-play-circle'}
						title={'Play'}
						isFirstRender={this._isFirstRender}
						callBack={() => {
							this.Play();
						}}
					/>
				</div>
			</PanelComponent>
		);
	}
}
