import { h, Component, JSX } from 'preact';
import { ColorKind } from './ColorKind';
import SmButtonComponent from './SmButtonComponent';

export default class SmActiveButtonComponent extends Component<
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
				<SmButtonComponent color={this.props.leftColor} callBack={this.props.callBack}>
					{this.props.right}
				</SmButtonComponent>
			);
		} else {
			return (
				<SmButtonComponent color={this.props.rightColor} callBack={this.props.callBack}>
					{this.props.left}
				</SmButtonComponent>
			);
		}
	}
}
