import { h, Component } from 'preact';
import { Point } from '../../../../Core/Utils/Geometry/Point';

export default class SmWhiteBtnComponent extends Component<{ CallBack: () => void; icon: string; Point: Point }, {}> {
	constructor() {
		super();
	}

	render() {
		return (
			<div
				className="btn btn-light btn-circular"
				style={`transform:translate(${this.props.Point.X}px,${this.props.Point
					.Y}px); opacity:${this.props.Point.IsOrigin() ? 0 : 1}`}
			>
				<div class="big-circular-space container-center" onClick={() => this.props.CallBack()}>
					<div class={`${this.props.icon} big-circular-space`} />
				</div>
			</div>
		);
	}
}
