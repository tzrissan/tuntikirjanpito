<template>
    <div class="chart">
        <div>
            <label>Aikaväli</label><input v-model="local.alku" type="date"/>-<input v-model="local.loppu" type="date"/>
            <label>Tarkkus</label>
            <select v-model="local.tarkkuus">
                <option v-for="tarkkuus in local.tarkkuudet" v-bind:key="tarkkuus.nimi" v-bind:value="tarkkuus">{{ tarkkuus.nimi }}</option>
            </select>
        </div>
        <BarChart
            v-bind:data="chartData"
            v-bind:options="chartOptions" />
    </div>
</template>

<script>

    import Tuntikirjanpito from '../data.js';
    import BarChart from './BarChart';
    import _ from 'lodash';
    import moment from 'moment';
    import {kaikkiAikavalitTapahtumienValilla} from '../date-time-util';
    import {beginningOfTime, endOfTime, saldoAikojenAlussa} from '../data';

    const tarkkuudet = (()=>{
        const aikavali = (nimi, step, format) => ({ nimi, step, format });
        return [
            aikavali('paiva', 'day', 'D.M.Y'),
            aikavali('viikko', 'week', 'w/gg'),
            aikavali('kuukausi', 'month', 'M/YY'),
            aikavali('3kk', 'quarter', 'Q/YY'),
            aikavali('vuosi', 'year', 'YYYY')
        ]
    })();

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
                        yAxes: [
                            {id: 'saldo', type: 'linear', position: 'left' },
                            {id: 'kirjaus', type: 'linear', position: 'right', gridLines: {display: false}}
                        ]
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            chartData() {
                const format = this.local.tarkkuus.format;
                const alku = moment(this.local.alku ? this.local.alku : beginningOfTime);
                const loppu = moment(this.local.loppu ? this.local.loppu : endOfTime);
                const merkinnat = _.filter(this.global.merkinnat, m => {
                    return moment(m.date).isBetween(alku, loppu);
                });
                const aikavalit  = _.chain(kaikkiAikavalitTapahtumienValilla(merkinnat, this.local.tarkkuus.step))
                    .map(aikavali => {
                        aikavali.nimi = aikavali.alku.format(format);
                        aikavali.merkinnat = merkinnat.filter(m => moment(m.date).isBetween(aikavali.alku, aikavali.loppu, null, '[]'));
                        return aikavali;
                    })
                    .map(aikavali => {
                        aikavali.kirjausYhteensa = aikavali.merkinnat.reduce((a, m) => a + m.kirjaus, 0);
                        aikavali.tyopaivia = _.chain(aikavali.merkinnat).map(m => m.date).uniq().value().length;
                        aikavali.saldomuutos = aikavali.kirjausYhteensa - (aikavali.tyopaivia * 7.5);
                        return aikavali;
                    })
                    .sortBy('alku')
                    .map((viikko, idx, all) => {
                        viikko.saldo = (idx ? all[idx - 1].saldo : saldoAikojenAlussa) + (_.isNaN(viikko.saldomuutos) ? 0 : viikko.saldomuutos);
                        return viikko;
                    })
                    .value();

                return {
                    labels: aikavalit.map(aikavali => aikavali.nimi),
                    datasets: [{
                        label: 'Tuntisaldo',
                        type: 'line',
                        borderColor: CHART_COLORS.blue(),
                        backgroundColor: CHART_COLORS.blue(0.6),
                        data: aikavalit.map(viikko => viikko.saldo),
                        yAxisID: "saldo"
                    },{
                        label: 'Kirjaus',
                        type: 'line',
                        borderColor: CHART_COLORS.pink(),
                        backgroundColor: CHART_COLORS.pink(0.6),
                        fill: false,
                        data: aikavalit.map(viikko => viikko.kirjausYhteensa),
                        yAxisID: "kirjaus"
                    },{
                        label: 'Normiviikko',
                        type: 'line',
                        borderColor: CHART_COLORS.yellow(),
                        backgroundColor: CHART_COLORS.yellow(0.6),
                        fill: false,
                        data: aikavalit.map(viikko => viikko.tyopaivia * 7.5),
                        yAxisID: "kirjaus"
                    }]
                }
            }
        },
        data() {
            return {
                global: Tuntikirjanpito.get(),
                local: {
                    tarkkuus: tarkkuudet[1],
                    tarkkuudet,
                    alku: moment().subtract(1, 'quarter').format('YYYY-MM-DD'),
                    loppu: moment().format('YYYY-MM-DD')
                }
            }
        }
    }

</script>

<style scoped>
    .chart {
        padding: 20px
    }

    .chart {
        color: black;
    }

    .chart .filter {
        display: inline;
        border-right: 1px solid black;
        padding: 0 5px
    }

    .chart .filter:last-child {
        border-right: none;
    }

    .active {
        font-size: large;
        font-weight: bold;
    }

    .chart label {
        padding: 0 10px;
    }

    .chart input {
        padding: 0 10px;
        margin: 0 5px;
    }

</style>