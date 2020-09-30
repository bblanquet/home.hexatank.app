import { h, Component } from 'preact';
import Icon from '../../Icon/IconComponent';

export default class UploadButtonComponent extends Component<
	{ callBack: (e: any) => void; title: string; icon: string },
	any
> {
	private _fileInput: HTMLInputElement;
	constructor() {
		super();
		this._fileInput = document.createElement('input') as HTMLInputElement;
		this._fileInput.type = 'file';
	}
	componentDidMount() {
		this._fileInput.onchange = (e: any) => this.props.callBack(e);
	}

	componentWillUnmount() {}

	render() {
		return (
			<div class="custom-border-layout-3 fit-content btn-space">
				<div class="custom-border-layout-2 fit-content">
					<div class="custom-blue-border fit-content">
						<div class="custom-blue-btn fit-content" onClick={() => this.ForceFileClick()}>
							<Icon Value={this.props.icon} /> {this.props.title}
						</div>
					</div>
				</div>
			</div>
		);
	}

	private ForceFileClick(): void {
		return this._fileInput.click();
	}
}
