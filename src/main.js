import Vue from 'vue'
import App from './App.vue'
import _ from 'lodash';
import numeral from 'numeral';
import router from './router'

const moment = require('moment');
require('moment/locale/fi');
moment.locale('fi');

Vue.filter('aikavali2UiStr', function (aikavaliMinuutteina, naytaPlusMerkki = false) {
    if (_.isNumber(aikavaliMinuutteina) && !_.isNaN(aikavaliMinuutteina)) {
        const sign = aikavaliMinuutteina < 0 ? '-' : (aikavaliMinuutteina > 0 && naytaPlusMerkki ? '+' : '');
        const minuutteja = Math.abs(aikavaliMinuutteina);
        const d = numeral(Math.trunc(minuutteja / (24 * 60))).format('0');
        const h = numeral(Math.trunc(minuutteja / 60) - (d * 24)).format('00');
        const m = numeral(Math.trunc(minuutteja % 60)).format('00');
        const fullText = `${sign}${d}:${h}:${m}`;
        return fullText.replace(/^([+-]?)0:0?([1-9]?[0-9]:)/, '$1$2').replace(/^0:00$/, '-');
    } else {
        return aikavaliMinuutteina;
    }
});

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
Vue.use(require('vue-moment'), { moment });
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
