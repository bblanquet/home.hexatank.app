import { Component, h } from 'preact';
import ButtonComponent from './ButtonComponent';
import Icon from './../../Icon/IconComponent';
import { ColorKind } from './ColorKind';
import { AudioArchive } from '../../../../Core/Framework/AudioArchiver';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { IAudioService } from '../../../../Services/Audio/IAudioService';

export class LockButton extends Component<any, any> {
	private _lockDiv: any;

	render() {
		return (
			<ButtonComponent
				ref={(e: any) => {
					this._lockDiv = e;
				}}
				callBack={() => {
					Singletons.Load<IAudioService>(SingletonKey.Audio).Play(`${AudioArchive.nok}`, 0.1);
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
