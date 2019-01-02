<template>
    <div>
        <table>
            <thead>
                <th>vko</th>
                <th></th>
                <th>Ma</th><th>Ti</th><th>Ke</th><th>To</th><th>Pe</th><th>La</th><th>Su</th>
                <th class="kirjausYhteensa">Kirjaus</th>
                <th class="saldo">&Delta;</th>
                <th class="saldo">Saldo</th>
            </thead>
            <tbody>
            <tr v-for="v in computedViikot" v-bind:key="v.nimi"
                v-bind:class="{
                    'vuoden-vaihto-viikolla': v.vuodenVaihtoViikolla,
                    'vuoden-vaihto-su-ma': v.vuodenVaihtoSuMa,
                    'kuukauden-vaihto-viikolla': v.kuukaudenVaihtoViikolla,
                    'kuukauden-vaihto-su-ma': v.kuukaudenVaihtoSuMa
                    }">
                <td class="viikkonro">{{ v.alku | moment("ww/gg") }}</td>
                <td class="paivat">
                    <template v-if="!v.kuukaudenVaihtoViikolla && !v.vuodenVaihtoViikolla">{{ v.alku | moment("D.") }}-{{ v.loppu | moment("D.M.YYYY")}}</template>
                    <template v-if="v.kuukaudenVaihtoViikolla && !v.vuodenVaihtoViikolla">{{ v.alku | moment("D.M.") }} - {{ v.loppu | moment("D.M.YYYY")}}</template>
                    <template v-if="v.vuodenVaihtoViikolla">{{ v.alku | moment("D.M.YYYY") }} - {{ v.loppu | moment("D.M.YYYY")}}</template>
                </td>
                <td class="kirjaus"
                    v-for="paiva in v.paivat" v-bind:key="paiva.viikonpaiva"
                    v-bind:class="{ 'kuukauden-alku': paiva.kuukaudenAlku }">
                    <span v-if="paiva.kirjaus !== 0">{{ paiva.kirjaus | numeral('0.0') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="kirjausYhteensa">
                    <span v-if="v.kirjausYhteensa !== 0">{{ v.kirjausYhteensa | numeral('0.0') }}</span>
                    <span v-else>-</span>
                <td class="saldo">
                    <span class="saldomuutos" v-if="v.saldomuutos !== 0">{{ v.saldomuutos | numeral('+0.0') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="saldo">{{ v.saldo | numeral('0.0') }}</td>
            </tr>
            <tr>
                <td colspan="12" class="rajoitus">
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
    import {kaikkiAikavalit, kaikkiAikavalitTapahtumienValilla} from '../date-time-util';

    const sivukoot = merkinnat => {
        function sivukoko(name, alku, loppu) {
            return {name, alku, loppu}
        }
        const sivukoot = [
            sivukoko('kk', moment().subtract(1, 'month').startOf('day'), moment().endOf('day')),
            sivukoko('3kk', moment().subtract(3, 'month').startOf('day'), moment().endOf('day')),
            sivukoko('6kk', moment().subtract(6, 'month').startOf('day'), moment().endOf('day')),
            sivukoko('vuosi', moment().subtract(1, 'year').startOf('day'), moment().endOf('day')),
            sivukoko('kaikki', merkinnat[0].paiva, moment().endOf('day'))
        ];
        sivukoot.splice(4, 0,
            ...kaikkiAikavalitTapahtumienValilla(merkinnat, 'year')
                .map(aikavali => sivukoko(
                    aikavali.alku.format('YYYY'),
                    aikavali.alku,
                    moment().isBefore(aikavali.loppu)? moment() : aikavali.loppu)));
        return sivukoot;
    };

    export default {
        name: 'Viikot',
        computed: {
            computedViikot() {
                const self = this;
                const pyhat = this.global.pyhat.map(p => p.date);
                const valitutṔaivat = _.filter(this.global.merkinnatPaivittain, p => p.paiva.isBetween(self.local.sivukoko.alku, self.local.sivukoko.loppu));
                const merkinnatViikoittain = _.groupBy(_.values(valitutṔaivat), m => moment(m.paiva).startOf('week'));

                return _.chain(kaikkiAikavalit(self.local.sivukoko.alku, self.local.sivukoko.loppu))
                    .map(viikko => {
                        viikko.merkinnat = merkinnatViikoittain[viikko.alku] || [];
                        return viikko;
                    })
                    .map(viikko => {
                        viikko.paivat = Array.from({length: 7}, (val, idx) => idx).map(
                            n => {
                                return {
                                    viikonpaiva: n,
                                    kuukaudenAlku: viikko.alku.month() !== viikko.loppu.month() && moment(viikko.alku).add(n, 'day').date() === 1,
                                    kirjaus: viikko.merkinnat.filter(m => m.paiva.weekday() === n).reduce((a, m) => a + m.kirjaus, 0)
                                }
                            }
                        );
                        viikko.vuodenVaihtoViikolla = viikko.alku.year() !== viikko.loppu.year();
                        viikko.kuukaudenVaihtoViikolla = viikko.alku.month() !== viikko.loppu.month();
                        viikko.vuodenVaihtoSuMa = viikko.alku.date()===1 && viikko.alku.month()===0;
                        viikko.kuukaudenVaihtoSuMa = viikko.alku.date()===1;
                        viikko.kirjausYhteensa = viikko.merkinnat.reduce((a, m) => a + m.kirjaus, 0);
                        viikko.ylityo = viikko.merkinnat.reduce((a, m) => a + (m.ylityo ? m.ylityo : 0), 0);
                        viikko.tyopaivia = _.chain(viikko.merkinnat)
                            .filter(m => m.paiva.weekday() < 5)
                            .map(m => m.date)
                            .uniq()
                            .filter(d => !pyhat.includes(d))
                            .value().length;
                        viikko.saldomuutos = viikko.kirjausYhteensa - (viikko.tyopaivia * 7.5);
                        viikko.saldo = viikko.merkinnat.length > 0 ? viikko.merkinnat[viikko.merkinnat.length - 1].saldo : undefined;
                        return viikko;
                    })
                    .sortBy('alku')
                    /*.map((viikko, idx, all) => {
                        //viikko.saldo = (idx ? all[idx - 1].saldo : saldoAikojenAlussa) + (_.isNaN(viikko.saldomuutos) ? 0 : viikko.saldomuutos) - viikko.ylityo;
                        return viikko;
                    })*/
                    .reverse()
                    .value();
            }
        },
        data() {
            const global = Tuntikirjanpito.get();
            const local = {
                sivukoot: sivukoot(global.merkinnat),
            };
            local.sivukoko = local.sivukoot[1];
            return {global, local}
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
        padding: 7px 10px;
    }

    td {
        padding: 3px 15px;
        white-space: nowrap;
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

    .paivat {
        font-size: small;
        text-align: right;
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

    .kuukauden-vaihto-viikolla td {
        border-top: 1px solid grey;
    }

    .kuukauden-vaihto-viikolla td.kuukauden-alku {
        border-top: none;
        border-left: 1px solid gray;
        border-bottom: 1px solid gray;
    }

    .kuukauden-vaihto-viikolla td.kuukauden-alku ~ td {
        border-top: none;
        border-bottom: 1px solid grey;
    }

    .vuoden-vaihto-viikolla td {
        border-top: 3px double black;
    }

    .vuoden-vaihto-viikolla td.kuukauden-alku {
        border-top: none;
        border-left: 3px double black;
        border-bottom: 3px double black;
    }

    .vuoden-vaihto-viikolla td.kuukauden-alku ~ td {
        border-top: none;
        border-bottom: 3px double black;
    }

    .kuukauden-vaihto-su-ma {
        border-bottom: 1px solid grey;
    }

    .vuoden-vaihto-su-ma {
        border-bottom: 3px double black;
    }


</style>
