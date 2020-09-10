import { h } from 'preact';

export class ComponentsHelper {
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
