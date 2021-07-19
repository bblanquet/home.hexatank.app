import { h, Component, JSX } from 'preact';
import { ColorKind } from './ColorKind';
import SmBtn from './SmBtn';

export default class SmActiveBtn extends Component<
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
				<SmBtn Color={this.props.leftColor} OnClick={this.props.callBack}>
					{this.props.right}
				</SmBtn>
			);
		} else {
			return (
				<SmBtn Color={this.props.rightColor} OnClick={this.props.callBack}>
					{this.props.left}
				</SmBtn>
			);
		}
	}
}
