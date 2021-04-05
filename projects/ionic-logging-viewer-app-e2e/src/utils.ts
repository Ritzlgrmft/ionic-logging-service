export class Utils {

	public static async sleep(timeout: number): Promise<never> {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	}
}
