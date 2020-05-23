import { LoggingViewerTranslation } from "../logging-viewer-translation.model";

/**
 * Describes all properties which can be passed to the
 * [LoggingViewerModalComponent](../classes/LoggingViewerModalComponent.html).
 */
export interface LoggingViewerModalProperties {

	/**
	 * Language to be used for the modal.
	 * Currently supported: en, de
	 */
	language?: string;

	/**
	 * Translation to be used for the modal.
	 * If specified, the language is ignored.
	 */
	translation?: LoggingViewerTranslation;

	/**
	 * Comma-separated list of localStorageKeys. If set, the logs get loaded from localStorage instead of memory.
	 */
	localStorageKeys?: string;

	/**
	 * Flag showing a delete button, which removes all existing log messages.
	 */
	allowClearLogs?: boolean;
}
