import { h } from 'preact';
import { IconProvider } from './IconProvider';
import { ButtonOption } from './ButtonOption';

export class ComponentsHelper {
	public static GetRedButton(isFirstRender: boolean, icon: string, text: string, func: (e: any) => void) {
		return (
			<div class="custom-btn-border3 fit-content btn-space">
				<div class="custom-btn-border2 fit-content">
					<div class="custom-btn-border fit-content">
						<div class="custom-btn fit-content" onClick={func}>
							{IconProvider.GetIcon(isFirstRender, icon)} {text}
						</div>
					</div>
				</div>
			</div>
		);
	}

	public static GetDropRedButton(isFirstRender: boolean, icon: string, text: string, options: Array<ButtonOption>) {
		return (
			<div class="dropdown show">
				<div class="custom-btn-border3 fit-content btn-space" data-toggle="dropdown">
					<div class="custom-btn-border2 fit-content">
						<div class="custom-btn-border fit-content ">
							<div class="custom-btn fit-content">
								{IconProvider.GetIcon(isFirstRender, icon)} {text}
							</div>
						</div>
					</div>
				</div>
				<div class="dropdown-menu custom-drop-down-menu" aria-labelledby="dropdownMenuLink">
					{options.map((option) => {
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

	public static GetBlackButton(isFirstRender: boolean, icon: string, text: string, func: (e: any) => void) {
		return (
			<div class="custom-btn-border3 fit-content btn-space">
				<div class="custom-btn-border2 fit-content">
					<div class="custom-btn-black-border fit-content">
						<div class="custom-black-btn fit-content" onClick={func}>
							{IconProvider.GetIcon(isFirstRender, icon)} {text}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
