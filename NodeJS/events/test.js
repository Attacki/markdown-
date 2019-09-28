var e = require('events')

const target = new e()

target.once('foo',()=> console.log('first!'))
target.prependOnceListener('foo', () => console.log('second!'));

target.emit('foo')