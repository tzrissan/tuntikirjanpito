<template>
    <div>
        <h1>Viikot</h1>

        <table>
            <thead>
                <th>Viikko</th>
                <th>Ma</th>
                <th>Ti</th>
                <th>Ke</th>
                <th>To</th>
                <th>Pe</th>
                <th>La</th>
                <th>Su</th>
                <th>Kirjaus</th>
                <th colspan="2">Saldo</th>
            </thead>
            <tbody>
            <tr v-for="v in local.viikot" v-bind:key="v.viikko">
                <td>{{ v.viikko }}</td>
                <td v-for="paiva in v.paivat" v-bind:key="paiva.viikonpaiva">
                    <span v-if="paiva.kirjaus !== 0">{{ paiva.kirjaus | numeral('0.0') }}</span>
                    <span v-else>-</span>
                </td>
                <td>{{ v.kirjausYhteensa | numeral('0.0') }}</td>
                <td>
                    <span class="saldomuutos" v-if="v.saldomuutos !== 0">{{ v.saldomuutos | numeral('+0.0') }} h</span>
                    <span v-else>-</span>
                </td>
                <td>{{ v.saldo }} h</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import Tuntikirjanpito from '../data';
    import _ from 'lodash';
    import moment from 'moment';

    const v2018alkusaldo = 18.0;

    function yhdistaViikot(merkinnat) {
        return _.chain(merkinnat)
            .map(m => {
                const paiva = moment(m.date);
                m.viikko = paiva.format('gggg/ww');
                m.viikonpaiva = paiva.format('e');
                console.log(m);
                return m;
            })
            .groupBy('viikko')
            .toPairs()
            .map(viikko => {
                return {
                    viikko: viikko[0],
                    paivat: [0,1,2,3,4,5,6].map(
                        n => {
                            return {
                                viikonpaiva: n,
                                kirjaus: viikko[1].filter(m => m.viikonpaiva === '' + n).reduce((a, m) => a + m.kirjaus, 0)
                            }
                        }
                    ),
                    kirjausYhteensa: viikko[1].reduce((a, m) => a + m.kirjaus, 0),
                    saldomuutos: viikko[1].reduce((a, m) => a + m.kirjaus, -37.5) ,
                    merkinnat: _.sortBy(viikko[1], ['viikonpaiva', 'tuloaika', 'lahtoaika'])
                }
            })
            .sortBy('viikko')
            .map((viikko, idx, all) => {
                viikko.saldo = (idx ? all[idx - 1].saldo : v2018alkusaldo) + (_.isNaN(viikko.saldomuutos) ? 0 : viikko.saldomuutos);
                return viikko;
            })
            .reverse()
            .value();
    }

    export default {
        name: 'Viikot',
        data() {
            const global = Tuntikirjanpito.get();
            return {
                global,
                local: {
                    viikot: yhdistaViikot(global.merkinnat),
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

</style>