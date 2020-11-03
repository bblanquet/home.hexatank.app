import { Component, h } from 'preact';
import ButtonComponent from './ButtonComponent';
import Icon from './../../Icon/IconComponent';
import { ColorKind } from './ColorKind';

export class LockButton extends Component<any, any> {
	private _lockDiv: any;

	render() {
		return (
			<ButtonComponent
				ref={(e: any) => {
					this._lockDiv = e;
				}}
				callBack={() => {
					this._lockDiv.base.classList.remove('bounce');
					setTimeout(() => {
						this._lockDiv.base.classList.add('bounce');
					}, 10);
				}}
				color={ColorKind.Yellow}
			>
				<Icon Value="fas fa-lock" />
			</ButtonComponent>
		);
	}
}
