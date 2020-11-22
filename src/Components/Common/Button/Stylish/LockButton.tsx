import { Component, h } from 'preact';
import ButtonComponent from './ButtonComponent';
import Icon from './../../Icon/IconComponent';
import { ColorKind } from './ColorKind';
import { AudioContent } from '../../../../Core/Framework/AudioArchiver';
import { Factory, FactoryKey } from '../../../../Factory';
import { ISoundService } from '../../../../Services/Sound/ISoundService';

export class LockButton extends Component<any, any> {
	private _lockDiv: any;

	render() {
		return (
			<ButtonComponent
				ref={(e: any) => {
					this._lockDiv = e;
				}}
				callBack={() => {
					Factory.Load<ISoundService>(FactoryKey.Sound).Play(`${AudioContent.nok}`, 0.1);
					this._lockDiv.base.classList.remove('bounce');
					setTimeout(() => {
						this._lockDiv.base.classList.add('bounce');
					}, 10);
				}}
				color={ColorKind.Yellow}
				isMute={true}
			>
				<Icon Value="fas fa-lock" />
			</ButtonComponent>
		);
	}
}
