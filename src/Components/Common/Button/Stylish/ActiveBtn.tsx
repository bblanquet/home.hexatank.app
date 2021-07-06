import { h, Component, JSX } from 'preact';
import { ColorKind } from './ColorKind';
import Btn from './Btn';

export default class ActiveBtn extends Component<
	{
		left: JSX.Element;
		right: JSX.Element;
		callBack: () => void;
		leftColor: ColorKind;
		rightColor: ColorKind;
		isActive: boolean;
	},
	any
> {
	render() {
		if (this.props.isActive) {
			return (
				<Btn color={this.props.leftColor} callBack={this.props.callBack}>
					{this.props.right}
				</Btn>
			);
		} else {
			return (
				<Btn color={this.props.rightColor} callBack={this.props.callBack}>
					{this.props.left}
				</Btn>
			);
		}
	}
}
