/*global store*/
import Event from './Event';
import store from './store';

const weeklyPlanner = (() => { // eslint-disable-line no-unused-vars
  const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  
  const $ = document.querySelector.bind(document);


  // DOM elements
  const weekHeader = $('#table-head');
  const weekBody = $('#table-body');
  const clearButton = $('#btn-clear');
  const eventCtxDialog = $('#event-ctx-dialog');
  const eventCtxDialogTitle = $('#event-ctx-dialog h3');
  const closeEventCtxDialog = $('#close-event-ctx-dialog');
  const deleteButton = $('.btn-delete');
  const addEventForm = $('#add-event-form');
  const titleInput = $('form #title');
  const timeFromInput = $('#time-from');
  const timeToInput = $('#time-to');


  let currentTimeFrom; // used for Firefox time input clear button work around
  let currentEvent; // Current instance of Event being interacted with
  let currentEventEl; // DOM element representing current Event being interacted with
  let eventEditPending = false; 

  /**
   * Returns array of Date objects for current week
   * @returns {Array}
   */ 
  const dates = (current) => {
    const week = new Array();

    current.setDate((current.getDate() - current.getDay()));
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  /** Render planner elements to the DOM for current week */
  const render = () => {
    const week = dates(new Date());

    const theadHTML = week.map(day => (
      `<th>
        ${DAYS[day.getDay()]}<br/>
        <span class="day-number">${day.getDate()}</span>
      </th>`
    ));

    theadHTML.unshift('<th id="time"></th>');
    weekHeader.innerHTML = theadHTML.join('');

    const tbodyHTML = week.map(day => {
      return `
        <td data-day="${day.getDay()}">
          ${tableCellHTML()}
        </td>
      `;
    });

    tbodyHTML.unshift(`<td id="time-column">${renderTimeColumn()}</td>`);
    weekBody.innerHTML = tbodyHTML.join('');
  };

  /**
   * Returns an HTML string to populate hour cells of planner
   * @returns {string}
   */ 
  const tableCellHTML = () => {
    const tableCellHTML = new Array();

    for (let i = 0; i < 24; i++) {
      let hour = i < 10 ? '0' + i : i;
      tableCellHTML.push(`<div class="hour-block" data-hour="${hour}"></div>`);
    }

    return tableCellHTML.join('');
  };

  /**
   * Returns an HTML string to populate time column cells
   * @returns {string}
   */ 
  const renderTimeColumn = () => {
    const timeColumnHTML = new Array();
    for (let i = 0; i < 24; i++) {
      let time;
      const ampm = i >= 12 ? 'pm' : 'am';
      time = i % 12;
      time = time ? time : 12;

      const html = `
        <div class="hour-wrapper">
          <div class="hour">${time}${ampm}</div>
        </div>
      `;
      timeColumnHTML.push(html);
    }

    return timeColumnHTML.join('');
  };

  /** 
   * Show update event form
   * @param {MouseEvent} e - click event
   */
  const updateEvent = (e) => {
    const id = e.target.getAttribute('data-id');
    
    eventEditPending = true;
    currentEventEl = e.target;
    currentEvent = store.getEventById(id);
    titleInput.value = currentEvent.title;

    currentTimeFrom = currentEvent.getTimeFrom(); // used for FF clear button work around

    setTimeFromInputValue(currentTimeFrom);
    setTimeToInputValue(currentEvent.getTimeTo());
    showEventDialogBox(e, true);
  };

  /** 
   * Set event form time from input value
   * @param {string} value - time (i.e. '12:30')
   */
  const setTimeFromInputValue = (value) => {
    timeFromInput.value = value;
  };

  /** 
   * Set event form time to input value
   * @param {string} value - time (i.e. '12:30')
   */
  const setTimeToInputValue = (value) => {
    timeToInput.value = value;
  };

  /** 
   * Receives hour and minute as integer arguments and
   * returns time string in "HH:MM" format 
   * @param {number} _hour - hour
   * @param {number} _minuter - minute
   * @returns {string}
   */
  const getTimeString = (_hour, _minute) => {
    const hour = _hour < 10 ? `0${_hour}` : `${_hour}`;
    const minute = _minute < 10 ? `0${_minute}` : `${_minute}`;

    return `${hour}:${minute}`;
  };

  /** 
   * Returns offset for pending event DOM element
   * offsets are based on 15 min increments
   * @param {MouseEvent} e - click event
   * @returns {number}
   */
  const getEventStartMinute = (e) => {
    const offsetY = e.pageY - e.target.offsetTop;
    return offsetY > 45 ? 45 : Math.floor((offsetY / 15)) * 15;
  };

  /** 
   * Show event form dialog box
   * @param {MouseEvent} e - click event
   * @param {boolean} update - show update form
   */
  const showEventDialogBox = (e, update) => {
    if(update) {
      eventCtxDialogTitle.textContent = 'Update event';
      deleteButton.style.display = 'inline-block';
    }
    else {
      eventCtxDialogTitle.textContent = 'Add event';
      deleteButton.style.display = 'none';
      
    }
    eventCtxDialog.style.display = 'block';
    eventCtxDialog.style.top = e.pageY + 'px';
    eventCtxDialog.style.left = e.pageX + 'px';
  };

  /** Hide event form dialog box   */
  const hideEventDialogBox = () => {
    eventEditPending = false;
    titleInput.value = '';
    eventCtxDialog.style.display = 'none';
  };

  /** 
   * Get start time difference between two events on the same day
   * @param {Event} e1
   * @param {Event} e2
   * @returns {number} 
   */
  const getStartTimeDifference = (e1, e2) => {
    const d1 = new Date(`2018/01/01 ${e1.getTimeFrom()}`);
    const d2 = new Date(`2018/01/01 ${e2.getTimeFrom()}`);
    const diff = (d1 - d2)/3600000;
    return diff;
  };

  /** 
   * Begin new event creation process
   * @param {MouseEvent} e - click event
   */
  const addPendingEvent = (e) => {
    const hourBlock = e.target.getAttribute('data-hour');
    const startHour = parseInt(hourBlock);
    const startMinute = getEventStartMinute(e);
    let timeFrom = getTimeString(startHour, startMinute);

    // Events cannot exceed 11:45pm
    if(timeFrom >= '23:45') {
      return;
    }
    eventEditPending = true;
    
    let timeTo;
    const day = e.target.parentElement.getAttribute('data-day');
    
    const pendingEvent = new Event(day, timeFrom);
    currentEvent = pendingEvent;
    
    // Events may not overlap
    // Restrict time input values accordingly.
    const nextEventEl = getNextEventEl();
    if(nextEventEl) {
      const nextEvent = getEventFromEventEl(nextEventEl);
      const startTimeDiff = getStartTimeDifference(nextEvent, currentEvent);

      timeTo = startTimeDiff <= 1 ? nextEvent.getTimeFrom() : getTimeString(startHour + 1, startMinute);
    }
    else {
      // latest possible time for event is 11:45pm
      timeTo = startHour === 23 ? getTimeString(startHour, 45) : getTimeString(startHour + 1, startMinute);
    }

    pendingEvent.setTimeFrom(timeFrom);
    pendingEvent.setTimeTo(timeTo);

    currentTimeFrom = timeFrom; // used for FF clear time from input workaround
    
    setTimeFromInputValue(timeFrom);
    setTimeToInputValue(timeTo);
    renderPendingEvent(e, pendingEvent);
  };

  /** 
   * Render pending event to the DOM and show event form
   * @param {MouseEvent} e - click event
   * @param {Event} pendingEvent - Instance of Event representing the pending event
   * @returns {number}
   */
  const renderPendingEvent = (e, pendingEvent) => {
    let event = document.createElement('div');
    event.className = 'event pending-event';
    event.style.top = (64 * pendingEvent.getTimeFromMinute() / 60) + 'px';
    event.style.height = getBlockHeight(pendingEvent.getTimeFrom(), pendingEvent.getTimeTo() ) + 'px';
    e.target.appendChild(event);
    currentEventEl = event;
    showEventDialogBox(e);
  };

  /** Cancel event editing and hide event form dialog box */
  const cancelEventEdit = () => {
    const pendingEvent = document.querySelector('.pending-event');
    if (pendingEvent) {
      pendingEvent.parentNode.removeChild(pendingEvent);
    } else {
      const event = store.getEventById(currentEvent.id);
      if(currentEventEl.parentElement) {
        currentEventEl.parentElement.removeChild(currentEventEl);
      }
      renderEvent(event);
    }
    hideEventDialogBox();
  };

  /** 
   * Get event block height
   * @param {string} timeFrom - time for top edge of event block
   * @param {string} timeTo - time for bottom edge of event block
   * @returns {number}
   */
  const getBlockHeight = (timeFrom, timeTo) => {
    const from = new Date(`2018/01/01 ${timeFrom}`);
    const to = new Date(`2018/01/01 ${timeTo}`);

    const hours = (to - from)/3600000;
    return Math.floor(hours * 64);
  };

  /** 
   * Get hour string from integer
   * i.e. 5 --> "05", 23 --> "23"
   * @param {number} hour - hour 
   * @returns {string}
   */
  const getHourString = (hour) => {
    return hour < 10 ? `0${hour}` : `${hour}`;
  };

  /** 
   * Get previous event el relative to current element
   * Returns false, if previous event element is not found
   * @returns {(Object|boolean)}
   */
  const getPrevEventEl = () => {
    const day = currentEvent.day;
    let hour = currentEvent.getTimeFromHour();
    let prevEventEl = false;

    for(var i = hour; i >= 0; i--) {
      let selector = `[data-day='${day}'] [data-hour='${getHourString(i)}']`;
      let hourBlock = $(selector);
      if(hourBlock.childNodes.length > 0) {
        const childNodes = Array.from(hourBlock.childNodes);
        const prevEventElArray = childNodes.filter(event => {
          let eventObj = store.getEventById(event.getAttribute('data-id'));
          if(eventObj) {
            return eventObj.timeTo <= currentEvent.timeFrom;
          }
          return false;
        });
        prevEventEl = prevEventElArray[prevEventElArray.length -1];
        if(prevEventEl) { return prevEventEl; }
      }
    }
    return prevEventEl;
  };

  /** 
   * Get next event el relative to current element
   * Returns false, if previous event element is not found
   * @returns {(Object|boolean)}
   */
  const getNextEventEl = () => {
    const day = currentEvent.day;
    let hour = currentEvent.getTimeFromHour();
    let nextEventEl = false;

    for(var i = hour; i < 24; i++) {
      let selector = `[data-day='${day}'] [data-hour='${getHourString(i)}']`;
      let hourBlock = $(selector);
      if(hourBlock.childNodes.length > 0) {
        var childNodes = Array.from(hourBlock.childNodes);
        nextEventEl = childNodes.filter(event => {
          let eventObj = store.getEventById(event.getAttribute('data-id'));
          if(eventObj) {
            return eventObj.timeFrom > currentEvent.timeFrom;
          }
          return false;
        })[0];
        if(nextEventEl) { return nextEventEl; }
      }
    }
    return nextEventEl;
  };

  /** 
   * Retrieve from the store the instance of Event corresponding to an Event DOM element
   * @returns {Event}
   */
  const getEventFromEventEl = (eventEl) => {
    const id = eventEl.getAttribute('data-id');
    return store.getEventById(id);
  };

  /** 
   * Event handler for changing an Event's from time
   * @param {InputEvent} e - Input event
   */
  const changeEventFromTime = (e) => {

    // Firefox has clear input button for time inputs;
    // If user clears input, set time from input to last valid value
    if(e.target.value == '') {
      setTimeFromInputValue(currentTimeFrom);
      return;
    }

    // event timeFrom cannot be greater than timeTo
    // Ensure timeFrom is at least 15 minuts prior than timeTo
    if(e.target.value >= timeToInput.value) {
      const [_hour, _minutes] = timeToInput.value.split(':');
      const hour = parseInt(_hour);
      const minutes = parseInt(_minutes);
      const timeFrom = minutes === 0 ? getTimeString(hour - 1, 45) : getTimeString(hour, minutes - 15);
      setTimeFromInputValue(timeFrom);
    }

    // Event time from cannot start prior to a previous event's timeTo
    const prevEventEl = getPrevEventEl();
    if(prevEventEl) {
      const prevEvent = getEventFromEventEl(prevEventEl);
      if(timeFromInput.value <= prevEvent.getTimeTo()) {
        setTimeFromInputValue(prevEvent.getTimeTo());
      }
    }

    currentTimeFrom = timeFromInput.value; // For FF time input clear button work around
    
    // Rerender updated event in proper hour block
    const day = currentEvent.day;
    const hour = timeFromInput.value.split(':')[0];
    const minute = timeFromInput.value.split(':')[1];
    const selector = `[data-day='${day}'] [data-hour='${hour}']`;
    const hourBlock = $(selector);

    currentEventEl.parentElement.removeChild(currentEventEl);
    hourBlock.appendChild(currentEventEl);

    const height = getBlockHeight(timeFromInput.value, timeToInput.value);
    currentEventEl.style.height = height + 'px';
    currentEventEl.style.top = (64 * minute / 60) + 'px';
  };

  /** 
   * Event handler for changing an Event's to time
   * @param {InputEvent} e - input event
   */
  const changeEventToTime = (e) => {
    // Events must be at least 15 minutes and timeTo cannot begin prior to timeFrom
    if(e.target.value <= timeFromInput.value) {
      const [_hour, _minutes] = timeFromInput.value.split(':');
      const hour = parseInt(_hour);
      const minutes = parseInt(_minutes);
      const timeTo = minutes >= 45 ? getTimeString(hour + 1, 0) : getTimeString(hour, minutes + 15);
      setTimeToInputValue(timeTo);
    }

    // Ensure timeTo does not overlap next element
    const nextEventEl = getNextEventEl();
    if(nextEventEl) {
      const nextEvent = getEventFromEventEl(nextEventEl);
      if(e.target.value >= nextEvent.getTimeFrom()) {
        setTimeToInputValue(nextEvent.getTimeFrom());
      }
    }

    // Set event styles
    const height = getBlockHeight(timeFromInput.value, timeToInput.value);
    currentEventEl.style.height = height + 'px';
  };

  /** 
   * Event handler for when an event is saved/updated
   * @param {SubmitEvent} e - submit event
   */
  const saveEvent = (e) => {
    e.preventDefault();
    currentEvent.setTitle(titleInput.value);
    currentEvent.setTimeTo(timeToInput.value);
    currentEvent.setTimeFrom(timeFromInput.value);

    // Update
    if (currentEvent.id) {
      store.updateEvent(currentEvent.id, currentEvent);
    }
    // Create
    else {
      currentEvent = store.addEvent(currentEvent); // Get id

      // Event no longer pending, so remove pending-event class
      const eventEl = document.querySelector('.pending-event');
      eventEl.classList.remove('pending-event');
    }

    // Rerender Event to get data-id attribute inserted into the DOM
    currentEventEl.parentElement.removeChild(currentEventEl);
    renderEvent(currentEvent);

    hideEventDialogBox();
  };


  /** 
   * Event handler for deleting and event
   * @param {MouseEvent} e - Mouse Event
   */
  const deleteEvent = (e) => {
    e.preventDefault();
    if(confirm('Are you sure?')) {
      store.deleteEvent(currentEvent.id);
      currentEventEl.parentNode.removeChild(currentEventEl);
      hideEventDialogBox();
    }
  };


  /** 
   * Event handler for removing all events from application
   * @param {MouseEvent} e - Mouse Event
   */
  const clearPlanner = () => {
    hideEventDialogBox();
    if(confirm('Remove all events?')) {
      store.clearEvents();
      var events = document.getElementsByClassName('event');
      while(events[0]) {
        events[0].parentNode.removeChild(events[0]);
      }
    }
  };

  /** Set up all necessary event listeners */
  const bindEventListeners = () => {
    closeEventCtxDialog.addEventListener('click', () => cancelEventEdit());
    clearButton.addEventListener('click', () => clearPlanner());
    deleteButton.addEventListener('click', e => deleteEvent(e));
    addEventForm.addEventListener('submit', e => saveEvent(e));
    timeFromInput.addEventListener('input', e => changeEventFromTime(e));
    timeToInput.addEventListener('input', e => changeEventToTime(e));

    // Bind click events to dynamically inserted elements
    document.addEventListener('click', e => {
      if (e.target && e.target.className == 'hour-block') {
        if (!eventEditPending) {
          addPendingEvent(e);
        } 
        else {
          cancelEventEdit();
        }
      }

      if (e.target && e.target.className == 'event') {
        if (eventEditPending) {
          cancelEventEdit();
        }
        else {
          updateEvent(e);
        }
      }
    });
  };

  /** On app load, retrieve events from and render them to DOM */
  const renderEvents = () => {
    let events = store.getEvents();
    if (events.length == 0) return;
    events.forEach(event => {
      renderEvent(event);
    });
  };

  /**  Render instance of Event */
  const renderEvent = (event) => {
    const day = event.day;
    const timeFromHour = event.getTimeFromHour(true);
    const selector = `[data-day='${day}'] [data-hour='${timeFromHour}']`;
    const eventParent = document.querySelector(selector);
    const eventEl = document.createElement('div');
    
    eventEl.className = 'event';
    eventEl.innerHTML = `<p>${event.title}</p>`;
    eventEl.setAttribute('data-id', event.id);
    eventEl.setAttribute('title', event.title);
    eventEl.style.top = (64 * event.getTimeFromMinute() / 60) + 'px';
    eventEl.style.height = event.getBlockHeight() + 'px';
    eventParent.appendChild(eventEl);
  };

  /**  Run application  */
  const startApp = () => {
    console.log('starting app...');
    store.loadEvents();
    bindEventListeners();
    render();
    renderEvents();
  };

  return { startApp };
})();

export default weeklyPlanner;