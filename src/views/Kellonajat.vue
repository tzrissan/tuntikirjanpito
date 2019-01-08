<template>
    <div class="chart">
        <div>
            <div class="buttongroup">
                <button type="button" v-on:click="vuodenAlusta()">vuoden alusta</button>
                <button type="button" v-on:click="yksiVuosi()">1v</button>
                <button type="button" v-on:click="kvartteri()">1/4v</button>
                <button type="button" v-on:click="kuukausi()">kk</button>
            </div>
            <button type="button" class="aiemmin" v-on:click="aiemmin()">&lt;</button><input v-model="local.alku" type="date"/>
            -
            <input v-model="local.loppu" type="date"/><button type="button" class="myohemmin" v-on:click="myohemmin()">&gt;</button>
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
    import BarChart from '../components/BarChart';
    import _ from 'lodash';
    import moment from 'moment';
    import {aikavaliMinuutteina, kaikkiAikavalitTapahtumienValilla, minuutitKellonaikana} from '../date-time-util';
    import {beginningOfTime, endOfTime} from '../data';

    const tarkkuudet = (()=>{
        const aikavali = (nimi, pituus) => ({ nimi, pituus });
        return [
            aikavali('viikko', 7),
            aikavali('kuukausi', 30),
            aikavali('3kk', 91),
            aikavali('vuosi', 365)
        ]
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
        }
    };

    function avg(listOfValues) {
        if (!listOfValues || listOfValues.length === 0) {
            return undefined;
        } else {
            return listOfValues.reduce((a, i) => a + i, 0) / listOfValues.length;
        }
    }

    export default {
        name: 'Kellonajat',
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
                            {
                                id: 'kellonaika',
                                position: 'left',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'klo'
                                },
                                ticks: {
                                    callback: function (label) {
                                        return "klo " + minuutitKellonaikana(label);
                                    },
                                    stepSize: 60
                                }
                            }
                        ]
                    },
                    legend: {
                        position: 'bottom'
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return minuutitKellonaikana(tooltipItem.yLabel)
                            }
                        }
                    }
                }
            },
            chartData() {
                const alku = moment(this.local.alku ? this.local.alku : beginningOfTime);
                const loppu = moment(this.local.loppu ? this.local.loppu : endOfTime);

                const tapahtumatAikavalilla = _.filter(this.global.merkinnat, m => m.paiva.isBetween(alku, loppu, null, '[]'));

                const merkinatPaivittain = _.chain(tapahtumatAikavalilla)
                    .groupBy('date')
                    .toPairs()
                    .fromPairs()
                    .value();

                const paivat = kaikkiAikavalitTapahtumienValilla(tapahtumatAikavalilla, 'day')
                    .map(paiva => {
                        const merkinnat = merkinatPaivittain[paiva.alku.format('YYYY-MM-DD')];
                        if (merkinnat) {
                            return {
                                alku: paiva.alku,
                                tuloaika: aikavaliMinuutteina('00:00', merkinnat.map(m => m.tuloaika).sort()[0]),
                                lahtoaika: aikavaliMinuutteina('00:00', merkinnat.map(m => m.lahtoaika).sort().reverse()[0])
                            }
                        } else {
                            return {
                                alku: paiva.alku
                            }
                        }
                    });

                paivat.forEach((v, i, a) => {
                    const start = Math.max(0, i + 1 - this.local.tarkkuus.pituus);
                    const end = Math.max(0, i + 1);

                    v.avgTuloaika = avg(a.slice(start, end).map(m => m.tuloaika).filter(m => !!m));
                    v.avgLahtoaika = avg(a.slice(start, end).map(m => m.lahtoaika).filter(m => !!m));
                });

                const avgTuloaika = avg(paivat.map(t => t.tuloaika).filter(i => !!i));
                const avgLahtoaika = avg(paivat.map(t => t.lahtoaika).filter(i => !!i));

                return {
                    labels: paivat.map(aikavali => aikavali.alku.format('D.M.Y')),
                    datasets: [{
                        label: 'Tuloaika',
                        type: 'line',
                        borderColor: CHART_COLORS.blue(),
                        backgroundColor: CHART_COLORS.blue(0.6),
                        fill: false,
                        data: paivat.map(p => p.tuloaika),
                        yAxisID: "kellonaika",
                        steppedLine: 'after',
                        showLine: false
                    }, {
                        label: 'Tuloaika, KA, ' + minuutitKellonaikana(avgTuloaika),
                        type: 'line',
                        borderColor: CHART_COLORS.blue(0.6),
                        backgroundColor: CHART_COLORS.blue(0.6),
                        fill: false,
                        hidden: true,
                        data: paivat.map(() => avgTuloaika),
                        yAxisID: "kellonaika",
                        radius: 0
                    }, {
                        label: 'Tuloaika, KA ' + this.local.tarkkuus.nimi,
                        type: 'line',
                        borderColor: CHART_COLORS.blue(0.6),
                        backgroundColor: CHART_COLORS.blue(0.6),
                        fill: false,
                        data: paivat.map(p => p.avgTuloaika),
                        yAxisID: "kellonaika",
                        radius: 0
                    }, {
                        label: 'Lähtöaika',
                        type: 'line',
                        borderColor: CHART_COLORS.pink(),
                        backgroundColor: CHART_COLORS.pink(0.6),
                        fill: false,
                        data: paivat.map(p => p.lahtoaika),
                        yAxisID: "kellonaika",
                        showLine: false
                    }, {
                        label: 'Lähtöaika, KA, ' + minuutitKellonaikana(avgLahtoaika),
                        type: 'line',
                        borderColor: CHART_COLORS.pink(0.6),
                        backgroundColor: CHART_COLORS.pink(0.6),
                        fill: false,
                        hidden: true,
                        data: paivat.map(() => avgLahtoaika),
                        yAxisID: "kellonaika",
                        radius: 0
                    }, {
                        label: 'Lähtöaika, KA ' + this.local.tarkkuus.nimi,
                        type: 'line',
                        borderColor: CHART_COLORS.pink(0.6),
                        backgroundColor: CHART_COLORS.pink(0.6),
                        fill: false,
                        data: paivat.map(p => p.avgLahtoaika),
                        yAxisID: "kellonaika",
                        radius: 0
                    }]
                }
            }
        },
        methods: {
            vuodenAlusta() {
                if (this.local.alku) {
                    this.local.alku = moment(this.local.alku).startOf('year').format('YYYY-MM-DD');
                } else if (this.local.loppu) {
                    this.local.alku = moment(this.local.loppu).startOf('year').format('YYYY-MM-DD');
                } else {
                    this.local.alku = moment().startOf('year').format('YYYY-MM-DD');
                }
            },
            yksiVuosi() {
                if (this.local.alku) {
                    this.local.loppu = moment(this.local.alku).add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD');
                } else if (this.local.loppu) {
                    this.local.alku = moment(this.local.loppu).subtract(1, 'year').add(1, 'day').format('YYYY-MM-DD');
                } else {
                    this.local.alku = moment().subtract(1, 'year').add(1, 'day').format('YYYY-MM-DD');
                    this.local.loppu = moment().format('YYYY-MM-DD');
                }
            },
            kvartteri() {
                if (this.local.alku) {
                    this.local.loppu = moment(this.local.alku).add(1, 'quarter').format('YYYY-MM-DD');
                } else if (this.local.loppu) {
                    this.local.alku = moment(this.local.loppu).subtract(1, 'quarter').format('YYYY-MM-DD');
                } else {
                    this.local.alku = moment().subtract(1, 'quarter').format('YYYY-MM-DD');
                    this.local.loppu = moment().format('YYYY-MM-DD');
                }
            },
            kuukausi() {
                if (this.local.alku) {
                    this.local.loppu = moment(this.local.alku).add(1, 'month').format('YYYY-MM-DD');
                } else if (this.local.loppu) {
                    this.local.alku = moment(this.local.loppu).subtract(1, 'month').format('YYYY-MM-DD');
                } else {
                    this.local.alku = moment().subtract(1, 'month').format('YYYY-MM-DD');
                    this.local.loppu = moment().format('YYYY-MM-DD');
                }
            },
            aiemmin() {
                if (this.local.alku && this.local.loppu) {
                    const valinPituus = Math.abs(moment(this.local.loppu).diff(this.local.alku, 'days'))+1;
                    this.local.alku = moment(this.local.alku).subtract(valinPituus, 'days').format('YYYY-MM-DD');
                    this.local.loppu = moment(this.local.loppu).subtract(valinPituus, 'days').format('YYYY-MM-DD');
                }
            },
            myohemmin() {
                if (this.local.alku && this.local.loppu) {
                    const valinPituus = Math.abs(moment(this.local.loppu).diff(this.local.alku, 'days'))+1;
                    this.local.alku = moment(this.local.alku).add(valinPituus, 'days').format('YYYY-MM-DD');
                    this.local.loppu = moment(this.local.loppu).add(valinPituus, 'days').format('YYYY-MM-DD');
                }
            }
        },
        data() {
            return {
                global: Tuntikirjanpito.get(),
                local: {
                    tarkkuus: tarkkuudet[0],
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
