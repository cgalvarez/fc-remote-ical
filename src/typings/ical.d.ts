declare var ICAL: ICAL.Instance;

declare namespace ICAL {

  /*****************************************************************************
   * ICAL.Parse
   */
  interface Parse {
    /**
     * Parses iCalendar or vCard data into a raw jCal object.
     * @param {String} input The string data to parse.
     * @return {Object|Object[]} A single jCal object, or an array thereof.
     */
    constructor(input: string): Array<Object>|Object;
    new(input: string): Array<Object>|Object;
  }

  /*****************************************************************************
   * ICAL.Property
   */
  interface Property {
    /**
     * Provides a layer on top of the raw jCal object for manipulating a single property, with its parameters and value.
     * @param {(string|string[])} jCal Raw jCal representation OR the new name of the property.
     * @param {ICAL.Component} parent The parent component.
     * @return {ICAL.Property}
     */
    (jCal: string | Array<string>, parent: ICAL.Component): ICAL.Property;
    new(jCal: string | Array<string>, parent: ICAL.Component): ICAL.Property;
  }

  /*****************************************************************************
   * ICAL.Component
   */

  /**
   * Wraps a jCal component, adding convenience methods to add, remove and
   * update subcomponents and properties.
   */
  interface Component {
    // Status: partial; private members/methods omitted.
    constructor(jCal: Array<Object>|Object, parent?: ICAL.Component): ICAL.Component;
    new(jCal: Array<Object>|Object, parent?: ICAL.Component): ICAL.Component;

    /**
     * Adds an {@link ICAL.Property} to the component.
     * @param {ICAL.Property} property The property to add.
     * @return {ICAL.Property} The passed in property.
     */
    addProperty(property: ICAL.Property): ICAL.Property;

    /**
     * Helper method to add a property with a value to the component.
     * @param {string} name Property name to add.
     * @param {string|number|object} value Property value.
     * @return {ICAL.Property} The created property.
     */
    addPropertyWithValue(name: string, value: string | number | Object): ICAL.Property;

    /**
     * Adds a single sub component.
     * @param {ICAL.Component} component The component to add.
     * @return {ICAL.Component} The passed in component.
     */
    addSubcomponent(component: ICAL.Component): ICAL.Component;

    /**
     * Create an ICAL.Component by parsing the passed iCalendar string.
     * @param {String} str The iCalendar string to parse.
     */
    fromString(str: string): ICAL.Component;

    /**
     * Get all properties in the component, optionally filtered by name.
     * @param {?string} name Lowercase property name.
     * @return {ICAL.Property[]} List of properties.
     */
    getAllProperties(name?: string): Array<ICAL.Property>;

    /**
     * Finds all sub components, optionally filtering by name.
     * @param {?string} name Optional name to filter by.
     * @return {?ICAL.Component[]} The found sub components.
     */
    getAllSubcomponents(name?: string): Array<ICAL.Component>;
    getAllSubcomponents(name?: string): void;

    /**
     * Finds the first property, optionally with the given name.
     * @param {?string} name Lowercase property name.
     * @return {?ICAL.Property} The found property.
     */
    getFirstProperty(name?: string): ICAL.Property;
    getFirstProperty(name?: string): void;

    /**
     * Returns the first property's value, if available.
     * @param {string} name Lowercase property name.
     * @return {?string|ICAL.Time} The found property value.
     */
    getFirstPropertyValue(name: string): any;

    /**
     * Finds first sub component, optionally filtered by name.
     *
     * @param {?string} name Optional name to filter by.
     * @return {?ICAL.Component} The found subcomponent.
     */
    getFirstSubcomponent(name?: string): ICAL.Component;
    getFirstSubcomponent(name?: string): void;

    /**
     * Returns true when a named property exists.
     * @param {string} name The property name.
     * @return {boolean} True, when property is found.
     */
    hasProperty(property: string): boolean;

