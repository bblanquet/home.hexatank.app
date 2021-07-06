import { h, Component } from 'preact';
import Icon from '../../Icon/IconComponent';
import { ButtonOption } from '../ButtonOption';

export default class DropDownBtn extends Component<{ title: string; icon: string; items: ButtonOption[] }, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="dropdown show">
				<div class="custom-btn-layout-4 fit-content btn-space" data-toggle="dropdown">
					<div class="custom-btn-layout-3 fit-content">
						<div class="red-secondary custom-btn-layout-2 fit-content">
							<div class="red-primary custom-btn-layout-1 fit-content">
								<Icon Value={this.props.icon} /> {this.props.title}
							</div>
						</div>
					</div>
				</div>
				<div class="dropdown-menu custom-drop-down-menu" aria-labelledby="dropdownMenuLink">
					{this.props.items.map((option) => {
						return (
							<div class="custom-drop-down-button" onClick={option.Do}>
								{option.Text}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
