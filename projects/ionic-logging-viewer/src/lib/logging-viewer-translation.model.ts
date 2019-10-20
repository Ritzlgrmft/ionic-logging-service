/**
 * Describes all values needed in a translation for
 * [LoggingViewerModalComponent](../classes/LoggingViewerModalComponent.html).
 */
export interface LoggingViewerTranslation {
	/**
	 * Title of the modal.
	 */
	title: string;

	/**
	 * Cancel button.
	 * This text is shown only on iOS.
	 * On Android or Windows, just an close-icon is used.
	 */
	cancel: string;

	/**
	 * Placeholder for search bar.
	 */
	searchPlaceholder: string;
}
