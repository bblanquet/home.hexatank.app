import { h, Component } from 'preact';
import { Point } from '../../../../Utils/Geometry/Point';

export default class LightDarkBtn extends Component<{ CallBack: () => void; Icon: string; Point: Point }, {}> {
	render() {
		return (
			<a
				onClick={() => this.props.CallBack()}
				class="menuItem"
				style={`left:${this.props.Point.X}%;top:${this.props.Point.Y}%`}
			>
				<div className="btn btn-light" role="button" style={`opacity:${this.props.Point.IsOrigin() ? 0 : 1};`}>
					<div class={`${this.props.Icon} circular-space`} />
				</div>
			</a>
		);
	}
}
