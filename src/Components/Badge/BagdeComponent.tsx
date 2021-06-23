import { Component, h } from 'preact';
import { route } from 'preact-router';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import Badge from './Badge';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';

export default class BadgeComponent extends Component<any, { text: string }> {
	private _data: any[] = [
		{
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			icon: 'fill-diamond-badge',
			percentage: 100
		},
		{
			text: 'At vero eos et accusamus et iusto odio dignissimos ducimus',
			icon: 'fill-death-badge-gray',
			percentage: 20
		},
		{
			text: 'ut aut reiciendis voluptatibus maiores alias consequatur .',
			icon: 'fill-hexa-badge',
			percentage: 10
		},
		{
			text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate',
			icon: 'fill-tank-badge',
			percentage: 70
		},
		{
			text: 'At vero eos et accusamus et iusto odio dignissimos ducimus',
			icon: 'fill-death-badge',
			percentage: 100
		},
		{
			text: 'ut aut reiciendis voluptatibus maiores alias consequatur .',
			icon: 'fill-campaign-badge',
			percentage: 100
		},
		{
			text: 'Quis autem vel eum iure reprehenderit qui in ea ',
			icon: 'fill-tank-badge',
			percentage: 70
		},
		{
			text: 'Quis autem vel eum iure reprehenderit qui in ea ',
			icon: 'fill-tank-badge',
			percentage: 70
		},
		{
			text: 'Quis autem vel eum iure reprehenderit qui in ea ',
			icon: 'fill-tank-badge',
			percentage: 70
		}
	];
	private _textDiv: HTMLDivElement;
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<Redirect>
				<SmPanelComponent>
					<div class="container-center">
						<div
							class="text-detail effect7"
							ref={(e: HTMLDivElement) => {
								this._textDiv = e;
							}}
						>
							<div class="d-flex flex-wrap justify-content-center">
								{this._data.map((d) => (
									<div style="padding-left:5px;padding-right:5px;">
										<Badge
											Onclick={(e: string) => {
												this.setState({
													text: e
												});
											}}
											icon={d.icon}
											percentage={d.percentage}
											text={d.text}
										/>
									</div>
								))}
							</div>
							<hr />
							<div class="container-center-horizontal">
								<div style="min-height:50px;max-height:50px;">{this.state.text}</div>
							</div>
						</div>
						<div class="container-center-horizontal">
							<ButtonComponent
								callBack={() => {
									this.Back();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Back
							</ButtonComponent>
						</div>
					</div>
				</SmPanelComponent>
			</Redirect>
		);
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}
}
