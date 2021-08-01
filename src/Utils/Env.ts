export class Env {
	private static string = '{{current_env}}';
	public static IsPrd(): boolean {
		return 'PRD' === this.string;
	}
}
