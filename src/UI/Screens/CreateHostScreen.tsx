import { JSX, h } from 'preact';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import SmButtonComponent from '../Common/Button/Stylish/SmButtonComponent';
import Icon from '../Common/Icon/IconComponent';
import MdPanelComponent from '../Components/Panel/MdPanelComponent';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';
import Notification from '../Components/Notification';
import InputComponent from '../Common/Text/TextComponent';
import { CreateHostHook } from '../Hooks/CreateHostHook';
import { useState } from 'preact/hooks';
import { HookedComponent } from '../Hooks/HookedComponent';
import { HostState } from '../Model/HostState';

export default class CreateHostScreen extends HookedComponent<{}, CreateHostHook, HostState> {
	public GetDefaultHook(): CreateHostHook {
		return new CreateHostHook(useState(CreateHostHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<MdPanelComponent>
					<div class="container-center-horizontal" style="margin-bottom:10px">
						<SmButtonComponent callBack={() => this.Hook.Randomize()} color={ColorKind.Blue}>
							<Icon Value="fas fa-random" />
						</SmButtonComponent>
						<div class="space-out" />
						<SmActiveButtonComponent
							left={<Icon Value="fas fa-lock-open" />}
							right={<Icon Value="fas fa-lock" />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Yellow}
							isActive={this.Hook.State.HasPassword}
							callBack={() => this.Hook.HasPassword()}
						/>
					</div>

					<InputComponent
						max={15}
						value={this.Hook.State.PlayerName}
						label={'Name'}
						type={'text'}
						isEditable={true}
						onInput={(e: any) => this.Hook.SetUsername(e.target.value as string)}
					/>
					<InputComponent
						max={15}
						type={'text'}
						value={this.Hook.State.RoomName}
						label={'Room name'}
						isEditable={true}
						onInput={(e: any) => this.Hook.SetRoomname(e.target.value as string)}
					/>
					<div class="container-center-horizontal">
						<Visible isVisible={this.Hook.State.HasPassword}>
							<InputComponent
								max={15}
								type={'text'}
								value={this.Hook.State.Password}
								label={'Password'}
								isEditable={true}
								onInput={(e: any) => this.Hook.SetPassword(e.target.value as string)}
							/>
						</Visible>
					</div>
					<div class="container-center-horizontal">
						<ButtonComponent callBack={() => this.Hook.Back()} color={ColorKind.Black}>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
						<ButtonComponent callBack={() => this.Hook.Start()} color={ColorKind.Red}>
							<Icon Value="far fa-play-circle" /> Start
						</ButtonComponent>
					</div>
				</MdPanelComponent>
				<Notification OnNotification={this.Hook.OnNotification} />
			</Redirect>
		);
	}
}
