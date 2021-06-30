import { h, Component } from 'preact';
import Icon from '../../Icon/IconComponent';
import { ColorKind } from './ColorKind';
import SmButtonComponent from './SmButtonComponent';

export default class SmUploadButtonComponent extends Component<
	{ callBack: (e: any) => void; icon: string; color: ColorKind },
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
			<SmButtonComponent
				callBack={() => {
					this.ForceFileClick();
				}}
				color={this.props.color}
			>
				<Icon Value={this.props.icon} />
			</SmButtonComponent>
		);
	}

	private ForceFileClick(): void {
		return this._fileInput.click();
	}
}
