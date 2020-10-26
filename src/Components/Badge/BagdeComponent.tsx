import { Component, h } from 'preact';
import { route } from 'preact-router';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import Badge from './Badge';
import PanelComponent from '../Common/Panel/PanelComponent';
import Visible from '../Common/Visible/VisibleComponent';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';

export default class BadgeComponent extends Component<any, { text: string }> {
	private _textDiv: HTMLDivElement;
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<Redirect>
				<PanelComponent>
					<div class="container-center">
						<div class="row justify-content-center">
							<div class="col-auto container-center">
								<Badge
									Onclick={(e: string) => {
										this.setState({
											text: e
										});
									}}
									icon={'fill-diamond-badge'}
									percentage={100}
									text={
										'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
									}
								/>
							</div>
							<div class="col-auto container-center">
								<Badge
									Onclick={(e: string) => {
										this.setState({
											text: e
										});
									}}
									icon={'fill-death-badge'}
									percentage={30}
									text={'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis'}
								/>
							</div>
							<div class="w-100 d-none d-md-block " />
							<div class="col-auto container-center">
								<Badge
									Onclick={(e: string) => {
										this.setState({
											text: e
										});
									}}
									icon={'fill-hexa-badge'}
									percentage={10}
									text={
										'ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.'
									}
								/>
							</div>
							<div class="col-auto container-center">
								<Badge
									Onclick={(e: string) => {
										this.setState({
											text: e
										});
									}}
									icon={'fill-tank-badge'}
									percentage={70}
									text={'Quis autem vel eum iure reprehenderit qui in ea voluptate'}
								/>
							</div>
						</div>
						<Visible isVisible={!isNullOrUndefined(this.state.text)}>
							<div class="container-center-horizontal">
								<div
									class="text-detail"
									ref={(e: HTMLDivElement) => {
										this._textDiv = e;
									}}
								>
									{this.state.text}
								</div>
							</div>
						</Visible>

						<ButtonComponent
							callBack={() => {
								this.Back();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
					</div>
				</PanelComponent>
			</Redirect>
		);
	}

	private Back() {
		route('/Home', true);
	}
}