    /**
     * The name of this component.
     * @return {string} The name of this component.
     */
    name(): string;

    /**
     * Removes all properties associated with this component, optionally filtered by name.
     * @param {string} name Lowercase property name.
     * @return {boolean} True, when deleted.
     */
    removeAllProperties(name: string): boolean;

    /**
     * Removes all components or (if given) all components by a particular name.
     * @param {String} name Lowercase component name.
     */
    removeAllSubcomponents(name): void;

    /**
     * Removes a single property by name or the instance of the specific property.
     * @param {string|ICAL.Property} nameOrProp Property name or instance to remove.
     * @return {boolean} True, when deleted.
     */
    removeProperty(nameOrProp: string|ICAL.Property): boolean;

    /**
     * Removes a single component by name or the instance of a specific component.
     * @param {ICAL.Component|string} nameOrComp Name of component, or component.
     * @return {boolean} True when comp is removed.
     */
    removeSubcomponent(nameOrComp: ICAL.Component|string): boolean;

    /**
     * Returns the Object representation of this component. The returned object
     * is a live jCal object and should be cloned if modified.
     * @return {Object}
     */
    toJSON(): JSON;

    /**
     * The string representation of this component.
     * @return {string}
     */
    toString(): string;

    /**
     * Updates or creates a property of the given name and sets its value.
     * If multiple properties with the given name exist, only the first is updated.
     * @param {string} name Property name to update.
     * @param {string|number|ICAL.Time|Object} value Property value.
     * @return {ICAL.Property} The created property.
     */
    updatePropertyWithValue(name: string, value: string|number|Object|ICAL.Time): ICAL.Property;
  }

  /*****************************************************************************
   * ICAL.Duration
   */
  interface DurationData {
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isNegative: boolean; // If true, the duration is negative
  }
  /**
   * This class represents the "duration" value type, with various calculation
   * and manipulation methods.
   */
  interface Duration {
    // Status: partial; private members/methods omitted.
    constructor(data: ICAL.DurationData): ICAL.Duration;
    new(data: ICAL.DurationData): ICAL.Duration;

    /** The weeks in this duration. Defaults to 0. */
    weeks: number;
    /** The days in this duration. Defaults to 0. */
    days: number;
    /** The days in this duration. Defaults to 0. */
    hours: number;
    /** The minutes in this duration. Defaults to 0. */
    minutes: number;
    /** The seconds in this duration. Defaults to 0. */
    seconds: number;
    /** The seconds in this duration. Defaults to 0. */
    isNegative: number;
    /** The class identifier. Defaults to "icalduration". */
    icalclass: string;
    /** The type name, to be used in the jCal object. Defaults to "duration". */
    icaltype: string;

    /**
     * Returns a clone of the duration object.
     * @return {ICAL.Duration} The cloned object.
     */
    clone(): ICAL.Duration;

    /**
     * Compares the duration instance with another one.
     * @param {ICAL.Duration} aOther The instance to compare with.
     * @return {number} -1, 0 or 1 for less/equal/greater.
     */
    compare(aOther: ICAL.Duration): number;

    /**
     * Sets up the current instance using members from the passed data object.
     * @param {ICAL.DurationData} aData An object with members of the duration.
     */
    fromData(aData: ICAL.DurationData): boolean;

    /**
     * Reads the passed seconds value into this duration object. Afterwards, members
     * like ICAL.Duration.days and ICAL.Duration.weeks will be set up accordingly.
     * @param {number} aSeconds The duration value in seconds.
     * @return {ICAL.Duration} Returns this instance.
     */
    fromSeconds(aSeconds: number): ICAL.Duration;

    /**
     * Normalizes the duration instance. For example, a duration with a value
     * of 61 seconds will be normalized to 1 minute and 1 second.
     */
    normalize(): void;

    /**
     * Resets the duration instance to the default values, i.e. PT0S.
     */
    reset(): void;

    /**
     * The iCalendar string representation of this duration.
     * @return {string}
     */
    toICALString(): string;

