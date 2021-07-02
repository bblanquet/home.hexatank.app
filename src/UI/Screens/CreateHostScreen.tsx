import { Component, h } from 'preact';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import SmButtonComponent from '../Common/Button/Stylish/SmButtonComponent';
import Icon from '../Common/Icon/IconComponent';
import MdPanelComponent from '../Components/Panel/MdPanelComponent';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';
import Notification from '../Components/Notification/NotificationComponent';
import InputComponent from '../Common/Text/TextComponent';
import { CreateHostHook } from '../Hooks/CreateHostHook';
import { useState } from 'preact/hooks';

export default class CreateHostScreen extends Component<{}, {}> {
	private _hook: CreateHostHook;
	constructor() {
		super();
		const [ state, setState ] = useState(CreateHostHook.DefaultState());
		this._hook = new CreateHostHook(state, setState);
	}

	componentWillUnmount() {
		this._hook.Unmount();
	}

	render() {
		return (
			<Redirect>
				<Notification OnNotification={this._hook.OnNotification}>
					<MdPanelComponent>
						<div class="container-center-horizontal" style="margin-bottom:10px">
							<SmButtonComponent callBack={() => this._hook.Randomize()} color={ColorKind.Blue}>
								<Icon Value="fas fa-random" />
							</SmButtonComponent>
							<div class="space-out" />
							<SmActiveButtonComponent
								left={<Icon Value="fas fa-lock-open" />}
								right={<Icon Value="fas fa-lock" />}
								leftColor={ColorKind.Black}
								rightColor={ColorKind.Yellow}
								isActive={this._hook.State.HasPassword}
								callBack={() => this._hook.HasPassword()}
							/>
						</div>

						<InputComponent
							max={15}
							value={this._hook.State.PlayerName}
							label={'Name'}
							type={'text'}
							isEditable={true}
							onInput={(e: any) => this._hook.SetUsername(e.target.value as string)}
						/>
						<InputComponent
							max={15}
							type={'text'}
							value={this._hook.State.RoomName}
							label={'Room name'}
							isEditable={true}
							onInput={(e: any) => this._hook.SetRoomname(e.target.value as string)}
						/>
						<div class="container-center-horizontal">
							<Visible isVisible={this._hook.State.HasPassword}>
								<InputComponent
									max={15}
									type={'text'}
									value={this._hook.State.Password}
									label={'Password'}
									isEditable={true}
									onInput={(e: any) => this._hook.SetPassword(e.target.value as string)}
								/>
							</Visible>
						</div>
						<div class="container-center-horizontal">
							<ButtonComponent callBack={() => this._hook.Back()} color={ColorKind.Black}>
								<Icon Value="fas fa-undo-alt" /> Back
							</ButtonComponent>
							<ButtonComponent callBack={() => this._hook.Start()} color={ColorKind.Red}>
								<Icon Value="far fa-play-circle" /> Start
							</ButtonComponent>
						</div>
					</MdPanelComponent>
				</Notification>
			</Redirect>
		);
	}
}
