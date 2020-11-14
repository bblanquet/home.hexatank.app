import { Component, h } from 'preact';
import ButtonComponent from './ButtonComponent';
import Icon from './../../Icon/IconComponent';
import { ColorKind } from './ColorKind';
import { Howl } from 'howler';
import { AudioContent } from '../../../../Core/Framework/AudioArchiver';
import { SpriteProvider } from '../../../../Core/Framework/SpriteProvider';

export class LockButton extends Component<any, any> {
	private _lockDiv: any;

	render() {
		return (
			<ButtonComponent
				ref={(e: any) => {
					this._lockDiv = e;
				}}
				callBack={() => {
					new Howl({
						src: [ `${SpriteProvider.Root()}${AudioContent.nok}` ]
					}).play();

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
