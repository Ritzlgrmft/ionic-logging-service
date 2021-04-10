import { Layout } from "./Layout";
import { Log4JavaScript } from "./Log4JavaScript";
import { Logger } from "./Logger";
import { LoggingEvent } from "./LoggingEvent";
import { PatternLayout } from "./PatternLayout";

export abstract class Appender {
	private layout: Layout = new PatternLayout();
	private threshold = Level.ALL;
	private loggers: Logger[] = [];

	/**
	 * Performs threshold checks before delegating actual logging to the
	 * subclass's specific append method.
	 *
	 * @param loggingEvent
	 */
	public doAppend(loggingEvent: LoggingEvent) {
		if (Log4JavaScript.isEnabled() && loggingEvent.level.level >= this.threshold.level) {
			this.append(loggingEvent);
		}
	}

	public setLayout(layout: Layout) {
		this.layout = layout;
	}

	public getLayout(): Layout {
		return this.layout;
	};

	public setThreshold(threshold: Level) {
		this.threshold = threshold;
	}

	public getThreshold(): Level {
		return this.threshold;
	};

	public setAddedToLogger(logger: Logger) {
		this.loggers.push(logger);
	};

	public setRemovedFromLogger(logger: Logger) {
		const index = this.loggers.indexOf(logger);
		if (index >= 0) {
			this.loggers.splice(index, 1);
		}
	}

	// public group = emptyFunction;
	// public groupEnd = emptyFunction;

	public abstract toString(): string;

	public abstract append(loggingEvent: LoggingEvent): void;

}
