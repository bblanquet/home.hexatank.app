import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class LoadComponent extends Component<any, any> {
    constructor() {
        super();
    }

    render() {
        return (
            <div class="base">
                <div class="centered">
                    <div class="container">
                    <div class="title-container">Program 6</div>
                        <div class="relative-center">
                        <div class="d-flex justify-content-center">
                            <div class="spinner-border text-light" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <p></p>
                            <button type="button" class="btn btn-primary-blue btn-block">Loading...</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
