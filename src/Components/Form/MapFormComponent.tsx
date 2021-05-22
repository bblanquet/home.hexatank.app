import { h, Component } from 'preact';
import { MapSetting } from './MapSetting';
import DropDownComponent from '../Common/DropDown/DropDownComponent';
import Redirect from '../Redirect/RedirectComponent';
import Visible from '../Common/Visible/VisibleComponent';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';
import { isEqual } from 'lodash';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';

export default class MapFormComponent extends Component<
	{ Model: MapSetting; CallBack: (model: MapSetting) => void },
	MapSetting
> {
	constructor() {
		super();
		this.setState(new MapSetting());
	}
	componentDidMount() {
		if (!isEqual(this.state, this.props.Model)) {
			this.setState(this.props.Model);
		}
	}

	componentDidUpdate() {
		if (!isEqual(this.state, this.props.Model)) {
			this.props.CallBack(this.state);
		}
	}

	render() {
		return (
			<Redirect>
				<Visible isVisible={!isNullOrUndefined(this.state) && !isNullOrUndefined(this.props)}>
					<div class="container-center-horizontal">
						<DropDownComponent
							OnInput={(e: any) => {
								this.setState({
									IaCount: Number(e.target.value)
								});
							}}
							DefaultValue={this.state.IaCount.toString()}
							Label={'IA'}
							Values={[ '0', '1', '2', '3' ]}
						/>
						<SmActiveButtonComponent
							isActive={this.state.onylIa}
							left={<Icon Value={'fas fa-brain'} />}
							right={<Icon Value={'fas fa-code-branch'} />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							callBack={() => {
								this.setState({ onylIa: !this.state.onylIa });
							}}
						/>
					</div>
					<div class="container-center-horizontal">
						<DropDownComponent
							OnInput={(e: any) => {
								this.setState({
									Env: e.target.value
								});
							}}
							DefaultValue={this.state.Env.toString()}
							Label={'Env'}
							Values={[ 'Forest', 'Sand', 'Ice' ]}
						/>
					</div>
					<div class="container-center-horizontal">
						<DropDownComponent
							OnInput={(e: any) => {
								this.setState({
									Size: e.target.value
								});
							}}
							DefaultValue={this.state.Size.toString()}
							Label={'Size'}
							Values={[ 'Small', 'Medium', 'Large' ]}
						/>
					</div>
					<div class="container-center-horizontal">
						<DropDownComponent
							OnInput={(e: any) => {
								this.setState({
									MapType: e.target.value
								});
							}}
							DefaultValue={this.state.MapType.toString()}
							Label={'Shape'}
							Values={[ 'Flower', 'Donut', 'Cheese', 'Triangle', 'Y', 'H', 'X', 'Rectangle' ]}
						/>
					</div>
					<p />
				</Visible>
			</Redirect>
		);
	}
}
