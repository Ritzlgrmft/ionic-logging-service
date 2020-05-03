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
	 * There are two cancel buttons: in the modal itself (iOS only) and the confirmation for deleting the messages.
	 */
	cancel: string;

	/**
	 * Ok button.
	 */
	ok: string;

	/**
	 * Placeholder for search bar.
	 */
	searchPlaceholder: string;

	/**
	 * Confirmation message for deleting log messages.
	 */
	confirmDelete: string;
}
