import Vue from 'vue'
import App from './App.vue'
import _ from 'lodash';
import numeral from 'numeral';
import router from './router'
import {aikavali2UiStr} from './date-time-util'

const moment = require('moment');
require('moment/locale/fi');
moment.locale('fi');

Vue.filter('aikavali2UiStr', aikavali2UiStr);

Vue.filter("numeral", function (value, format = '0') {
    if (_.isNumber(value) && !_.isNaN(value)) {
        return numeral(value).format(format)
    } else {
        return value;
    }
});

numeral.register('locale', 'fi', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function () {
        return '.'
    },
    currency: {
        symbol: '€'
    }
});
numeral.locale('fi');


Vue.config.productionTip = false;
Vue.use(require('vue-moment'), {moment});
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
