import { h, Component } from 'preact';

export default class Icon extends Component<{ Value: string }, { force: number }> {
	private _icon: HTMLElement;

	constructor() {
		super();
		this.setState({
			force: 0
		});
	}

	componentDidMount() {
		if (this.IsSvgGenerated()) {
			this.setState({ force: this.state.force + 1 });
		}
	}

	componentDidUpdate() {
		if (this.IsSvgGenerated()) {
			this.setState({ force: this.state.force + 1 });
		}
	}

	private IsSvgGenerated() {
		return (
			this._icon.childNodes.length === 0 ||
			(this._icon.childNodes.length === 1 && this._icon.childNodes[0] instanceof SVGElement)
		);
	}

	private Generate() {
		if (this._icon && this.IsSvgGenerated()) {
			return <i class={this.props.Value} />;
		}
	}

	render() {
		return (
			<span
				ref={(dom) => {
					this._icon = dom;
				}}
			>
				{this.Generate()}
			</span>
		);
	}
}
