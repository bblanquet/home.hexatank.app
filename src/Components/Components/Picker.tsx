import { h, Component } from 'preact';
import Dropdown from '../Common/Input/Dropdown';
import Icon from '../Common/Icon/IconComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Line from '../Common/Struct/Line';
import { Env } from '../../Env';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import Visible from '../Common/Struct/Visible';

export default class Picker extends Component<
	{ OnClick: (e: string) => void; OnChange: (e: boolean) => void; Values: string[]; Default: string; Label: string },
	{ Value: string; IsFullIA: boolean }
> {
	componentDidMount() {
		this.setState({
			Value: this.props.Default
		});
	}

	render() {
		return (
			<Line>
				<Dropdown
					Color={ColorKind.Red}
					OnInput={(e: any) => {
						this.setState({
							Value: e.target.value as string
						});
					}}
					Default={this.state.Value}
					Label={this.props.Label}
					Values={this.props.Values}
				/>
				<SmBtn Color={ColorKind.Black} OnClick={() => this.props.OnClick(this.state.Value)}>
					<Icon Value="fa fa-plus" />
				</SmBtn>
				<Visible isVisible={!Env.IsPrd()}>
					<SmActiveBtn
						isActive={this.state.IsFullIA}
						right={<Icon Value={'fas fa-code-branch'} />}
						left={<Icon Value={'fas fa-brain'} />}
						leftColor={ColorKind.Black}
						rightColor={ColorKind.Red}
						OnClick={() => {
							const newIa = !this.state.IsFullIA;
							this.setState({ IsFullIA: newIa });
							this.props.OnChange(newIa);
						}}
					/>
				</Visible>
			</Line>
		);
	}
}
