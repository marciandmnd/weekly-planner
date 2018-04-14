import Event from '../src/js/Event';
import { expect } from 'chai';

describe('Event', () => {
  it('should create instance of Event', () => {
    const event = new Event();
    expect(event).to.be.an.instanceof(Event);
  });
})