<template>
    <div>
        <BarChart
                v-bind:data="chartData"
                v-bind:options="chartOptions"></BarChart>
    </div>
</template>

<script>

    import Tuntikirjanpito from '../data.js';
    import BarChart from './BarChart';
    import _ from 'lodash';
    import moment from 'moment';
    import {kaikkiViikotTapahtumienValilla} from '../date-time-util';
    import {v2018alkusaldo} from '../data';

    export const CHART_COLORS = {
        green(alpha = 1) {
            return 'rgb(179, 193, 0,   alpha)'.replace(/alpha/, alpha);
        },
        blue(alpha = 1) {
            return 'rgb(76,  181, 245, alpha)'.replace(/alpha/, alpha);
        },
        pink(alpha = 1) {
            return 'rgb(255, 105, 180, alpha)'.replace(/alpha/, alpha);
        },
        pine(alpha = 1) {
            return 'rgb(52,  103, 92,  alpha)'.replace(/alpha/, alpha);
        },
        yellow(alpha = 1) {
            return 'rgb(255, 220, 0,   alpha)'.replace(/alpha/, alpha);
        }
    };

    export default {
        name: 'Kappyrat',
        components: {
            BarChart
        },
        computed: {
            chartOptions() {
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            chartData() {

                const viikot  = _.chain(kaikkiViikotTapahtumienValilla(this.global.merkinnat))
                    .map(viikko => ({
                        viikko: viikko.format('gggg/ww'),
                        maanataiPaiva : moment(viikko).startOf('week'),
                        sunnuntaiPaiva : moment(viikko).endOf('week').startOf('day'),
                        merkinnat: this.global.merkinnat.filter(m => moment(m.date).format('gggg/ww') === viikko.format('gggg/ww'))
                    }))
                    .map(viikko => {
                        viikko.paivat = Array.from({length: 7}, (val, idx) => idx).map(
                            n => {
                                return {
                                    viikonpaiva: n,
                                    kirjaus: viikko.merkinnat.filter(m => moment(m.date).format('e') === '' + n).reduce((a, m) => a + m.kirjaus, 0)
                                }
                            }
                        );
                        viikko.kirjausYhteensa = viikko.merkinnat.reduce((a, m) => a + m.kirjaus, 0);
                        viikko.tyopaivia = _.chain(viikko.merkinnat).map(m => m.date).uniq().value().length;
                        viikko.saldomuutos = viikko.kirjausYhteensa - (viikko.tyopaivia * 7.5);
                        return viikko;
                    })
                    .sortBy('viikko')
                    .map((viikko, idx, all) => {
                        viikko.saldo = (idx ? all[idx - 1].saldo : v2018alkusaldo) + (_.isNaN(viikko.saldomuutos) ? 0 : viikko.saldomuutos);
                        return viikko;
                    })
                    .value();

                return {
                    labels: viikot.map(viikko => viikko.maanataiPaiva.format("ww/-gg")),
                    datasets: [{
                        label: 'Tuntisaldo',
                        type: 'line',
                        borderColor: CHART_COLORS.blue(),
                        backgroundColor: CHART_COLORS.blue(0.6),
                        data: viikot.map(viikko => viikko.saldo)
                    },{
                        label: 'Kirjaus',
                        type: 'line',
                        borderColor: CHART_COLORS.pink(),
                        backgroundColor: CHART_COLORS.pink(0.6),
                        fill: false,
                        data: viikot.map(viikko => viikko.kirjausYhteensa)
                    },{
                        label: 'Normiviikko',
                        type: 'line',
                        borderColor: CHART_COLORS.yellow(),
                        backgroundColor: CHART_COLORS.yellow(0.6),
                        fill: false,
                        data: viikot.map(viikko => viikko.tyopaivia * 7.5)
                    }]
                }
            }
        },
        data() {
            return {
                global: Tuntikirjanpito.get()
            }
        }
    }

</script>

<style scoped>

</style>