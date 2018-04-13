/** Weekly planner persistence layer leveraging localStorage */
const store = (() => { // eslint-disable-line no-unused-vars 
  let events = [];

  const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const addEvent = (event) => {
    event.id = uuid();
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
    return event;
  };

  const loadEvents = () => {
    const eventObjects = JSON.parse(localStorage.getItem('events'));
    if(!eventObjects) return;
    events = eventObjects.map(obj => {
      return new Event(obj.day, obj.timeFrom, obj.timeTo, obj.title, obj.id);
    });
  };

  const getEventById = (id) => {
    const event = events.filter(event => event.id === id)[0];
    return event;
  };

  const deleteEvent = (id) => {
    events = events.filter(event => {
      return event.id !== id;
    });
    localStorage.setItem('events', JSON.stringify(events));
  };

  const updateEvent = (id, event) => {
    const index = events.findIndex(e => e.id == id);
    events[index] = event;
    localStorage.setItem('events', JSON.stringify(events));
  };

  const clearEvents = () => { localStorage.removeItem('events'); };

  const getEvents = () => { return events; };

  return {
    getEvents,
    addEvent,
    loadEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    clearEvents
  };
})();