import { h, Component } from 'preact';

export default class GridComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="container-center-horizontal">
				<div class="custom-border-layout-3 fit-content">
					<div class="custom-border-layout-2 fit-content">
						<table class="table table-dark table-striped table-borderless custom-table">
							{this.props.left}
							{this.props.right}
						</table>
					</div>
				</div>
			</div>
		);
	}
}