    /**
     * The duration value expressed as a number of seconds.
     * @return {number} The duration value in seconds.
     */
    toSeconds(): number;

    /**
     * The string representation of this duration.
     * @return {string}
     */
    toString(): string;
  }

  /*****************************************************************************
   * ICAL.RecurExpansion
   */
  interface RecursiveExpansionOptions {
    component: ICAL.Component;
    dtstart: ICAL.Time;
  }
  /**
   * Primary class for expanding recurring rules. Can take multiple rrules,
   * rdates, exdate(s) and iterate (in order) over each next occurrence.
   */
  interface RecurExpansion {
    // Status: partial; private members/methods omitted.
    (options: RecursiveExpansionOptions): ICAL.RecurExpansion;
    new(options: RecursiveExpansionOptions): ICAL.RecurExpansion;

    /** True when iteration is fully completed. */
    complete: boolean;
    /** Start date of recurring rules. */
    dtstart: ICAL.Time;
    /** Last expanded time */
    last: ICAL.Time;

    /** Initialize the recurrence expansion from the data object. */
    fromData(options: RecursiveExpansionOptions): void;

    /** Retrieve the next occurrence in the series. */
    next(): ICAL.Time;

    /** Converts object into a serialize-able format.
     * This format can be passed back into the expansion to resume iteration.
     */
    toJSON(): JSON;
  }

  /*****************************************************************************
   * ICAL.Time
   */
  interface TimeData {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    isDate: boolean; // If true, the instance represents a date (as opposed to a datetime)
  }
  /**
   * iCalendar Time representation (similar to JS Date object).  Fully
   * independent of system (OS) timezone / time.  Unlike JS Date, the month
   * January is 1, not zero.
   */
  interface Time {
    // Status: partial; private members/methods omitted.
    constructor(data?: ICAL.TimeData, zone?: ICAL.Timezone): ICAL.Time;
    new(data?: ICAL.TimeData, zone?: ICAL.Timezone): ICAL.Time;

    /** The class identifier. */
    icalclass: string;
    /** The timezone for this time. */
    zone: ICAL.Timezone;

    /**
     * Adds the duration to the current time. The instance is modified in place.
     * @param {ICAL.Duration} aDuration The duration to add.
     */
    addDuration(aDuration: ICAL.Duration): void;

    /**
     * Adjust the date/time by the given offset
     *
     * @param {Number} aExtraDays The extra amount of days.
     * @param {Number} aExtraHours The extra amount of hours.
     * @param {Number} aExtraMinutes The extra amount of minutes.
     * @param {Number} aExtraSeconds The extra amount of seconds.
     * @param {?Number} aTime The time to adjust, defaults to the current instance.
     */
    adjust(aExtraDays: number, aExtraHours: number, aExtraMinutes: number, aExtraSeconds: number, aTime?: number): void;

    /**
     * Returns a clone of the time object.
     * @return {ICAL.Time} The cloned object.
     */
    clone(): ICAL.Time;

    /**
     * Compares the ICAL.Time instance with another one.
     * @param {ICAL.Duration} aOther The instance to compare with.
     * @return {number} -1, 0 or 1 for less/equal/greater.
     */
    compare(other: ICAL.Duration): number;

    /**
     * Compares only the date part of this instance with another one.
     * @param {ICAL.Duration} other The instance to compare with.
     * @param {ICAL.Timezone} tz The timezone to compare in.
     * @return {Number} -1, 0 or 1 for less/equal/greater.
     */
    compareDateOnlyTz(other: ICAL.Duration, tz: ICAL.Timezone): number;

    /**
     * Convert the instance into another timzone. The returned ICAL.Time instance is always a copy.
     * @param {ICAL.Timezone} zone The zone to convert to.
     * @return {ICAL.Time} The copy, converted to the zone.
     */
    convertToZone(zone: ICAL.Timezone): ICAL.Time;

