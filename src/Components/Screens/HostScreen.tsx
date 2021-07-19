import { JSX, h } from 'preact';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import Icon from '../Common/Icon/IconComponent';
import Panel from '../Components/Panel/Panel';
import Redirect from '../Components/Redirect';
import Visible from '../Common/Struct/Visible';
import Notification from '../Components/Notification';
import CtmInput from '../Common/Input/CtmInput';
import { HostHook } from '../Hooks/HostHook';
import { useState } from 'preact/hooks';
import { HookedComponent } from '../Hooks/HookedComponent';
import { HostState } from '../Model/HostState';

export default class HostScreen extends HookedComponent<{}, HostHook, HostState> {
	public GetDefaultHook(): HostHook {
		return new HostHook(useState(HostHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Panel
					content={
						<div class="container-center-horizontal">
							<div style="width:90%">
								<div class="container-center-horizontal" style="margin-bottom:10px">
									<SmBtn OnClick={() => this.Hook.Randomize()} Color={ColorKind.Blue}>
										<Icon Value="fas fa-random" />
									</SmBtn>
									<div class="space-out" />
									<SmActiveBtn
										left={<Icon Value="fas fa-lock-open" />}
										right={<Icon Value="fas fa-lock" />}
										leftColor={ColorKind.Black}
										rightColor={ColorKind.Yellow}
										isActive={this.Hook.State.HasPassword}
										callBack={() => this.Hook.HasPassword()}
									/>
								</div>
								<div class="container-center-horizontal">
									<CtmInput
										max={15}
										value={this.Hook.State.PlayerName}
										label={'Name'}
										type={'text'}
										isEditable={true}
										onInput={(e: any) => this.Hook.SetUsername(e.target.value as string)}
									/>
								</div>
								<div class="container-center-horizontal">
									<CtmInput
										max={15}
										type={'text'}
										value={this.Hook.State.RoomName}
										label={'Room name'}
										isEditable={true}
										onInput={(e: any) => this.Hook.SetRoomname(e.target.value as string)}
									/>
								</div>
								<div class="container-center-horizontal">
									<Visible isVisible={this.Hook.State.HasPassword}>
										<CtmInput
											max={15}
											type={'text'}
											value={this.Hook.State.Password}
											label={'Password'}
											isEditable={true}
											onInput={(e: any) => this.Hook.SetPassword(e.target.value as string)}
										/>
									</Visible>
								</div>
							</div>
						</div>
					}
					footer={
						<div class="navbar nav-inner">
							<div class="left">
								<SmBtn OnClick={() => this.Hook.Back()} Color={ColorKind.Black}>
									<Icon Value="fas fa-undo-alt" /> Back
								</SmBtn>
							</div>
							<div class="right">
								<SmBtn OnClick={() => this.Hook.Start()} Color={ColorKind.Red}>
									<Icon Value="far fa-play-circle" /> Start
								</SmBtn>
							</div>
						</div>
					}
				/>

				<Notification OnNotification={this.Hook.OnNotification} />
			</Redirect>
		);
	}
}
