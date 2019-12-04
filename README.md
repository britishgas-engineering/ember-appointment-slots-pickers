# ember-appointment-slots-pickers

This addons provides four different appointment slot pickers components, plus a suite of optional composable components to customize then.

We transferred _as is_ the components, some of them consuming old javascript libraries that would helpfully be rewritten using ember-animation.

You can pick up only the components you need from the suite AND only the dependencies you need (hopefully, otherwise will need to split into several children addons) using tree-shaking.

## Choose your own calendventure ##

At the time of writing, you can use any of the following children calendar components (screenshots are at the end of the issue):

* [easy-slot-picker](https://britishgas-engineering.github.io/ember-appointment-slots-pickers/#/demo/slots-pickers/easy-slot-picker)
* [slots-picker/desktop](https://britishgas-engineering.github.io/ember-appointment-slots-pickers/#/demo/slots-pickers/desktop)
* [slots-picker/mobile](https://britishgas-engineering.github.io/ember-appointment-slots-pickers/#/demo/slots-pickers/mobile)
* [slots-picker/cards](https://britishgas-engineering.github.io/ember-appointment-slots-pickers/#/demo/slots-pickers//)
* [slots-picker/pickadate](https://britishgas-engineering.github.io/ember-appointment-slots-pickers/#/demo/slots-pickers/pickadate)



<table>
    <thead>
        <tr>
            <th></th>
            <th colspan="2">Device:</th>
            <th colspan="2">Slots selection:</th>
            <th colspan="2">Composable with:</th>
            <th></th>
        </tr>
        <tr>
            <th>slots-picker calendar</th>
            <th>Mobile</th>
            <th>Desktop</th>
            <th>Single</th>
            <th>Multi</th>
            <th>slots-filter</th>
            <th>clock-reloader</th>
            <th>extendable</th>
        </tr>
    </thead>
    <tbody>
      <tr>
          <td>easy-slot-picker</td>
          <td>&#10004;</td>
          <td>&#10004;</td>
          <td>&#10004;</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
      </tr>
        <tr>
            <td>slots-picker/mobile</td>
            <td>&#10004;</td>
            <td></td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
        </tr>
        <tr>
            <td>slots-picker/desktop</td>
            <td></td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
        </tr>
        <tr>
            <td>slots-picker/pickadate</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td></td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
        </tr>
        <tr>
            <td>slots-picker/cards</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
            <td>&#10004;</td>
        </tr>
    </tbody>
</table>

## Many calendars, one API ##

We tried to have all of the `slots-picker/XX` components use the same API (still needs to be improved), starting from a common definition of the `appointmentSlots` array / promiseArray sent as attribute to the parent `slots-picker` container component:

One `appointmentSlot` can be an ember-data model or a standard Ember object and can contain the following properties:

```javascript
const appointmentSlot = EmberObject.extend({

  slotPickerRowId: '20181220_AllDay', // currently mandatory, one new row (time of the appointment) will be defined for each new slotPickerRowId
  slotPickerRowLabel: 'AllDay', // currently mandatory, the label to be applied to each row (typically slotPickerTime)

  slotPickerDay: '20181220', /*(or moment object)*/, // mandatory, the day of the slot, must be a moment-compatible day string, used to form columns,
  slotPickerDayLabel: 'Sun 24th Nov 2019', // currently mandatory, shown as label for the columns of the calendars and when selecting the slots,

  slotPickerTime: '8am - 5pm', // mandatory (or override ), the time of the slot, used when displaying the particular slot
  slotPickerStartTimeLabel: '8am,' // mandatory (or override slots-picker/selection-single)
  slotPickerEndTimeLabel: '10am', // mandatory (or override slots-picker/selection-single)

  slotPickerRowLabelClassName: 'bold', // optional, the class name to be applied to the label of each row
  slotPickerGroup: 0,//optional, group rows by, for example, slots with time ranges, and slots with variant labels,

  slotPickerLongDayLabel: 'Thursday 28th November' , // optional (defaults to slotPickerDayLabel) (used in slots-picker/selection-single)

  slotPickerNotAvailable: false, // optional (default false), to filter out the slots passed to the set of all slots in the components
  slotPickerNotDisplayable: false // optional (default false), to filter out the slots you want to show, while still including them in the global (to show empty days, for example),
  slotPickerHasTag: false // optional (default false), will display an `fa-tag` icon on slots buttons when true
});
```

Additional inputs that can be passed into the `slots-picker` component:

```javascript:
noSlotLabel: 'Not Available' //optional, defaults to 'Fully Booked'
```

## Leveraging composition to give power to the developers ##

You will find in the [dummy app](https://britishgas-engineering.github.io/ember-appointment-slots-pickers/#/demo) lots of examples on how to use these components, some of them are also summarized below:

### Easy slot picker ###

For those who are on a rush, we created an easy to use but non-customizable and non-extendable default slot picker, that you can just drop in your app like so:
```hbs
  {{easy-slot-picker
    appointmentSlots=model.appointmentSlots
    selected=model.selected
    onSelect=(action (mut model.selected))
  }}
```

Under the hood, `easy-slot-picker` is using a particular combination of `slots-picker/desktop`, `slots-picker/mobile` and `slots-picker/loader` which can be replicated and extended in the steps below:

### Basic setup ###

The basic use case is to use one of the `slots-picker/xx` individual calendars (`mobile`, `desktop`, `pickadate` or `cards`) inside the `slot-picker` container component:

```hbs
    {{#slot-picker
      appointmentSlots=model.appointmentSlots
      selected=model.selected
      noSlotLabel='Not available'
      select=(action (mut model.selected))
      as |baseProps onSelectSlot|
    }}
      {{component 'slot-picker/desktop'
        baseProps=baseProps
        onSelectSlot=onSelectSlot
      }}
    {{/slot-picker}}
```

`baseProps` is a hash of properties that children components need to be able to do their work. All children components extend the `slot-picker/base` class converting each of those properties into an alias on the child component: `days: readOnly('baseProps.days'),`

### Add a loading template ###

One of those `baseProps` properties is the `slotsAreLoading` property, set to `true` when `appointmentSlots` is a `isPending` promiseArray, or an array with `null` length. You will **have** to use a custom loading template for the slot-pickers in your app, except for the children slotPicker components that have a custom loading behaviour (none of them at the time of writing). We created a `slots-picker/loader` default loading template that you can reuse if you have nothing better:

```hbs
    {{#slots-picker
      appointmentSlots=model.appointmentSlots
      selected=model.selected
      noSlotLabel='Not available'
      select=(action (mut model.selected))
      as |baseProps onSelectSlot|
    }}
      {{#if baseProps.slotsAreLoading}}
        {{slots-picker/loader title="Finding the next available appointments in your area.."}}
      {{else}}
        {{component 'slots-picker/mobile'
          baseProps=baseProps
          onSelectSlot=onSelectSlot
        }}
      {{/if}}
    {{/slots-picker}}
```


### Different calendars for different screen sizes ###

One of the things you will have to maintain if you move away from `easy-slot-picker` is to choose in your app which calendars to display for the different screen sizes. [Some calendars are only available on mobile, some others only on desktop, some on both](https://github.com/britishgas-engineering/ember-appointment-slots-pickers/blob/feature/transfer-slot-pickers-to-open-source/README.md#choose-your-own-calendventure).

The `easy-slot-picker` code is doing just that, by changing the child component name depending on the viewport size:

```javascript
//appointment-slot-picker/component.js
  viewport: service(),
  slotPickerComponentName: computed('viewport.isMobile', function () {
    const showMobile = this.get('viewport.isMobile');
    return showMobile ? 'slots-picker/mobile' : 'slots-picker/desktop';
  }),
```

```hbs
{{#slots-picker
  appointmentSlots=appointment-slots
  selected=selected
  noSlotLabel=no-slot-label
  select=(action 'select')
  as |baseProps onSelectSlot onSelectDate|
}}
  {{#if baseProps.slotsAreLoading}}
    {{slots-picker/loader title=loaderSentence}}
  {{else}}
    {{component slotPickerComponentName
      baseProps=baseProps
      onSelectSlot=onSelectSlot
      onSelectDate=onSelectDate
    }}
  {{/if}}
{{/slots-picker}}
```

### Refresh the slots after some time ###

To show an overlay on the calendars once some time has expired, and ask customers to click to refresh their slots, you can use our `clock-reloader` and `clock-reloader/overlay` components:

```hbs
    {{#clock-reloader
      delay=delay
      onrefresh=(route-action "resetAsyncSlots" delay)
      as |isExpired refresh|
    }}
      {{#slots-picker
        appointmentSlots=model.showableSlots
        selected=model.selected
        noSlotLabel='Not available'
        select=(action (mut model.selected))
        as |baseProps onSelectSlot|
      }}
        {{component model.slotPickerName
          baseProps=baseProps
          onSelectSlot=onSelectSlot
        }}
        {{#if isExpired}}
          {{clock-reloader/overlay title="<h3>Hello World</h3>" refresh=(action refresh)}}
        {{/if}}
      {{/slots-picker}}
    {{/clock-reloader}}
```

### Filter the slots by time-range

Some components (`slots-picker/pickadate`, `slots-picker/mobile` ) show the dates before the times, so in that case it can be very useful to add a capability for customers to filter the available dates by time-range. This is what our `slots-filter` / `slots-filter/ui` components do:

```hbs
    {{#slots-filter
      appointmentSlots=appointment.availableSlots
      as |filteredAppointmentSlots changeFilter selectedFilter|
    }}
      {{#slots-picker
        appointmentSlots=filteredAppointmentSlots
        selected=appointment.appointmentSlot
        noSlotLabel='Not available'
        select=(route-action selectSlot)
        as |baseProps onSelectSlot onSelectDate|
      }}
        {{slots-filter/ui
          timeSlots=baseProps.rows
          changeFilter=changeFilter
          selectedFilter=selectedFilter
        }}
        {{component model.slotPickerName
          baseProps=baseProps
          onSelectSlot=onSelectSlot
        }}

      {{/slots-picker}}
    {{/slots-filter}}
```

### Combining everything together ###

Due to composition, you can modularize your slot-picker as you want. If you use all the components together, you could get something looking like this (real world use case):

```hbs
  {{#clock-reloader
    delay=appointment.timerRefresherContainer
    onrefresh=(route-action "refresh")
    class="mb6" as |isExpired refresh|
  }}
    {{#slots-filter
      appointmentSlots=appointment.availableSlots
      select=(route-action 'selectSlot')
      filterOption=selectedTimeSlot
      as |filteredAppointmentSlots filter|
    }}

    <div class="{{if appointmentSlotNotSelectedError 'p1 border border-red'}} mb6">
      {{#services-account/services-sector-holding/job-type/appointment/select-date/component-select-date/tab-view-low-availability
        appointment=appointment
        filteredAppointmentSlots=filteredAppointmentSlots
        as |slotPickerComponentNameFromTabView availableOrSuggestedSlots|
      }}
        {{#slots-picker
          appointment-slots=availableOrSuggestedSlots
          selected=appointment.appointmentSlot.content
          no-slot-label="Fully booked"
          on-select=(route-action "select")
          as |baseProps onSelectSlot onSelectDate|
        }}
          {{#if baseProps.slotsAreLoading}}
            {{slots-picker/loader title="Finding the next available appointments in your area.."}}
          {{else}}
            {{slots-filter/ui changeFilterTimeSlot=(action filter)}}
            {{#if isExpired}}
              {{clock-reloader/overlay title=overlayTitle refresh=(action refresh)}}
            {{/if}}
            {{component (or slotPickerComponentNameFromTabView slotPickerComponentName)
              baseProps=baseProps
              onSelectSlot=onSelectSlot
              onSelectDate=onSelectDate
            }}
          {{/if}}
        {{/slots-picker}}
      {{/services-account/services-sector-holding/job-type/appointment/select-date/component-select-date/tab-view-low-availability}}
    {{/slots-filter}}
  {{/clock-reloader}}


```

## Extend the base classes to create your own calendar ##

### Why not using contextual components? ###

By contextual components we mean using things like:

```hbs
  {{#slots-picker
    appointmentSlots=model.appointmentSlots
    selected=model.selected
    noSlotLabel='Not available'
    select=(action (mut model.selected))
    as |asp|
  }}
    {{asp.desktop}}
  {{/slots-picker}}
```

where the children `asp.XX` components would be yielded by the parent `slot-picker` component. This apparently leads to cleaner syntax than passing the `baseProps` properties down to the children, but the problem with this pattern is that:
* There is one big massive component containing all the others, so it prevents us from splitting them in different addons / tree-shake.
* Using clearly separate components allows the addon consumers to extend only one of them (parent or one of the children) in one app (or updating the corresponding addon), without bothering about the others.
* Previously, when adding a functionality to a calendar, we had to pass it as an attribute to the parent container, which would then itself transfer it to the child component, it didn't really make sense. Now you can just add / override children attributes in your app as you wish, without touching the container component
* This allows to use as and when needed optional components like `clock-reloader`, `slots-picker/loader`, `slots-filter`.

### Core classes ###

#### slots-picker container component ####

This component's primary use is to transform the array of `appointmentSlots` provided to it into a format more consumable by the children components, yielding downstream for example the rows (one for each time range), columns (one for each date) and cells of the calendars:

```hbs
{{yield
  (hash
    days=days
    rows=rows
    cols=cols
    cellsPerCol=cellsPerCol
    multiSelected=multiSelected
    cellsForColOfSelectedDays=cellsForColOfSelectedDays
    noSlotLabel=noSlotLabel
    slotsAreLoading=slotsAreLoading
    selectedFilter=selectedFilter
    canSelectMultipleSlots=canSelectMultipleSlots
  )
  (action "onSelectSlot")
  (action "onDeselectSlot")
}}
```

#### slots-picker/base component ####

This base component just aliases the `baseProps.xx` objects given by the parent `slots-picker` container to similarly names properties in the children calendar components:

```javascript
days: computed('baseProps.days', function () {
  return this.get('baseProps.days');
}).readOnly(),

```
It also contains patterns common to all calendars, for example the action called when changing a date.

Each child `slots-picker/xx` calendar component is then built by extending this base class.


#### Add your own calendar ####

You may have a better design in mind, or want to do things better than us and use ember-animation to build new calendars. In that case, all you have to do is create a new `slots-picker/better-calendar` component extending `slots-picker/base` and add it to the suite!

**Any better idea of how to do things? Create an issue or even better create a PR!**

## Tree-shaking ##

Based on `https://github.com/broccolijs/broccoli-funnel`, extended with `bundles` that you can include or exclude. Possible keys for bundles correspond to the different calendars (`easy`, `mobile`, `desktop`, `cards`, `pickadate`) and also a `bg` bundle that you have to exclude if you work for British Gas (otherwise just ignore this bundle). Some examples,

The below will only load the `easy-slot-picker` component and associated files, including stylesheets:
```javascript
options['ember-appointment-slots-pickers'] = {
  bundles: {
    include: ['easy']
  }
};
```

The below will exclude the files and libraries needed for the `mobile` and `cards` calendars, and also the `clock-reloader` component suite, and keep everything else:
```javascript
//ember-cli-build.js
options['ember-appointment-slots-pickers'] = {
  bundles: {
    exclude: ['mobile', 'cards']
  },
  exclude: [
    /clock-reloader/
  ]
},
```

The below will only load the `pickadate-input` component and stylesheets, and mandatory services / helpers:
```javascript
//ember-cli-build.js
options['ember-appointment-slots-pickers'] = {
  include: [
    /components\/pickadate-input/
  ]
};
```

## Installation

* `git clone <repository-url>` this repository
* `cd ember-appointment-slots-pickers`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`
