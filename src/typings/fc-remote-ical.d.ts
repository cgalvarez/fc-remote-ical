declare var moment: moment.MomentStatic;

interface RemoteSource {
  url: string;
  defaults: Object;
}

interface IcalEventCallback { (event: ICAL.Component): void; }
interface FcEventCallback { (event: FullCalendar.EventObject): void; }
interface FcEventsCallback { (events: Array<FullCalendar.EventObject>): void; }

interface ICALRecurringComponent extends ICAL.Component {
  defaults: Object;
}

interface FcEventObjectDefaults {
  id?: any; // String/number
  title?: string;
  allDay?: boolean;
  url?: string;
  className?: any; // string/Array<string>
  editable?: boolean;
  source?: FullCalendar.EventSource;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  rendering?: string;
}

interface FcEventSourceFunction {
  start: moment.Moment;
  end: moment.Moment;
  timezone: string | boolean;
  callback: FcEventsCallback;
}

interface Window { FCRemoteIcal: any; }
