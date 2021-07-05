import { h, Component } from 'preact';

export default class Icon extends Component<{ Value: string }, {}> {
	private _span: HTMLElement;
	private _iconKey: string = '';

	constructor() {
		super();
	}

	private HasRightSvg() {
		return this.HasSvg() && this.IsRightIcon();
	}

	private IsRightIcon() {
		return this._iconKey === this.props.Value;
	}

	private HasSvg(): boolean {
		if (!this._span) {
			return false;
		}
		for (let index = 0; index < this._span.childNodes.length; index++) {
			if (this._span.childNodes[index] instanceof SVGElement) {
				return true;
			}
		}
		return false;
	}

	private RemoveAllChildren(): void {
		while (this._span.firstChild) {
			this._span.removeChild(this._span.lastChild);
		}
	}

	private Generate() {
		if (this.HasSvg() && !this.IsRightIcon()) {
			this.RemoveAllChildren();
		}

		if (!this.HasRightSvg()) {
			this._iconKey = this.props.Value;
			return <i class={this.props.Value} />;
		}
	}

	render() {
		return (
			<span
				ref={(dom) => {
					this._span = dom;
				}}
			>
				{this.Generate()}
			</span>
		);
	}
}
