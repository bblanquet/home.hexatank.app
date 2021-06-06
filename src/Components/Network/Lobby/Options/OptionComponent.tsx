import { h, Component } from 'preact';
import MapFormComponent from '../../../Form/MapFormComponent';
import { MapSetting } from '../../../Form/MapSetting';

export default class OptionComponent extends Component<{ Model: MapSetting }> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="custom-grid-layout-4">
				<div class="custom-grid-layout-3 ">
					<div class="custom-table" style="padding:10px">
						<MapFormComponent
							Model={this.props.Model}
							CallBack={(m: MapSetting) => {
								this.props.Model.Env = m.Env;
								this.props.Model.IaCount = m.IaCount;
								this.props.Model.MapType = m.MapType;
								this.props.Model.Size = m.Size;
								this.props.Model.onylIa = m.onylIa;
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}
