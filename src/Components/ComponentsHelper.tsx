import { h } from 'preact';
import { IconProvider } from './IconProvider';

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
