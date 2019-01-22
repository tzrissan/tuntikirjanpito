<template>
    <div>
        <table>
            <thead>
            <tr>
                <th>vko</th>
                <th></th>
                <th>Ma</th>
                <th>Ti</th>
                <th>Ke</th>
                <th>To</th>
                <th>Pe</th>
                <th>La</th>
                <th>Su</th>
                <th class="kirjausYhteensa">Kirjaus</th>
                <th class="saldo">&Delta;</th>
                <th class="saldo">Saldo</th>
            </tr>
            </thead>
            <tbody>
            <ViikkoTilastoRivi title="Min" :values="minValues" numberFormat="'0.0'"/>
            <ViikkoTilastoRivi title="Max" :values="maxValues" numberFormat="'0.0'"/>
            <ViikkoTilastoRivi title="Avg" :values="avgValues" numberFormat="'0.00'"/>
            <ViikkoTilastoRivi title="Median" :values="medianValues" numberFormat="'0.00'"/>
            </tbody>
            <tbody>
            <tr>
                <td colspan="12" class="rajoitus">
                    <div class="clickable"
                         v-for="s in sivukoot"
                         :key="s.name"
                         :class="{ active: local.sivukoko === s}"
                         v-on:click="local.sivukoko = s">{{ s.name }}</div>
                </td>
            </tr>
            </tbody>
            <tbody>
            <tr v-for="v in computedViikot" :key="v.nimi"
                :class="{
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
                    v-for="paiva in v.paivat" :key="paiva.viikonpaiva"
                    :class="{ 'kuukauden-alku': paiva.kuukaudenAlku }">
                    <span v-if="paiva.kirjaus">{{ paiva.kirjaus | numeral('0.0') }}</span>
                </td>
                <td class="kirjausYhteensa">
                    <span v-if="v.kirjausYhteensa !== 0">{{ v.kirjausYhteensa | numeral('0.0') }}</span>
                <td class="saldo">
                    <span class="saldomuutos" v-if="v.saldomuutos !== 0">{{ v.saldomuutos | numeral('+0.0') }}</span>
                </td>
                <td class="saldo">{{ v.saldo | numeral('0.0') }}</td>
            </tr>
            </tbody>
            <tbody v-if="computedViikot.length > 35">
            <tr>
                <td colspan="12" class="rajoitus">
                    <div class="clickable"
                         v-for="s in sivukoot"
                         :key="s.name"
                         :class="{ active: local.sivukoko === s}"
                         v-on:click="local.sivukoko = s">{{ s.name }}</div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import _ from 'lodash';
    import moment from 'moment';

    import Tuntikirjanpito from '@/data';
    import {kaikkiAikavalit, kaikkiAikavalitTapahtumienValilla} from '@/date-time-util'
    import {min, max, avg, median, sum, exists, last} from '@/util'

    import ViikkoTilastoRivi from '@/components/ViikkoTilastoRivi'

    function sivukoko(name, alku, loppu) {
        return {name, alku, loppu}
    }

    const oletusSivukoot = [
        sivukoko('kk', moment().locale('fi').subtract(1, 'month').startOf('day'), moment().endOf('day')),
        sivukoko('3kk', moment().locale('fi').subtract(3, 'month').startOf('day'), moment().endOf('day')),
        sivukoko('6kk', moment().locale('fi').subtract(6, 'month').startOf('day'), moment().endOf('day')),
        sivukoko('vuosi', moment().locale('fi').subtract(1, 'year').startOf('day'), moment().endOf('day'))
    ];
    export default {
        name: 'Viikot',
        components: {ViikkoTilastoRivi},
        computed: {
            computedViikot() {
                const self = this;
                const pyhat = this.global.pyhat.map(p => p.date);

                return _.chain(kaikkiAikavalit(self.local.sivukoko.alku, self.local.sivukoko.loppu))
                    .map(viikko => {
                        viikko.kuukaudenVaihtoViikolla = viikko.alku.month() !== viikko.loppu.month();
                        viikko.vuodenVaihtoViikolla = viikko.alku.year() !== viikko.loppu.year();
                        viikko.vuodenVaihtoSuMa = viikko.alku.date() === 1 && viikko.alku.month() === 0;
                        viikko.kuukaudenVaihtoSuMa = viikko.alku.date() === 1;

                        viikko.paivat = Array.from({length: 7}, (val, idx) => idx).map(
                            n => {
                                const paiva = moment(viikko.alku).add(n, 'day');
                                const merkinnat = paiva.isBetween(self.local.sivukoko.alku, self.local.sivukoko.loppu) ?
                                    self.global.merkinnatPaivittain[paiva.format('YYYY-MM-DD')] :
                                    undefined;
                                return {
                                    paiva,
                                    merkinnat,
                                    viikonpaiva: n,
                                    kuukaudenAlku: viikko.kuukaudenVaihtoViikolla && paiva.date() === 1,
                                    kirjaus: merkinnat ? merkinnat.kirjaus : undefined,
                                    saldo: merkinnat ? merkinnat.saldo : undefined
                                }
                            }
                        );

                        viikko.kirjausYhteensa = viikko.paivat.map(p => _.get(p, 'merkinnat.kirjaus', 0)).reduce(sum, 0);
                        viikko.ylityo = viikko.paivat.map(p => _.get(p, 'merkinnat.ylityo', 0)).reduce(sum, 0);
                        viikko.tyopaivia = viikko.paivat
                            .filter(p => p.merkinnat)
                            .map(p => p.paiva)
                            .filter(p => p.weekday() < 5)
                            .filter(d => !pyhat.includes(d))
                            .length;
                        viikko.saldomuutos = viikko.kirjausYhteensa - (viikko.tyopaivia * 7.5);
                        viikko.saldo = viikko.paivat.map(p => p.saldo).filter(exists).find(last)
                        return viikko;
                    })
                    .sortBy('alku')
                    .reverse()
                    .value();
            },
            sivukoot () {
                const firstDay = _.get(this.global, 'merkinnat[0].paiva', moment().startOf('day'));
                const sivukoot = [...oletusSivukoot];
                sivukoot.splice(4, 0, sivukoko('kaikki', firstDay, moment().endOf('day')));
                sivukoot.splice(4, 0,
                    ...kaikkiAikavalitTapahtumienValilla(this.global.merkinnat, 'year')
                        .map(aikavali => sivukoko(
                            aikavali.alku.format('YYYY'),
                            aikavali.alku,
                            moment().isBefore(aikavali.loppu) ? moment() : aikavali.loppu)));
                return sivukoot;
            },
            minValues() {
                return {
                    ma: this.computedViikot.map(v => v.paivat[0].kirjaus).reduce(min, undefined),
                    ti: this.computedViikot.map(v => v.paivat[1].kirjaus).reduce(min, undefined),
                    ke: this.computedViikot.map(v => v.paivat[2].kirjaus).reduce(min, undefined),
                    to: this.computedViikot.map(v => v.paivat[3].kirjaus).reduce(min, undefined),
                    pe: this.computedViikot.map(v => v.paivat[4].kirjaus).reduce(min, undefined),
                    la: this.computedViikot.map(v => v.paivat[5].kirjaus).reduce(min, undefined),
                    su: this.computedViikot.map(v => v.paivat[6].kirjaus).reduce(min, undefined),
                    tot: this.computedViikot
                        .map(v => v.paivat)
                        .map(p => p.map(x=>x.kirjaus).reduce(min, undefined))
                        .reduce(min, undefined),
                    kirjausYhteensa: this.computedViikot.map(v => v.kirjausYhteensa).reduce(min, undefined),
                    saldomuutos: this.computedViikot.map(v => v.saldomuutos).reduce(min, undefined),
                    saldo: this.computedViikot.map(v => v.saldo).reduce(min, undefined)
                }
            },
            maxValues() {
                return {
                    ma: this.computedViikot.map(v => v.paivat[0].kirjaus).reduce(max, undefined),
                    ti: this.computedViikot.map(v => v.paivat[1].kirjaus).reduce(max, undefined),
                    ke: this.computedViikot.map(v => v.paivat[2].kirjaus).reduce(max, undefined),
                    to: this.computedViikot.map(v => v.paivat[3].kirjaus).reduce(max, undefined),
                    pe: this.computedViikot.map(v => v.paivat[4].kirjaus).reduce(max, undefined),
                    la: this.computedViikot.map(v => v.paivat[5].kirjaus).reduce(max, undefined),
                    su: this.computedViikot.map(v => v.paivat[6].kirjaus).reduce(max, undefined),
                    tot: this.computedViikot
                        .map(v => v.paivat)
                        .map(p => p.map(x=>x.kirjaus).reduce(max, undefined))
                        .reduce(max, undefined),
                    kirjausYhteensa: this.computedViikot.map(v => v.kirjausYhteensa).reduce(max, undefined),
                    saldomuutos: this.computedViikot.map(v => v.saldomuutos).reduce(max, undefined),
                    saldo: this.computedViikot.map(v => v.saldo).reduce(max, undefined)
                }
            },
            avgValues() {
                return {
                    ma: avg(this.computedViikot.map(v => v.paivat[0].kirjaus).filter(exists)),
                    ti: avg(this.computedViikot.map(v => v.paivat[1].kirjaus).filter(exists)),
                    ke: avg(this.computedViikot.map(v => v.paivat[2].kirjaus).filter(exists)),
                    to: avg(this.computedViikot.map(v => v.paivat[3].kirjaus).filter(exists)),
                    pe: avg(this.computedViikot.map(v => v.paivat[4].kirjaus).filter(exists)),
                    la: avg(this.computedViikot.map(v => v.paivat[5].kirjaus).filter(exists)),
                    su: avg(this.computedViikot.map(v => v.paivat[6].kirjaus).filter(exists)),
                    tot: avg(_.flatten(this.computedViikot.map(v => v.paivat)).map(x=>x.kirjaus).filter(exists)),
                    kirjausYhteensa: avg(this.computedViikot.map(v => v.kirjausYhteensa).filter(exists)),
                    saldomuutos: avg(this.computedViikot.map(v => v.saldomuutos).filter(exists)),
                    saldo: avg(this.computedViikot.map(v => v.saldo).filter(exists))
                }
            },
            medianValues() {
                return {
                    ma: median(this.computedViikot.map(v => v.paivat[0].kirjaus).filter(exists)),
                    ti: median(this.computedViikot.map(v => v.paivat[1].kirjaus).filter(exists)),
                    ke: median(this.computedViikot.map(v => v.paivat[2].kirjaus).filter(exists)),
                    to: median(this.computedViikot.map(v => v.paivat[3].kirjaus).filter(exists)),
                    pe: median(this.computedViikot.map(v => v.paivat[4].kirjaus).filter(exists)),
                    la: median(this.computedViikot.map(v => v.paivat[5].kirjaus).filter(exists)),
                    su: median(this.computedViikot.map(v => v.paivat[6].kirjaus).filter(exists)),
                    tot: median(_.flatten(this.computedViikot.map(v => v.paivat)).map(x=>x.kirjaus).filter(exists)),
                    kirjausYhteensa: median(this.computedViikot.map(v => v.kirjausYhteensa).filter(exists)),
                    saldomuutos: median(this.computedViikot.map(v => v.saldomuutos).filter(exists)),
                    saldo: median(this.computedViikot.map(v => v.saldo).filter(exists))
                }
            }

        },
        data() {
            const global = Tuntikirjanpito.get();
            const local = {
                sivukoko: oletusSivukoot[1]
            };
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

    tbody {
        border-bottom: 1px solid black;
    }


</style>
