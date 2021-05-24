import { h, Component } from 'preact';
import MapFormComponent from '../../../Form/MapFormComponent';
import { MapSetting } from '../../../Form/MapSetting';

export default class OptionComponent extends Component<{ Update: (model: MapSetting) => void; Model: MapSetting }> {
	private _m: MapSetting;
	constructor() {
		super();
	}

	componentDidMount() {
		this._m = this.props.Model;
	}

	private Update(m: MapSetting): void {
		this._m = m;
	}

	render() {
		return (
			<div class="custom-grid-layout-4">
				<div class="custom-grid-layout-3 ">
					<div class="custom-table" style="padding:10px">
						<MapFormComponent Model={this.props.Model} CallBack={this.Update.bind(this)} />
					</div>
				</div>
			</div>
		);
	}
}
