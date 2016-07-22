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
export class FCRemoteIcal {
  private static _queue: number = 0;
  private static _$fc: JQuery = null;
  static get STYLES_DEBUG_HIGHLIGHTED(): string { return "font-weight: bold; color: indigo;"; }
  static get STYLES_DEBUG(): string { return "font-weight: bold; color: blue;"; }
  private static _recurringEvents: Array<ICALRecurringComponent> = [];
  private static _lookUpTable: Array<string> = (function() {
    let lookups = [];
    for (let i = 0; i < 256; i++) {
      lookups[i] = (i < 16 ? "0" : "") + (i).toString(16);
    }
    return lookups;
  })();

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
  public static import($fc: JQuery, icals: Array<RemoteSource>): void {
    if ($fc && icals.length) {
      FCRemoteIcal._$fc = $fc;
      FCRemoteIcal._queue = icals.length;
      FCRemoteIcal._recurringEvents = [];
      for (let ical of icals) {
        jQuery.get(ical.url, null, function(data) {
          $fc.fullCalendar("addEventSource", FCRemoteIcal._parseCalendar(data, ical.defaults));
          FCRemoteIcal._dequeue();
        }, "text");
      }
    }
  }

  /**
   * Dequeues a remote source. When the queue is empty, then inserts
   * all the found recurring events into the FullCalendar instance.
   * @internal
   * @private
   * @static
   * @version 1.0.0
   */
  private static _dequeue(): void {
    if (!--FCRemoteIcal._queue) {
      FCRemoteIcal._$fc.fullCalendar("addEventSource", FCRemoteIcal._expandRecurringEvents);
    }
  }

  /**
   * Sets up an internal queue to collect all the valid unique iCalendar events and sets the
   * callbacks for both event types: unique and recurring.
   * @internal
   * @param {string} ical The iCalendar.
   * @param {EventObject} defaults An object with the defaults to apply to the calendar parsed events.
   * @private
   * @return {FullCalendar.EventObject[]} The parsed FullCalendar **single** events.
   * @static
   * @version 1.0.0
   */
  private static _parseCalendar(ical: string, defaults: FcEventObjectDefaults): Array<FullCalendar.EventObject> {
    let uniqueEvents: Array<FullCalendar.EventObject> = [];
    let cbUniqueEvent: IcalEventCallback = (event: ICAL.Component) => {
      FCRemoteIcal._parseEvent(event, (event: FullCalendar.EventObject) => {
        uniqueEvents.push(FCRemoteIcal._mergeEventOptions(event, defaults));
      });
    };
    let cbRecurringEvent: IcalEventCallback = (event: ICALRecurringComponent) => {
      event.defaults = defaults;
      FCRemoteIcal._recurringEvents.push(event);
    };
    FCRemoteIcal._parseEvents(ical, cbUniqueEvent, cbRecurringEvent);
    return uniqueEvents;
  }

  /**
   * Parses all iCalendar events into FullCalendar events.
   * @internal
   * @param {string} ical The iCalendar content.
   * @param {IcalEventCallback} cbUniqueEvent Parses a unique event into a FC event and enqueues it.
   * @param {IcalEventCallback} cbRecurringEvent Enqueues the recurring event for post-processing
   *                                             after all remote sources have been dequeued.
   * @private
   * @static
   * @version 1.0.0
   */
  private static _parseEvents(ical: string, cbUniqueEvent: IcalEventCallback, cbRecurringEvent: IcalEventCallback): void {
    let jcal: Array<Object>|Object = ICAL.parse(ical);
    let calendar = new ICAL.Component(jcal);
    let events: Array<ICAL.Component> = calendar.getAllSubcomponents(Tag.EVENT);

    for (let event of events) {
      if (event.hasProperty(Tag.RECURRING_RULE)) {
        cbRecurringEvent(event);
      } else {
        cbUniqueEvent(event);
      }
    }
  }

