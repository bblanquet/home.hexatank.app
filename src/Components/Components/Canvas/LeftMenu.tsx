import { Component, h } from 'preact';
import { ButtonProp } from './ButtonProp';
import MenuBtn from './MenuBtn';

export default class LeftMenu extends Component<
	{
		Btns: ButtonProp[];
	},
	{}
> {
	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						{this.props.Btns.map((button) => <MenuBtn Btn={button} />)}
					</div>
				</div>
			</div>
		);
	}
}
