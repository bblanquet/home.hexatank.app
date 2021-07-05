import { h, Component, JSX } from 'preact';
import { ColorKind } from './ColorKind';
import ButtonComponent from './ButtonComponent';

export default class ActiveButtonComponent extends Component<
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
				<ButtonComponent color={this.props.leftColor} callBack={this.props.callBack}>
					{this.props.right}
				</ButtonComponent>
			);
		} else {
			return (
				<ButtonComponent color={this.props.rightColor} callBack={this.props.callBack}>
					{this.props.left}
				</ButtonComponent>
			);
		}
	}
}
