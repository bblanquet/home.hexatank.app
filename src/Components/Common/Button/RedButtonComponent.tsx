import { h, Component } from 'preact';
import { IconProvider } from '../IconProvider';

export default class RedButtonComponent extends Component<
	{ callBack: () => void; title: string; isFirstRender: boolean; icon: string },
	any
> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="custom-border-layout-3 fit-content btn-space">
				<div class="custom-border-layout-2 fit-content">
					<div class="custom-red-border fit-content">
						<div class="custom-btn fit-content" onClick={() => this.props.callBack()}>
							{IconProvider.GetIcon(this.props.isFirstRender, this.props.icon)} {this.props.title}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
