import { Component, h } from 'preact';
import Visible from '../Common/Struct/Visible';

export default class TopButtons extends Component<{ OnClick: () => void; HasWarning: boolean; Amount: number }, {}> {
	render() {
		return (
			<div style="position: fixed;">
				<button
					type="button"
					class="btn btn-dark small-space space-out fill-option"
					onClick={() => this.props.OnClick()}
				/>
				<button type="button" class="btn btn-dark space-out">
					<Visible isVisible={this.props.HasWarning}>
						<span class="fill-noMoney badge badge-warning very-small-space middle very-small-right-margin blink_me">
							{' '}
						</span>
					</Visible>
					{this.props.Amount.toFixed(2)}
					<span class="fill-diamond badge badge-secondary very-small-space middle very-small-left-margin very-small-right-margin">
						{' '}
					</span>
				</button>
			</div>
		);
	}
}