    /**
     * Calculate the day of week.
     * @return {number}
     */
    dayOfWeek(): number;

    /**
     * Calculate the day of year.
     * @return {number}
     */
    dayOfYear(): number;


    /**
     * Returns a copy of the current date/time, shifted to the end of the month.
     * The resulting ICAL.Time instance is of icaltype date, even if this is a date-time.
     * @return {ICAL.Time} The end of the month (cloned).
     */
    endOfMonth(): ICAL.Time;

    /**
     * Returns a copy of the current date/time, shifted to the end of the week.
     * The resulting ICAL.Time instance is of icaltype date, even if this is a date-time.
     * @param {?number} aWeekStart The week start weekday, defaults to SUNDAY.
     * @return {ICAL.Time} The end of the week (cloned).
     */
    endOfWeek(aWeekStart?: number): ICAL.Time;

    /**
     * Returns a copy of the current date/time, shifted to the end of the year.
     * The resulting ICAL.Time instance is of icaltype date, even if this is a date-time.
     * @return {ICAL.Time} The end of the year (cloned);
     */
    endOfYear(): ICAL.Time;

    /**
     * Sets up the current instance using members from the passed data object.
     * @param {ICAL.TimeData} aData The ICAL.TimeData object for time initialization.
     * @param {?ICAL.Timezone} aZone Timezone this position occurs in.
     */
    fromData(aData: TimeData, aZone?: ICAL.Timezone): ICAL.Time;

    /**
     * Returns a new ICAL.Time instance from a date-time string, e.g 2015-01-02T03:04:05.
     * If a property is specified, the timezone is set up from the property's TZID parameter.
     * @param {string} aValue The string to create from.
     * @param {?ICAL.Property} prop The property the date belongs to.
     * @return {ICAL.Time} The date/time instance.
     */
    fromDateTimeString(aValue: string, prop?: ICAL.Property): ICAL.Time;

    /**
     * Sets up the current instance from the Javascript date value.
     * @param {?date} aDate The Javascript Date to read, or null to reset.
     * @param {?boolean} useUTC If true, the UTC values of the date will be used. Defaults to false.
     */
    fromJSDate(date: Date, useUTC?: boolean): ICAL.Time;

    /**
     * Sets up the current instance from unix time, the number of seconds since January 1st, 1970.
     * @param {number} seconds The seconds to set up with.
     */
    fromUnixTime(seconds: number): void;

    /**
     * Get the dominical letter for the current year. Letters range
     * from A-G for common years, and AG to GF for leap years.
     * @return {string} The dominical letter.
     */
    getDominicalLetter(): string;

    /**
     * The type name, to be used in the jCal object. This value may change and
     * is strictly defined by the ICAL.Time.isDate member.
     * Possible values: {date|date-time}. Defaults to "date-time".
     */
    icaltype(): string;

    /**
     * Checks if current time is the nth weekday, relative to the current month.
     * Will always return false when rule resolves outside of current month.
     * @param {number} aDayOfWeek Day of week to check.
     * @param {number} aPos Relative position.
     * @returns {boolean} True, if its the nth weekday.
     */
    isNthWeekDay(aDayOfWeek: number, aPos: number): boolean;

    /**
     * Finds the nthWeekDay relative to the current month (not day).  The
     * returned value is a day relative the month that this month belongs to so
     * 1 would indicate the first of the month and 40 would indicate a day in
     * the following month.
     * @param {number} aDayOfWeek Day of the week see the day name constants.
     * @param {number} aPos Nth occurrence of a given week day values of 1 and 0 both indicate
     *        the first weekday of that type. aPos may be either positive or negative.
     * @return {number} Numeric value indicating a day relative to the current month of this time object.
     */
    nthWeekDay(aDayOfWeek: number, aPos: number): number;

    /**
     * Resets the time instance to epoch time.
     */
    reset(): void;

