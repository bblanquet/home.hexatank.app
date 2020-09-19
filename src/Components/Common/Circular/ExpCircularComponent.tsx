import { h, Component } from 'preact';
import { Point } from '../../../Core/Utils/Geometry/Point';

export default class ExpCircularComponent extends Component<{ OnCancel: () => void }> {
	constructor() {
		super();
		this.setState({
			btns: []
		});
	}

	componentWillMount() {
		if (this.props.children) {
			(this.props.children as any[]).forEach((c) => {
				c.attributes.Point = new Point(0, 0);
			});
		}
	}

	private SetPositions() {
		const btns = this.props.children as any[];
		btns.forEach((c, index) => {
			c.attributes.Point = this.GetPoint(index, btns.length);
		});
		this.setState({});
	}

	componentDidMount() {
		if (this.props) {
			this.setState({});
			setTimeout(() => {
				this.SetPositions();
			}, 700);
		}
	}

	private GetPoint(i: number, total: number): Point {
		const x = Math.cos(i * 2 * Math.PI / total) * 150;
		const y = Math.sin(i * 2 * Math.PI / total) * 150;
		return new Point(x, y);
	}

	componentWillUnmount() {}

	private CancelLogo() {
		return (
			<div class="max-space container-center">
				<div class="fill-cancel max-width standard-space" />
			</div>
		);
	}

	render() {
		return (
			<div class="circular-menu">
				<div
					onClick={() => this.props.OnCancel()}
					class="btn btn-dark btn-circular above-circular bouncing-up-animation"
				>
					{this.CancelLogo()}
				</div>
				{this.props.children}
			</div>
		);
	}
}
