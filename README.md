FCRemoteIcal is a FullCalendar plugin that imports iCalendars (`.ics`) events into [FullCalendar][0] using [ical.js][1].

Demo
----
[https://cgalvarez.github.io/fc-remote-ical/demo/][6]

Usage
-----

FullCalendar depends on [Moment.js][2] and [jQuery][3].

FCRemoteIcal depends on [FullCalendar][0] and [ical.js][1].

1. Load all the dependencies in order.
2. Then load the plugin.
3. Create the FullCalendar instance.
4. Finally call `FCRemoteIcal.import()` with your desired remote sources and settings.

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.0/fullcalendar.css" rel="stylesheet" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.0/fullcalendar.print.css" rel="stylesheet" media="print" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.0/fullcalendar.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.2.2/ical.min.js"></script>
```

API
---

## `FCRemoteIcal.import($fc: JQuery, remoteSources: Array<Object>)`
Imports the collection of remote iCalendars provided and inserts them into the desired FullCalendar instance.

`$fc` is the jQuery object of the native DOM element used to create the FullCalendar instance.

`remoteSources` is an array of JSON objects with the following structure:

- `url`: the URL of the remote iCalendar. It may be relative (the iCalendar is in your site) or absolute (remote, in another site).
- `defaults`: object of type [`FullCalendar.EventObject`][5]. You can provide any of the available properties exposed by FullCalendar. These properties are used as defaults when creating the events parsed from `url`, if any of them is missing, except the property `className`, which gets added to the array of classes.

Check the [demo][6] to see a real implementation.

Advice
------

1. DO NOT use jQuery 3.0. It is not currently supported by FullCalendar.
2. Make sure that FullCalendar is fully rendered before trying to import remote iCalendars which contain recurring events. The events will be imported successfully, but  you will get JavaScript errors. This is because of recurring events require the range of the current FullCalendar view (start/end date); if FullCalendar is not fully rendered, those will be undefined and you'll get those JS errors.

License
-------
MIT License.

Author
------
[Carlos García][4]

[0]: http://fullcalendar.io/
[1]: https://mozilla-comm.github.io/ical.js/
[2]: http://momentjs.com/
[3]: https://jquery.com/
[4]: http://carlosgarcia.engineer/
[5]: http://fullcalendar.io/docs/event_data/Event_Object/
[6]: https://cgalvarez.github.io/fc-remote-ical/demo/