  /**
   * Quickly generates a random RFC4122v4-compliant UUID (not safe to avoid collisions).
   * According to the source of the code, you have a 1-in-a-million chance of collision.
   * @author Robert Kieffer (http://broofa.com/)
   * @internal
   * @private
   * @returns {string} The random RFC4122v4-compliant UUID.
   * @see {@link http://stackoverflow.com/questions/105034/#answer-2117523| Stackoverflow: Create GUID / UUID in JavaScript?}
   * @see {@link http://www.ietf.org/rfc/rfc4122.txt|RFC 4122: A Universally Unique IDentifier (UUID) URN Namespace}
   * @static
   * @summary Generates a random RFC4122-compliant UUID.
   * @version 1.0.0
   */
  private static _randomQuickUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(char) {
      const random = Math.random() * 16 | 0;
      let value = char === "x" ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  /**
   * Generates a random RFC4122v4-compliant UUID (not safe to avoid collisions).
   * @author Jeff Ward (jcward.com), Dave.
   * @internal
   * @private
   * @returns {string} The random RFC4122v4-compliant UUID.
   * @see {@link http://stackoverflow.com/questions/105034/#answer-21963136| Stackoverflow: Create GUID/UUID in JavaScript?}
   * @see {@link http://www.ietf.org/rfc/rfc4122.txt|RFC 4122: A Universally Unique IDentifier (UUID) URN Namespace}
   * @static
   * @version 1.0.0
   **/
  private static _randomUUID(): string {
    const lut: Array<string> = FCRemoteIcal._lookUpTable;
    let d0, d1, d2, d3;
    if (window && window.crypto && window.crypto.getRandomValues) {
      let dvals = new Uint32Array(4);
      window.crypto.getRandomValues(dvals);
      d0 = dvals[0];
      d1 = dvals[1];
      d2 = dvals[2];
      d3 = dvals[3];
    } else {
      // Jeff's original was `Math.random() * 0xffffffff | 0`, but we use code from Dave's comment
      d0 = Math.random() * 0x100000000 >>> 0;
      d1 = Math.random() * 0x100000000 >>> 0;
      d2 = Math.random() * 0x100000000 >>> 0;
      d3 = Math.random() * 0x100000000 >>> 0;
    }
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + "-" +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + "-" + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + "-" +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + "-" + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[ d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  };

  /**
   * Parses an iCalendar vEvent into a FullCalendar event object.
   * If the iCalendar vEvent `dtstart` prop is undefined, then that vEvent is skipped.
   * If the iCalendar vEvent `dtend` prop is undefined, the that vEvent duration is set to *all day*.
   * @internal
   * @param {ICAL.Component} event The iCalendar vEvent to transform.
   * @param {FcEventCallback} cbEvent The callback to pass the parsed FullCalendar event object.
   * @private
   * @static
   * @summary Parses an iCalendar vEvent into a FullCalendar event object.
   * @throws {TypeError} Will throw an error if `dtstart` property of the iCal `vevent` event is not defined.
   * @version 1.0.0
   */
  private static _parseEvent(event: ICAL.Component, cbEvent: FcEventCallback): void {
    let uid: string = event.getFirstPropertyValue(Tag.UID).toString() || FCRemoteIcal._randomUUID();
    let classSuffix: string = (uid || "").replace(/[^\w\s]/gi, "");
    let start: moment.Moment;
    let end: moment.Moment;
    let allDay: boolean = false;

    try {
      start = moment(event.getFirstPropertyValue(Tag.TIME_START).toJSDate());
    } catch (TypeError) {
      console.debug("Undefined '%s', %s skipped (%s: %c%s%c).", Tag.TIME_START,
        Tag.EVENT, Tag.UID, FCRemoteIcal.STYLES_DEBUG_HIGHLIGHTED, uid, FCRemoteIcal.STYLES_DEBUG);
      return;
    }

    try {
      end = moment(event.getFirstPropertyValue(Tag.TIME_END).toJSDate());
    } catch (TypeError) {
      /*console.debug("Undefined '%s', %s duration set to allDay (%s: %c%s%c).", Tag.TIME_END,
        Tag.EVENT, Tag.UID, FCRemoteIcal.STYLES_DEBUG_HIGHLIGHTED, uid, FCRemoteIcal.STYLES_DEBUG);*/
      allDay = true;
    }

    let fcEvent: FullCalendar.EventObject = {
      id: uid,
      title: event.getFirstPropertyValue(Tag.SUMMARY) || "",
      start: start,
      end: end,
      allDay: allDay,
      // url: event.getFirstPropertyValue(Tag.URL) || "",
      className: ["event-" + classSuffix]
    };

    cbEvent(fcEvent);
  }

  /**
   * Merges the event options with the default options provided for the events
   * of the currently under process iCalendar. The provided event object is
   * modified by the method, and returned too.
   * The event object options takes precedence over the defaults.
   * @internal
   * @param {FullCalendar.EventObject} event The FullCalendar event object (modified by the method).
   * @param {FcEventObjectDefaults} defaults Default options to merge with the own ones.
   * @private
   * @return {FullCalendar.EventObject} The merged FullCalendar event object.
   * @static
   * @summary Merges a FullCalendar event object with the provided defaults.
   * @version 1.0.0
   */
  private static _mergeEventOptions(event: FullCalendar.EventObject, defaults: FcEventObjectDefaults): FullCalendar.EventObject {
    for (let option in defaults) {
      if (option === "className") {
        event[option] = event[option].concat(defaults[option]);
      } else if (!event[option]) {
        event[option] = defaults[option];
      }
    }
    return event;
  }

  /**
   * Converts a Moment.js time object into an ICAL.Time object.
   * @internal
   * @param  {moment.Moment} moment The Moment.js object.
   * @param {string|boolean} timezone The calendar's current timezone.
   * @private
   * @return {ICAL.Time} The converted object.
   * @todo Take into account the timezone.
   * @version 1.0.0
   */
  private static _momentIcalTime(moment: moment.Moment, timezone) {
    return new ICAL.Time().fromJSDate(moment.toDate());
  }

  /**
   * Expands the recurring events available in the requested calendar range.
   * @internal
   * @param {moment.Moment} rangeStart The start of the range FullCalendar needs events for.
   * @param {moment.Moment} rangeEnd The end of the range FullCalendar needs events for.
   * @param {string|boolean} timezone The calendar's current timezone.
   * @param {FcEventsCallback} cbEvents A function that must be called when the custom event function has generated its events.
   * @private
   * @static
   * @version 1.0.0
   */
  static _expandRecurringEvents(rangeStart: moment.Moment, rangeEnd: moment.Moment,
      timezone: string|boolean, cbEvents: FcEventsCallback): void {
    let events: Array<FullCalendar.EventObject> = [];
    let event: ICALRecurringComponent;
    for (let event of FCRemoteIcal._recurringEvents) {
      let defaults = event.defaults;
      delete event.defaults;
      FCRemoteIcal._expandRecurringEvent(
        event,
        FCRemoteIcal._momentIcalTime(rangeStart, timezone),
        FCRemoteIcal._momentIcalTime(rangeEnd, timezone),
        function(event) {
          FCRemoteIcal._parseEvent(event, function(event) {
            FCRemoteIcal._mergeEventOptions(event, {className: ["recurring"]});
            events.push(FCRemoteIcal._mergeEventOptions(event, defaults));
          });
        }
      );
    }
    cbEvents(events);
  }

  /**
   * Expands the provided iCalendar event between the range `[rangeStart, rangeEnd]`.
   * @internal
   * @param {ICAL.Component} event The event to expand.
   * @param {ICAL.Time} rangeStart The start of the range FullCalendar needs events for.
   * @param {ICAL.Time} rangeEnd The end of the range FullCalendar needs events for.
   * @param {IcalEventCallback} cbEvent Process the iCalendar event (usually parses
   *                            it into FC event and merges its options with the defaults.
   * @private
   * @static
   * @version 1.0.0
   */
  private static _expandRecurringEvent(event: ICAL.Component,
      rangeStart: ICAL.Time, rangeEnd: ICAL.Time, cbEvent: IcalEventCallback): void {
    let expansion: ICAL.RecurExpansion = new ICAL.RecurExpansion({
      component: event,
      dtstart: event.getFirstPropertyValue(Tag.TIME_START)
    });
    let duration = FCRemoteIcal._eventDuration(event);
    while (!expansion.complete && expansion.next() < rangeEnd) {
      if (expansion.last >= rangeStart) {
        event = new ICAL.Component(event.toJSON());
        event.updatePropertyWithValue(Tag.TIME_START, expansion.last);
        event.updatePropertyWithValue(Tag.TIME_END, FCRemoteIcal._eventEnd(expansion.last, duration));
        cbEvent(event);
      }
    }
  }

  /**
   * Returns the duration of an iCalendar event.
   * @internal
   * @param {ICAL.Component} event The event to calc its duration.
   * @private
   * @return {number} The event duration.
   * @static
   * @version 1.0.0
   */
  private static _eventDuration(event: ICAL.Component): number {
    return new Date(event.getFirstPropertyValue(Tag.TIME_END).toJSDate()
      - event.getFirstPropertyValue(Tag.TIME_START).toJSDate()).getTime();
  }

  /**
   * Returns the end time of an event, provided its start time and duration.
   * @internal
   * @param {ICAL.Time} start The start time of the iCalendar event.
   * @param {number} duration The duration of the iCalendar event.
   * @private
   * @return {ICAL.Time} The end time of the event.
   * @static
   * @version 1.0.0
   */
  private static _eventEnd(start: ICAL.Time, duration: number): ICAL.Time {
    return new ICAL.Time().fromJSDate(new Date(start.toJSDate().getTime() + duration));
  }
}

/**
 * String enum of the iCalendar tags.
 * @internal
 */
class Tag {
  static get ACTION(): string { return "action"; }
  static get ATTENDEE(): string { return "attendee"; }
  static get CALENDAR(): string { return "calendar"; }
  static get CATEGORIES(): string { return "categories"; }
  static get CREATED(): string { return "created"; }
  static get DESCRIPTION(): string { return "description"; }
  static get EVENT(): string { return "vevent"; }
  static get LAST_MODIFIED(): string { return "last-modified"; }
  static get LOCATION(): string { return "location"; }
  static get RECURRING_RULE(): string { return "rrule"; }
  static get SEQUENCE(): string { return "sequence"; }
  static get STATUS(): string { return "status"; }
  static get SUMMARY(): string { return "summary"; }
  static get TIME_END(): string { return "dtend"; }
  static get TIME_STAMP(): string { return "dtstamp"; }
  static get TIME_START(): string { return "dtstart"; }
  static get TRANSPARENCY(): string { return "transp"; }
  static get TRIGGER(): string { return "trigger"; }
  static get UID(): string { return "uid"; }
  static get URL(): string { return "url"; }
}
