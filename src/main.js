import Vue from 'vue'
import App from './App.vue'
import Sortable from "sortablejs";

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

/* eslint-disable */
var el = document.getElementById('queue');
var sortable = Sortable.create(el);
var sortable = new Sortable(el, {
  animation: 150
});


function toQueue(player, uri){
  App.data().Songs.push(player,uri);
}

export { toQueue }
