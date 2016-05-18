import Vue from '../../vue/vue';
import App from '../common/app';
// import App from '../components/app.vue';

new Vue(Object.assign(App, {
  el: '#app',
  data: window.__INITIAL_STATE__
}));
