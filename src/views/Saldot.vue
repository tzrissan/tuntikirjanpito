<template>
    <div class="chart">
        <div>
            <select v-model="local.kappyra">
                <option v-for="kappyra in local.kappyrat" v-bind:key="kappyra.nimi" v-bind:value="kappyra">{{ kappyra.nimi }}</option>
            </select>
        </div>
        <BarChart
            v-bind:data="chartData"
            v-bind:options="chartOptions" />
    </div>
</template>

<script>

    import Tuntikirjanpito from '../data.js';
    import BarChart from '../components/BarChart';
    import _ from 'lodash';
    import moment from 'moment';
    import {kaikkiAikavalitTapahtumienValilla} from '../date-time-util';

    const kappyrat = (()=>{
        const kappyra = (nimi, chartData) => ({nimi, chartData});
        return [
            kappyra('vuodet', paivat => {
                const paivamaarat = kaikkiAikavalitTapahtumienValilla([{paiva: moment('2000-01-01')}, {paiva: moment('2000-12-31')}], 'day');
                const vuodet = paivat ? _.chain(paivat).keys().map(p => p.split('-')[0]).uniq().sort().map(vuosi => ({ vuosi, vari: CHART_COLORS.next() })).value() : [];
                const oletyksenaNaytetytVuodet = (vuodet.length > 5 ? vuodet.slice(vuodet.length - 3) : vuodet).map(v => v.vuosi);
                const kuluvaVuosi = moment().year();
                const paivaNro = moment().dayOfYear();
                return {
                    labels: paivamaarat.map(p => p.alku).map(a => a.format('D.M.')),
                    datasets: _.chain(vuodet)
                        .map(vuosi => {

                            const data = paivamaarat
                                .map(pvm => vuosi.vuosi + pvm.alku.format('-MM-DD'))
                                .map(pvm => paivat[pvm])
                                .map(paiva => paiva ? paiva.saldo : undefined);
                            for (let i = 0; i < data.length; i++) {
                                // Puljataan dataa niin että viivat jatkuu myös datattomien kolojen yli nätisti
                                data[i] = i > 0 && !data[i] ? data[i - 1] : data[i];
                                // Poistetaan arvailu tulevasta
                                if (vuosi.vuosi === '' + kuluvaVuosi && i > paivaNro) {
                                    data[i] = undefined;
                                }
                            }
                            return {
                                label: 'Saldo ' + vuosi.vuosi,
                                type: 'line',
                                borderColor: vuosi.vari,
                                backgroundColor: vuosi.vari,
                                fill: false,
                                data,
                                yAxisID: "saldo",
                                radius: 0,
                                hidden: !oletyksenaNaytetytVuodet.includes(vuosi.vuosi)
                            }
                        })
                        .value()
                }
            })
        ];
    })();

    const CHART_COLORS = {
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
        },
        next(alpha = 1) {
            this.colorIdx++;
            const rgb = this.colors[this.colorIdx%this.colors.length].join(', ');
            return `rgb(${rgb}, ${alpha})`;
        },
        current(alpha = 1) {
            const rgb = this.colors[this.colorIdx%this.colors.length].join(', ');
            return `rgb(${rgb}, ${alpha})`;
        },
        colorIdx: 0,
        colors: [
            [255, 0, 0],
            [255, 128, 0],
            [152, 255, 51],
            [51, 152, 255],
            [51, 51, 255],
            [152, 51, 255],
            [255, 51, 255],
            [0, 0, 0]
        ]
    };

    export default {
        name: 'Saldot',
        components: {
            BarChart
        },
        computed: {
            chartOptions() {
                function afterDataLimits(axis) {
                    axis.max = axis.max + 1;
                    axis.min = axis.min < 0 ? axis.min - 1 :
                               axis.min === 0 ? -1 :
                               0;
                    return axis;
                }
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [
                            {
                                id: 'saldo',
                                position: 'left',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'saldo'
                                },
                                afterDataLimits
                            }
                        ]
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            chartData() {
                return this.local.kappyra.chartData(this.global.merkinnatPaivittain)
            }
        },
        data() {
            return {
                global: Tuntikirjanpito.get(),
                local: {
                    kappyra: kappyrat[0],
                    kappyrat,
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
        border: 1px solid black;
        padding: 1px 10px;
        margin: 0;
    }

    .chart select {
        height: 24px;
        border: 1px solid black;
        background-color: white;
        padding: 3px 10px;
        margin: 0 10px;
        vertical-align: bottom;
    }

    button {
        height: 24px;
        color: grey;
        border: 1px solid lightgray;
        background-color: white;
        padding: 3px 10px;
    }

    button:hover {
        color: black;
        border-color: black;
    }

    .aiemmin {
        margin-right: 1px;
        border-right: none;
        padding: 3px;
    }

    .myohemmin {
        margin-left: 1px;
        border-left: none;
        padding: 3px;
    }

    .buttongroup {
        display: inline;
        margin: 0 10px;
    }

</style>
