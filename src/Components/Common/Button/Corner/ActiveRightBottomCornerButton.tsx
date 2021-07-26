import { h, Component, JSX } from 'preact';
import RightBottomCornerButton from './RightBottomCornerButton';
export default class ActiveRightBottomCornerButton extends Component<
	{
		callBack: () => void;
		isActive: boolean;
		logo: string;
	},
	any
> {
	render() {
		if (this.props.isActive) {
			return (
				<RightBottomCornerButton
					isSelected={this.props.isActive}
					OnClick={this.props.callBack}
					logo={this.props.logo}
				/>
			);
		} else {
			return (
				<RightBottomCornerButton
					isSelected={this.props.isActive}
					OnClick={this.props.callBack}
					logo={this.props.logo}
				/>
			);
		}
	}
}
