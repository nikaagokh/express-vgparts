import EventEmitter2  from 'eventemitter2';

const eventEmitter = new EventEmitter2({
    wildcard:false,
    delimiter:'.',
    maxListeners:10
})

export default eventEmitter;