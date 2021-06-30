import { h, Component } from 'preact';
import { LogKind } from '../../../../Utils/Logger/LogKind';
import { StaticLogger } from '../../../../Utils/Logger/StaticLogger';
import Icon from '../../Icon/IconComponent';
import ButtonComponent from './ButtonComponent';
import { ColorKind } from './ColorKind';

export default class UploadButtonComponent extends Component<
	{ callBack: (e: any) => void; title: string; icon: string },
	any
> {
	private _fileInput: HTMLInputElement;
	private _callback: any = (e: any) => this.props.callBack(e);
	constructor() {
		super();
		this._fileInput = document.createElement('input') as HTMLInputElement;
		this._fileInput.type = 'file';
	}
	componentDidMount() {
		if (this._fileInput.onchange !== this._callback) {
			this._fileInput.onchange = this._callback;
		}
	}

	render() {
		return (
			<ButtonComponent
				callBack={() => {
					this._fileInput.click();
				}}
				color={ColorKind.Blue}
			>
				<Icon Value={this.props.icon} /> {this.props.title}
			</ButtonComponent>
		);
	}
}
