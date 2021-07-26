import { h, Component, JSX } from 'preact';
import { ColorKind } from './ColorKind';
import Btn from './Btn';

export default class ActiveBtn extends Component<
	{
		left: JSX.Element;
		right: JSX.Element;
		OnClick: () => void;
		leftColor: ColorKind;
		rightColor: ColorKind;
		isActive: boolean;
	},
	any
> {
	render() {
		if (this.props.isActive) {
			return (
				<Btn Color={this.props.leftColor} OnClick={this.props.OnClick}>
					{this.props.right}
				</Btn>
			);
		} else {
			return (
				<Btn Color={this.props.rightColor} OnClick={this.props.OnClick}>
					{this.props.left}
				</Btn>
			);
		}
	}
}
