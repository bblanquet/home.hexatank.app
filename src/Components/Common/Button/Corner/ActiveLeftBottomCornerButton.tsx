import { h, Component, JSX } from 'preact';
import LeftBottomCornerButton from './LeftBottomCornerButton';

export default class ActiveLeftBottomCornerButton extends Component<
	{
		callBack: () => void;
		isActive: boolean;
	},
	any
> {
	render() {
		if (this.props.isActive) {
			return <LeftBottomCornerButton isSelected={this.props.isActive} callBack={this.props.callBack} />;
		} else {
			return <LeftBottomCornerButton isSelected={this.props.isActive} callBack={this.props.callBack} />;
		}
	}
}
