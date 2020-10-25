import { h, Component } from 'preact';
import { MapSetting } from './MapSetting';
import DropDownComponent from '../Common/DropDown/DropDownComponent';
import Redirect from '../Redirect/RedirectComponent';
import Visible from '../Common/Visible/VisibleComponent';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';
import { isEqual } from 'lodash';

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
					<p />
				</Visible>
			</Redirect>
		);
	}
}
