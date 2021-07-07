export interface ILoader {
	Loading(path: string, onLoaded: () => void): void;
}
