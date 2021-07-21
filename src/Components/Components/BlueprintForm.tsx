import { h, Component } from 'preact';
import { BlueprintSetup } from '../Model/BlueprintSetup';
import Dropdown from '../Common/Input/Dropdown';
import { isEqual } from 'lodash';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import Line from '../Common/Struct/Line';
import Picker from './Picker';
import Grid from '../Common/Grid/GridComponent';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Column from '../Common/Struct/Column';

export default class BlueprintForm extends Component<
	{ Model: BlueprintSetup; OnChanged: (model: BlueprintSetup) => void; EnableEmptyIa: boolean },
	BlueprintSetup
> {
	componentDidMount() {
		this.setState(new BlueprintSetup());
		if (!isEqual(this.state, this.props.Model)) {
			this.setState(this.props.Model);
		}
	}

	componentDidUpdate() {
		if (!isEqual(this.state, this.props.Model)) {
			this.props.OnChanged(this.state);
		}
	}

	render() {
		return (
			<span>
				<Column>
					<Line>
						<Dropdown
							Color={ColorKind.Black}
							OnInput={(e: any) => {
								this.setState({
									Env: e.target.value
								});
							}}
							Default={this.state.Env}
							Label={'Env'}
							Values={[ 'Forest', 'Sand', 'Ice' ]}
						/>
					</Line>
					<Line>
						<Dropdown
							Color={ColorKind.Black}
							OnInput={(e: any) => {
								this.setState({
									Shape: e.target.value
								});
							}}
							Default={this.state.Shape}
							Label={'Shape'}
							Values={[ 'Flower', 'Donut', 'Cheese', 'Triangle', 'Y', 'H', 'X', 'Rectangle' ]}
						/>
					</Line>
				</Column>
				<Grid left={this.GetHeader()} right={this.GetContent()} isFitContent={true} />
			</span>
		);
	}

	private GetHeader() {
		return (
			<thead style="margin-left:10px;margin-right:10px;">
				<tr>
					<th>
						<Picker
							Label={'IA'}
							OnClick={(e: string) => {
								if (this.state.IAs.length < 3) {
									this.setState({
										IAs: this.state.IAs.concat([ e ])
									});
								}
							}}
							OnChange={(e: boolean) => {
								this.setState({
									IsFullIA: e
								});
							}}
							Default={'Weak'}
							Values={[ 'Weak', 'Normal', 'Strong', 'Dummy', 'Kamikaze' ]}
						/>
					</th>
				</tr>
			</thead>
		);
	}

	private GetContent() {
		return (
			<tbody style="margin-left:10px;margin-right:10px;">
				{!this.state.IAs ? (
					''
				) : (
					this.state.IAs.map((ia, index) => (
						<tr class="d-flex">
							<td class="align-self-center">
								<SmBtn
									Color={ColorKind.Black}
									OnClick={() => {
										if (this.props.EnableEmptyIa || 1 < this.state.IAs.length) {
											this.setState({ IAs: this.state.IAs.filter((ia, i) => i !== index) });
										}
									}}
								>
									<Icon Value="fa fa-minus" />
								</SmBtn>
							</td>
							<td class="align-self-center">
								{' '}
								<Icon Value="fas fa-code-branch" /> {index}{' '}
							</td>
							<td class="align-self-center">{ia}</td>
						</tr>
					))
				)}
			</tbody>
		);
	}
}
