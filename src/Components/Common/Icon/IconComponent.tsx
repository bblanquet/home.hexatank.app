import { h, Component } from 'preact';

export default class Icon extends Component<{ Value: string }, any> {
	private _isFirstRender = true;

	constructor() {
		super();
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	public GetIcon(isDisplayed: boolean, className: string) {
		return <span>{this.GetContent(isDisplayed, className)}</span>;
	}

	private GetContent(isDisplayed: boolean, className: string) {
		if (!isDisplayed) {
			return '';
		}
		return <i class={className} />;
	}

	render() {
		return this.GetIcon(this._isFirstRender, this.props.Value);
	}
}
