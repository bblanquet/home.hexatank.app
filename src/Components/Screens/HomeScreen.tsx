import { h, Component } from 'preact';
import { route } from 'preact-router';
import Btn from '../Common/Button/Stylish/Btn';
import DropDownBtn from '../Common/Button/Stylish/DropDownBtn';
import { ButtonOption } from '../Common/Button/ButtonOption';
import Icon from '../Common/Icon/IconComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Visible from '../Common/Struct/Visible';
import { Env } from '../../Utils/Env';
import Panel from '../Components/Panel/Panel';
import Grid from '../Common/Grid/GridComponent';
import Notification from '../Components/Notification';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import Line from '../Common/Struct/Line';
import CtmInput from '../Common/Input/CtmInput';
import Column from '../Common/Struct/Column';
import Switch from '../Common/Struct/Switch';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { HookedComponent } from '../Framework/HookedComponent';
import { HomeHook } from '../Hooks/HomeHook';
import { HomeState } from '../Model/HomeState';
import { useState } from 'preact/hooks';
import { HomeKind } from '../Model/HomeKind';

export default class HomeScreen extends HookedComponent<{}, HomeHook, HomeState> {
	public GetDefaultHook() {
		const [ state, setState ] = useState(HomeHook.DefaultState());
		return new HomeHook(state, setState);
	}

	public Rendering(): h.JSX.Element {
		return (
			<Panel
				content={
					<span>
						<Visible isVisible={this.Hook.State.Kind === HomeKind.Home}>
							<div class="container-center">
								<Btn Color={ColorKind.Red} OnClick={() => route('{{sub_path}}Green', true)}>
									<Icon Value="fas fa-dungeon" /> Campaign
								</Btn>
								<Btn Color={ColorKind.Red} OnClick={() => route('{{sub_path}}SinglePlayer', true)}>
									<Icon Value="fas fa-gamepad" /> Play
								</Btn>
								<DropDownBtn
									icon={'fas fa-network-wired'}
									title={'Multiplayers'}
									items={[
										new ButtonOption('Guest', () => route('{{sub_path}}Guest', true)),
										new ButtonOption('Host', () => route('{{sub_path}}Host', true))
									]}
								/>
								<Btn Color={ColorKind.Black} OnClick={() => route('{{sub_path}}Profil', true)}>
									<Icon Value="fas fa-history" /> History
								</Btn>
								<Btn Color={ColorKind.Yellow} OnClick={() => route('{{sub_path}}Ranking', true)}>
									<Icon Value="fas fa-medal" /> Ranking
								</Btn>
								<Visible isVisible={!Env.IsPrd()}>
									<Btn Color={ColorKind.Blue} OnClick={() => route('{{sub_path}}Monitoring', true)}>
										<Icon Value="fab fa-watchman-monitoring" /> Monitoring
									</Btn>
								</Visible>
							</div>
						</Visible>
						<Visible isVisible={this.Hook.State.Kind === HomeKind.Version}>
							<Grid
								left={
									<thead>
										<tr class="d-flex">
											<th>Versions</th>
										</tr>
									</thead>
								}
								right={
									<tbody>
										<tr class="d-flex flex-column ">
											{this.Hook.GetVersions().map((version) => (
												<td>
													<span style="font-weight:bold">
														<Icon Value="fas fa-truck" /> {version.Name}
													</span>
													{version.Features.map((feature) => <div>&#183; {feature}</div>)}
													<div style="font-weight:bold">Bug hunters</div>
													{version.Hunters.map((feature) => <div>&#183; {feature}</div>)}
												</td>
											))}
										</tr>
									</tbody>
								}
							/>
						</Visible>
						<Visible isVisible={this.Hook.State.Kind === HomeKind.Login}>
							<Switch
								isLeft={this.Hook.HasToken()}
								left={
									<div class="container-center">
										<div class="text-detail shadowEffect width80percent">
											<h5 class="card-title">Welcome {this.Hook.GetName()}</h5>
											<p class="card-text">You are currently ranked #{this.Hook.State.Rank}.</p>
											<p />
											<Line>
												<SmBtn
													OnClick={() => {
														this.Hook.LogOut();
													}}
													Color={ColorKind.Red}
												>
													<Icon Value="fas fa-sign-in-alt" /> Log out
												</SmBtn>
											</Line>
										</div>
									</div>
								}
								right={
									<Column>
										<Line>
											<CtmInput
												max={15}
												type={'text'}
												value={this.Hook.State.Name}
												label={'Name'}
												isEditable={true}
												onInput={(e: any) => {
													this.Hook.SetName(e.target.value);
												}}
											/>
										</Line>
										<Line>
											<CtmInput
												max={15}
												type={'password'}
												value={this.Hook.State.Password}
												label={'Password'}
												isEditable={true}
												onInput={(e: any) => {
													this.Hook.SetPassword(e.target.value);
												}}
											/>
										</Line>
										<Line>
											<SmBtn OnClick={() => this.Hook.SignUp()} Color={ColorKind.Yellow}>
												<Icon Value="fas fa-user-plus" /> Sign up
											</SmBtn>
											<SmBtn OnClick={() => this.Hook.SignIn()} Color={ColorKind.Blue}>
												<Icon Value="fas fa-sign-in-alt" /> Sign in
											</SmBtn>
										</Line>
									</Column>
								}
							/>
						</Visible>
						<Notification OnNotification={this.Hook.State.Notification} />
					</span>
				}
				footer={
					<div class="navbar nav-inner" style="font-weight:bold;">
						<div>v {this.Hook.GetVersion()}</div>
						<Line>
							<SmActiveBtn
								left={<Icon Value="fas fa-home" />}
								right={<Icon Value="fas fa-home" />}
								isActive={this.Hook.State.Kind === HomeKind.Home}
								leftColor={ColorKind.Red}
								rightColor={ColorKind.Black}
								OnClick={() => {
									this.Hook.SetKind(HomeKind.Home);
								}}
							/>
							<SmActiveBtn
								left={<Icon Value="fas fa-truck" />}
								right={<Icon Value="fas fa-truck" />}
								isActive={this.Hook.State.Kind === HomeKind.Version}
								leftColor={ColorKind.Red}
								rightColor={ColorKind.Black}
								OnClick={() => {
									this.Hook.SetKind(HomeKind.Version);
								}}
							/>
							<SmActiveBtn
								left={
									<Switch
										isLeft={this.Hook.HasToken()}
										left={<Icon Value="fas fa-id-card-alt" />}
										right={<Icon Value="fas fa-sign-in-alt" />}
									/>
								}
								right={
									<Switch
										isLeft={this.Hook.HasToken()}
										left={<Icon Value="fas fa-id-card-alt" />}
										right={<Icon Value="fas fa-sign-in-alt" />}
									/>
								}
								isActive={this.Hook.State.Kind === HomeKind.Login}
								leftColor={ColorKind.Red}
								rightColor={ColorKind.Black}
								OnClick={() => {
									this.Hook.SetKind(HomeKind.Login);
								}}
							/>
						</Line>
					</div>
				}
			/>
		);
	}
}
