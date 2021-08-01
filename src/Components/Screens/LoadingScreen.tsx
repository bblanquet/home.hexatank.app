import { h, Component } from 'preact';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import Switch from '../Common/Struct/Switch';
import { LoadingState } from '../Model/LoadingState';
import { HookedComponent } from '../Hooks/HookedComponent';
import { LoadingHook } from '../Hooks/LoadingHook';
import { useState } from 'preact/hooks';
import Body from '../Common/Struct/Body';
export default class LoadingScreen extends HookedComponent<{}, LoadingHook, LoadingState> {
	public GetDefaultHook(): LoadingHook {
		return new LoadingHook(useState(LoadingHook.DefaultState()));
	}

	public Rendering(): h.JSX.Element {
		return (
			<Body
				header={null}
				content={
					<div class="sizeContainer absolute-center-middle-2">
						<div class="logo-container">
							<div class="fill-logo-back-container">
								<div class="fill-logo-back spin-fade" />
							</div>
							<div class="fill-tank-logo slow-bounce" />
							<div class="fill-logo" />
						</div>
						<div class="container">
							<div class="progress progress-striped">
								<div class="progress-bar" style={`width:${this.Hook.State.Percentage}%`} />
							</div>
						</div>
						<Switch
							isLeft={this.Hook.State.IsLoading}
							left={
								<div class="container-center" style="color:white;font-weight:bold;text-align:center;">
									{this.Hook.GetSentence()}
								</div>
							}
							right={
								<div class="container-center">
									<Btn OnClick={() => this.Hook.OnStart()} Color={ColorKind.Red}>
										<Icon Value="fas fa-dungeon" /> Continue
									</Btn>
								</div>
							}
						/>
					</div>
				}
				footer={
					<div class="navbar nav-inner" style="font-weight:bold;">
						<div>v 0.8.14</div>
					</div>
				}
			/>
		);
	}
}
