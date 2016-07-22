/**
 * Allows importing remote iCalendars into FullCalendar.
 * Based on https://github.com/2733/icalendar2fullcalendar.
 * @author Carlos García (carlosgarcia.engineer)
 * @copyright Carlos García 2016
 * @license MIT
 * @module cgalvarez/fc-remote-ical
 * @requires mozilla-comm/ical.js
 * @version 1.0.0
 */
export declare class FCRemoteIcal {
    private static _queue;
    private static _$fc;
    static STYLES_DEBUG_HIGHLIGHTED: string;
    static STYLES_DEBUG: string;
    private static _recurringEvents;
    private static _lookUpTable;
    /**
     * Imports the collection of remote iCalendars provided and inserts them into the desired FullCalendar instance.
     * @param {JQuery} $fc The jQuery object of the FullCalendar DOM element.
     * @param {Array<RemoteSource>} icals The collection of remote iCalendars.
     * @public
     * @static
     * @todo Allow providing an array with already used event IDs to avoid collisions.
     * @todo Take into account the iCalendar timezone.
     * @todo Parse the iCal `description` prop into FullCalendar event unofficial `description` property.
     * @todo Map the iCal `categories` prop into classNames/styles.
     * @version 1.0.0
     */
    static import($fc: JQuery, icals: Array<RemoteSource>): void;
}
