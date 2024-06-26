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
import { Env } from '../../Utils/Env';
import Visible from '../Common/Struct/Visible';
import ImgPicker from '../Common/Picker/ImgPicker';
import TextPicker from '../Common/Picker/TextPicker';

export default class BlueprintForm extends Component<
	{ Model: BlueprintSetup; OnChanged: (model: BlueprintSetup) => void; EnableEmptyIa: boolean; EnableColor: boolean },
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
					<Visible isVisible={this.props.EnableColor}>
						<ImgPicker
							Items={[
								{ Css: 'fill-blue-tank', Color: 'white' },
								{ Css: 'fill-black-tank', Color: 'white' },
								{ Css: 'fill-red-tank', Color: 'white' },
								{ Css: 'fill-yellow-tank', Color: 'white' },
								{ Css: 'fill-purple-tank', Color: 'white' }
							]}
							OnSelected={(e: number) => {
								this.setState({
									Color: [ 'Blue', 'VP', 'Red', 'Yellow', 'MM' ][e]
								});
							}}
						/>
					</Visible>
					<ImgPicker
						Items={[
							{ Css: 'fill-forest-tree', Color: '#00a651' },
							{ Css: 'fill-sand-tree', Color: '#fece63' },
							{ Css: 'fill-ice-tree', Color: '#acddf3' }
						]}
						OnSelected={(e: number) => {
							this.setState({
								Env: [ 'Forest', 'Sand', 'Ice' ][e]
							});
						}}
					/>
					<TextPicker
						Items={[ 'Flower', 'Donut', 'Cheese', 'Triangle', 'Y', 'H', 'X', 'Rectangle' ]}
						OnSelected={(e: number) => {
							this.setState({
								Shape: [ 'Flower', 'Donut', 'Cheese', 'Triangle', 'Y', 'H', 'X', 'Rectangle' ][e]
							});
						}}
					/>
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
							Values={this.GetIas()}
						/>
					</th>
				</tr>
			</thead>
		);
	}

	private GetIas(): string[] {
		if (Env.IsPrd()) {
			return [ 'Weak', 'Normal', 'Strong' ];
		} else {
			return [ 'Weak', 'Normal', 'Strong', 'Dummy', 'Kamikaze' ];
		}
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
