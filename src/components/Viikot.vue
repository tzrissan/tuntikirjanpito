<template>
    <div>
        <table>
            <thead>
                <th>Viikko</th>
                <th>Ma</th><th>Ti</th><th>Ke</th><th>To</th><th>Pe</th><th>La</th><th>Su</th>
                <th>Kirjaus</th>
                <th colspan="2">Saldo</th>
            </thead>
            <tbody>
            <tr v-for="v in computedViikot" v-bind:key="v.nimi">
                <td class="viikkonro">vk {{ v.alku | moment("ww") }} <span class="vuosi">-{{ v.alku | moment("gg") }} </span> <span class="paivat">({{ v.alku | moment("D.M") }}-{{ v.loppu | moment("D.M.")}})</span></td>
                <td class="kirjaus" v-for="paiva in v.paivat" v-bind:key="paiva.viikonpaiva">
                    <span v-if="paiva.kirjaus !== 0">{{ paiva.kirjaus | numeral('0.0') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="kirjausYhteensa">
                    <span v-if="v.kirjausYhteensa !== 0">{{ v.kirjausYhteensa | numeral('0.0') }}</span>
                    <span v-else>-</span>
                <td class="saldo">
                    <span class="saldomuutos" v-if="v.saldomuutos !== 0">{{ v.saldomuutos | numeral('+0.0') }} h</span>
                    <span v-else>-</span>
                </td>
                <td class="saldo">{{ v.saldo }} h</td>
            </tr>
            <tr>
                <td colspan="11" class="rajoitus">
                    <div class="clickable"
                         v-for="sivukoko in local.sivukoot"
                         v-bind:key="sivukoko.name"
                         v-bind:class="{ active: local.sivukoko === sivukoko}"
                         v-on:click="local.sivukoko = sivukoko">{{ sivukoko.name }}</div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import Tuntikirjanpito from '../data';
    import _ from 'lodash';
    import moment from 'moment';
    import {kaikkiAikavalitTapahtumienValilla} from '../date-time-util';
    import {saldoAikojenAlussa} from '../data';

    const sivukoot = (() => {
        function sivukoko(name, filterFn) {
            return { name, filterFn }
        }
        function filter(viikot, f) {
            if (viikot && viikot.length > 0) {
                const limit = f(moment(viikot[0].alku)).startOf('day');
                return p => p.alku.isAfter(limit);
            } else {
                return () => false;
            }
        }
        return [
            sivukoko('kk', viikot => viikot.filter(filter(viikot, m => m.subtract(1, 'month')))),
            sivukoko('3kk', viikot => viikot.filter(filter(viikot, m => m.subtract(3, 'month')))),
            sivukoko('6kk', viikot => viikot.filter(filter(viikot, m => m.subtract(6, 'month')))),
            sivukoko('vuosi', viikot => viikot.filter(filter(viikot, m => m.subtract(1, 'year')))),
            sivukoko('kaikki', viikot => viikot)
        ]
    })();

    export default {
        name: 'Viikot',
        computed: {
            computedViikot() {
                return this.local.sivukoko.filterFn(_.chain(kaikkiAikavalitTapahtumienValilla(this.global.merkinnat))
                    .map(viikko => {
                        viikko.merkinnat = this.global.merkinnat.filter(m => moment(m.date).isBetween(viikko.alku, viikko.loppu, null, '[]'));
                        return viikko;
                    })
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
                    .sortBy('alku')
                    .map((viikko, idx, all) => {
                        viikko.saldo = (idx ? all[idx - 1].saldo : saldoAikojenAlussa) + (_.isNaN(viikko.saldomuutos) ? 0 : viikko.saldomuutos);
                        return viikko;
                    })
                    .reverse()
                    .value());
            }
        },
        data() {
            return {
                global: Tuntikirjanpito.get(),
                local: {
                    sivukoko: sivukoot[1],
                    sivukoot
                }
            }
        }
    }

</script>

<style scoped>

    table {
        border: 1px solid black;
        margin: 20px auto;
        border-collapse: collapse;
    }

    th {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 10px 20px;
    }

    td {
        padding: 3px 15px;
    }

    tr:nth-child(even) {
        background: #CCC
    }

    tr:nth-child(odd) {
        background: #FFF
    }

    .saldomuutos {
        font-size: small;
    }

    .viikkonro {
        text-align: left;
    }

    .viikkonro .vuosi {
        font-size: small;
    }

    .viikkonro .paivat {
        font-size: small;
    }

    .kirjaus, .kirjausYhteensa, .saldo {
        text-align: right;
    }

    .rajoitus {
        color: black;
    }

    .rajoitus div {
        display: inline;
        border-right: 1px solid black;
        padding: 0 5px
    }

    .rajoitus div:last-child {
        border-right: none;
    }

    .active {
        font-size: large;
        font-weight: bold;
    }


</style>