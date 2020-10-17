import { h, Component } from 'preact';
import ButtonComponent from '../../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../../Common/Button/Stylish/ColorKind';
import Icon from '../../../Common/Icon/IconComponent';
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
			<div class="generalContainer absolute-center-middle-menu simple-menu-container fit-content">
				<div class="title-popup-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-logo" />
				</div>
				<div class="container-center">
					<MapFormComponent Model={this.props.Model} CallBack={this.Update.bind(this)} />
					<div class="container-center-horizontal">
						<ButtonComponent color={ColorKind.Red} callBack={() => this.props.Update(this._m)}>
							<Icon Value="fas fa-undo-alt" /> Save
						</ButtonComponent>
					</div>
				</div>
			</div>
		);
	}
}
