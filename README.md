FCRemoteIcal is a FullCalendar plugin that imports iCalendars (`.ics`) events into [FullCalendar][0] using [ical.js][1].

Demo
----
[https://cgalvarez.github.io/fc-remote-ical/demo/][6]

Usage
-----

FullCalendar depends on [Moment.js][2] and [jQuery][3].

FCRemoteIcal depends on [FullCalendar][0], [jQuery][3] and [ical.js][1].

1. Load all the dependencies in order.
```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.0/fullcalendar.css" rel="stylesheet" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.0/fullcalendar.print.css" rel="stylesheet" media="print" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.0/fullcalendar.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.2.2/ical.min.js"></script>
```
2. Then load the plugin.
```html
<script type="text/javascript" src="../dist/fc-remote-ical.umd.min.js"></script>
```
3. Create the FullCalendar instance.
```javascript
  $(document).ready(function() {
    var $fc = jQuery("#calendar");
    $fc.fullCalendar({...});
    ...
  });
```
4. Finally call `FCRemoteIcal.import()` with your desired remote sources and settings.
```javascript
FCRemoteIcal.import($fc, [
  { url: "samples/ical/events.ics", options: { color: "gold" } },
  { url: "samples/ical/32c3.ics" },
  { url: "samples/ical/daily_recur.ics", options: { color: "magenta" } }
]);
```

API
---

## `FCRemoteIcal.import($fc: JQuery, remoteSources: Array<Object>)`
Imports the collection of remote iCalendars provided and inserts them into the desired FullCalendar instance.

- `$fc` is the jQuery object of the native DOM element used to create the FullCalendar instance.

- `remoteSources` is an array of JSON objects with the following structure:

  - `url`: the URL of the remote iCalendar. It may be relative (the iCalendar is in your site) or absolute (remote, in another site).
  - `defaults`: object of type [`FullCalendar.EventObject`][5]. You can provide any of the available properties exposed by FullCalendar. These properties are used as defaults when creating the events parsed from `url`, if any of them is missing, except the property `className`, which gets added to the array of classes.

Check the [demo][6] to see a real implementation.

Advices
-------

1. DO NOT use jQuery 3.0. It is not currently supported by FullCalendar.
2. Make sure that your FullCalendar instance is fully rendered before trying to import any remote iCalendar which contains recurring events. The events will be imported successfully, but you will get JavaScript errors. This is because of recurring events require the range of the current FullCalendar instance view (start/end date); if FullCalendar is not fully rendered, those will be undefined and you'll subsequently get those JS errors.

License
-------
MIT License.

Authors & Contributors
----------------------
2016 [Carlos García][4]

Initially based on [icalendar2fullcalendar][7] by 2733.

[Contributors][8]

The project sources are on the folder `src/fc-remote-ical.ts`. Contributions must use TypeScript.

Feel free to make a pull request if you want to add a new feature or fix a bug, or open an issue. Happy coding!

[0]: http://fullcalendar.io/
[1]: https://mozilla-comm.github.io/ical.js/
[2]: http://momentjs.com/
[3]: https://jquery.com/
[4]: http://carlosgarcia.engineer/
[5]: http://fullcalendar.io/docs/event_data/Event_Object/
[6]: https://cgalvarez.github.io/fc-remote-ical/demo/
[7]: https://github.com/2733/icalendar2fullcalendar
[8]: https://github.com/cgalvarez/fc-remote-ical/graphs/contributors
