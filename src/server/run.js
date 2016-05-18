process.env.PORT = process.env.PORT || 3000;
process.env.VUE_ENV = process.env.VUE_ENV || 'server';

require('babel-register');
require('./server');
