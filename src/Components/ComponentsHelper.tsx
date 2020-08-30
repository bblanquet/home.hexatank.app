import { h } from 'preact';
import { IconProvider } from './IconProvider';
import { ButtonOption } from './ButtonOption';

export class ComponentsHelper {
	public static GetRedButton(isFirstRender: boolean, icon: string, text: string, func: (e: any) => void) {
		return (
			<div class="custom-border-layout-3 fit-content btn-space">
				<div class="custom-border-layout-2 fit-content">
					<div class="custom-red-border fit-content">
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
				<div class="custom-border-layout-3 fit-content btn-space" data-toggle="dropdown">
					<div class="custom-border-layout-2 fit-content">
						<div class="custom-red-border fit-content ">
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
			<div class="custom-border-layout-3 fit-content btn-space">
				<div class="custom-border-layout-2 fit-content">
					<div class="custom-black-border fit-content">
						<div class="custom-black-btn fit-content" onClick={func}>
							{IconProvider.GetIcon(isFirstRender, icon)} {text}
						</div>
					</div>
				</div>
			</div>
		);
	}

	public static GetSmBlackButton(text: string, func: (e: any) => void) {
		return (
			<div class="custom-sm-border-layout fit-content">
				<div class="custom-sm-black-border fit-content">
					<div class="custom-black-btn fit-content" onClick={func}>
						{text}
					</div>
				</div>
			</div>
		);
	}

	public static GetGrid(header: JSX.Element, content: JSX.Element) {
		return (
			<div class="container-center-horizontal">
				<div class="custom-border-layout-3 fit-content">
					<div class="custom-border-layout-2 fit-content">
						<table class="table table-dark table-striped table-borderless custom-table">
							{header}
							{content}
						</table>
					</div>
				</div>
			</div>
		);
	}
}
