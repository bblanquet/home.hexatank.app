import { h, Component } from 'preact';
import Icon from '../../Icon/IconComponent';
import ButtonComponent from './ButtonComponent';
import { ColorKind } from './ColorKind';

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
			<ButtonComponent
				callBack={() => {
					this.ForceFileClick();
				}}
				color={ColorKind.Blue}
			>
				<Icon Value={this.props.icon} /> {this.props.title}
			</ButtonComponent>
		);
	}

	private ForceFileClick(): void {
		return this._fileInput.click();
	}
}
