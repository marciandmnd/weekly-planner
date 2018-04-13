/** Class representing an event. */
class Event {  // eslint-disable-line no-unused-vars 
  constructor(day, timeFrom, timeTo, title, id) {
    this.day = day;
    this.timeFrom = timeFrom;
    this.timeTo = timeTo;
    this.title = title;
    this.id = id;
  }

  setTimeFrom(timeFrom) {
    this.timeFrom = timeFrom;
  }

  setTimeTo(timeTo) {
    this.timeTo = timeTo;
  }

  setTitle(title) {
    this.title = title;
  }

  getTimeFromMinute(asString) {
    const minute = this.timeFrom.split(':')[1];
    return asString ? minute : parseInt(minute);
  }

  getTimeFromHour(asString) {
    const hour = this.timeFrom.split(':')[0];
    return asString ? hour : parseInt(hour);
  }

  getTimeFrom() {
    return this.timeFrom;
  }

  getTimeToMinute(asString) {
    const minute = this.timeTo.split(':')[1];
    return asString ? minute : parseInt(minute);
  }

  getTimeTo() {
    return this.timeTo;
  }

  getBlockHeight() {
    let timeFrom = new Date(`2018/01/01 ${this.timeFrom}`);
    let timeTo = new Date(`2018/01/01 ${this.timeTo}`);

    let hours = (timeTo - timeFrom)/3600000;
    return (hours * 64);
  }
}