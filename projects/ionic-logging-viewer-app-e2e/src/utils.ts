export class Utils {

	public static async sleep(timeout: number): Promise<{}> {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	}
}
