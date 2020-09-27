import { h, Component } from 'preact';
import { route } from 'preact-router';
import PanelComponent from '../Common/Panel/PanelComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import { GameHelper } from '../../Core/Framework/GameHelper';
import TextComponent from '../Common/Text/TextComponent';
import { TrackingObject } from '../../Core/Framework/Tracking/TrackingObject';
import { TrackingHq } from '../../Core/Framework/Tracking/TrackingHq';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { TrackingUnit } from '../../Core/Framework/Tracking/TrackingUnit';
import { TrackingData } from '../../Core/Framework/Tracking/TrackingData';
import { TrackingCell } from '../../Core/Framework/Tracking/TrackingCell';
export default class PlaybackComponent extends Component<any, { TrackingObjs: TrackingObject[] }> {
	constructor() {
		super();
		this.setState({
			TrackingObjs: []
		});
	}
	private _isFirstRender = true;

	private ToHome(): void {
		route('/Home', true);
	}

	private Play(): void {
		GameHelper.TackingDatas = this.ToTracking(this.state.TrackingObjs[0]);
		GameHelper.MapContext = this.state.TrackingObjs[0].MapContext;
		route('/LightCanvas', true);
	}

	public ToTracking(e: TrackingObject): TrackingData {
		const hqs = new Dictionnary<TrackingHq>();
		hqs.SetValues(e.Hqs);

		hqs.Values().forEach((hq) => {
			const units = hq.Units as any;
			hq.Units = new Dictionnary<TrackingUnit>();
			hq.Units.SetValues(units);
		});

		const cells = new Dictionnary<TrackingCell>();
		cells.SetValues(e.Cells);

		const result = new TrackingData();
		result.Hqs = hqs;
		result.Cells = cells;
		result.Dates = e.Points;
		return result;
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
			this.state.TrackingObjs.push(context);
			this.setState({
				TrackingObjs: this.state.TrackingObjs
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
				{this.state.TrackingObjs.map((c, i) => (
					<TextComponent
						value={c.Title}
						label={`Record ${i + 1}`}
						isEditable={false}
						onInput={(e: any) => {}}
					/>
				))}
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
