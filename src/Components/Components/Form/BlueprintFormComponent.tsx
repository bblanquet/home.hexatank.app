import { h, Component } from 'preact';
import { BlueprintSetup } from './BlueprintSetup';
import Dropdown from '../../Common/Input/Dropdown';
import Redirect from '../Redirect';
import Visible from '../../Common/Struct/Visible';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { isEqual } from 'lodash';
import SmActiveBtn from '../../Common/Button/Stylish/SmActiveBtn';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import Line from '../../Common/Struct/Line';

export default class BlueprintFormComponent extends Component<
	{ Model: BlueprintSetup; CallBack: (model: BlueprintSetup) => void },
	BlueprintSetup
> {
	constructor() {
		super();
		this.setState(new BlueprintSetup());
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
					<Line>
						<Dropdown
							OnInput={(e: any) => {
								this.setState({
									IaCount: Number(e.target.value)
								});
							}}
							DefaultValue={this.state.IaCount.toString()}
							Label={'IA'}
							Values={[ '0', '1', '2', '3' ]}
						/>
						<div class="space-out" />
						<SmActiveBtn
							isActive={this.state.onylIa}
							right={<Icon Value={'fas fa-code-branch'} />}
							left={<Icon Value={'fas fa-brain'} />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Red}
							callBack={() => {
								this.setState({ onylIa: !this.state.onylIa });
							}}
						/>
					</Line>
					<Line>
						<Dropdown
							OnInput={(e: any) => {
								this.setState({
									Env: e.target.value
								});
							}}
							DefaultValue={this.state.Env.toString()}
							Label={'Env'}
							Values={[ 'Forest', 'Sand', 'Ice' ]}
						/>
					</Line>
					<Line>
						<Dropdown
							OnInput={(e: any) => {
								this.setState({
									Shape: e.target.value
								});
							}}
							DefaultValue={this.state.Shape.toString()}
							Label={'Shape'}
							Values={[ 'Flower', 'Donut', 'Cheese', 'Triangle', 'Y', 'H', 'X', 'Rectangle' ]}
						/>
					</Line>
				</Visible>
			</Redirect>
		);
	}
}