    /**
     * Resets the time instance to the given date/time values.
     * @param {Number} year The year to set.
     * @param {Number} month The month to set.
     * @param {Number} day The day to set.
     * @param {Number} hour The hour to set.
     * @param {Number} minute The minute to set.
     * @param {Number} second The second to set.
     * @param {ICAL.Timezone} timezone The timezone to set.
     */
    resetTo(year: number, month: number, day: number, hour: number, minute: number, second: number, timezone: ICAL.Timezone): void;

    /**
     * First calculates the start of the week, then returns the day of year for this
     * date. If the day falls into the previous year, the day is zero or negative.
     * @param {number} aFirstDayOfWeek The week start weekday, defaults to SUNDAY.
     * @return {number} The calculated day of year.
     */
    startDoyWeek(aFirstDayOfWeek: number): number;

    /**
     * Returns a copy of the current date/time, rewound to the start of the month.
     * The resulting ICAL.Time instance is of icaltype date, even if this is a date-time.
     * @return {ICAL.Time} The start of the month (cloned).
     */
    startOfMonth(): ICAL.Time;

    /**
     * Returns a copy of the current date/time, rewound to the start of the week.
     * The resulting ICAL.Time instance is of icaltype date, even if this is a date-time.
     * @param {number} aWeekStart The week start weekday, defaults to SUNDAY.
     * @return {ICAL.Time} The start of the week (cloned).
     */
    startOfWeek(aWeekStart: number): ICAL.Time;

    /**
     * Returns a copy of the current date/time, rewound to the start of the year.
     * The resulting ICAL.Time instance is of icaltype date, even if this is a date-time.
     * @return {ICAL.Time} The start of the year (cloned).
     */
    startOfYear(): ICAL.Time;

    /**
     * Subtract the date details (_excluding_ timezone).  Useful for finding the relative
     * difference between two time objects excluding their timezone differences.
     * @param {ICAL.Time} aDate The date to substract.
     * @return {ICAL.Duration} The difference as a duration.
     */
    subtractDate(aDate: ICAL.Time): ICAL.Duration;

    /**
     * Subtract the date details, taking timezones into account.
     * @param {ICAL.Time} aDate The date to subtract.
     * @return {ICAL.Duration} The difference in duration.
     */
    subtractDateTz(aDate: ICAL.Time): ICAL.Duration;

    /**
     * Returns an RFC 5545 compliant ical representation of this object.
     * @return {String} ical date/date-time.
     */
    toICALString(): string;

    /**
     * Converts the current instance to a Javascript date.
     * @return {Date}
     */
    toJSDate(): Date;

    /**
     * Converts time to into Object which can be serialized then re-created using the constructor.
     * @return {Object}
     */
    toJSON(): JSON;

    /**
     * The string representation of this date/time, in jCal form (including : and - separators).
     * @return {String}
     */
    toString(): string;

    /**
     * Converts the current instance to seconds since January 1st 1970.
     * @return {Number} Seconds since 1970.
     */
    toUnixTime(): number;

    /**
     * Calculates the UTC offset of the current date/time in the timezone it is in.
     * @return {number} UTC offset in seconds.
     */
    utcOffset(): number;

    /**
     * Calculates the ISO 8601 week number. The first week of a year is the week that
     * contains the first Thursday. The year can have 53 weeks, if January 1st is a Friday.
     * @param {number} aWeekStart The weekday the week starts with;
     * @return {number} The ISO week number;
     */
    weekNumber(aWeekStart: number): number;
  }

  /*****************************************************************************
   * ICAL.Time
   */
  interface Timezone {

  }

  export interface Instance {
    Component: ICAL.Component;
    Duration: ICAL.Duration;

    // function parser(input: string): Object|Object[];
    parse(input?: string): Array<Object>|Object;
    Property: ICAL.Property;
    Time: ICAL.Time;
    Timezone: ICAL.Timezone;
    RecurExpansion: ICAL.RecurExpansion;
  }
}
