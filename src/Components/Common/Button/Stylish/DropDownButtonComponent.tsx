import { h, Component } from 'preact';
import { IconProvider } from '../../IconProvider';
import { ButtonOption } from '../ButtonOption';

export default class DropDownButtonComponent extends Component<
	{ title: string; isFirstRender: boolean; icon: string; items: ButtonOption[] },
	any
> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="dropdown show">
				<div class="custom-border-layout-3 fit-content btn-space" data-toggle="dropdown">
					<div class="custom-border-layout-2 fit-content">
						<div class="custom-red-border fit-content ">
							<div class="custom-btn fit-content">
								{IconProvider.GetIcon(this.props.isFirstRender, this.props.icon)} {this.props.title}
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
