import { h, Component } from 'preact';

export default class GridComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="container-center-horizontal">
				<div class="custom-grid-layout-3">
					<table class="table table-dark table-striped table-borderless custom-table">
						{this.props.left}
						{this.props.right}
					</table>
				</div>
			</div>
		);
	}
}
