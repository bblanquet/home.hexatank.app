import { Component, h } from 'preact';
import { ButtonProp } from './ButtonProp';
import Visible from '../../Common/Struct/Visible';

export default class MenuBtn extends Component<{ Btn: ButtonProp }, {}> {
	render() {
		return (
			<button
				type="button"
				class={`btn ${this.props.Btn.Color} without-padding ${this.props.Btn.isBlink ? 'blink_me' : ''}`}
				onClick={(e: any) => this.props.Btn.OnCLick()}
				style="overflow:hidden"
			>
				<div class={`${this.props.Btn.Icon} max-width standard-space`} />
				<Visible isVisible={0 < this.props.Btn.Text.length}>
					<div class="max-width align-text-center darker">{this.props.Btn.Text}</div>
				</Visible>
			</button>
		);
	}
}
