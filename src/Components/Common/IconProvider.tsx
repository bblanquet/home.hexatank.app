import { h } from 'preact';

export class IconProvider {
	public static GetIcon(isDisplayed: boolean, className: string) {
		return <span>{this.GetContent(isDisplayed, className)}</span>;
	}

	private static GetContent(isDisplayed: boolean, className: string) {
		if (!isDisplayed) {
			return '';
		}
		return <i class={className} />;
	}
}
