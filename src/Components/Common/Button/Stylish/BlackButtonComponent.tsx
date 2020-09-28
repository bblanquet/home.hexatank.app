import { h, Component } from 'preact';
import { IconProvider } from '../../IconProvider';

export default class BlackButtonComponent extends Component<
	{ callBack: () => void; title: string; icon: string },
	any
> {
	private _isFirstRender = true;

	constructor() {
		super();
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	render() {
		return (
			<div class="custom-border-layout-3 fit-content btn-space">
				<div class="custom-border-layout-2 fit-content">
					<div class="custom-black-border fit-content">
						<div class="custom-black-btn fit-content" onClick={() => this.props.callBack()}>
							{IconProvider.GetIcon(this._isFirstRender, this.props.icon)} {this.props.title}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
