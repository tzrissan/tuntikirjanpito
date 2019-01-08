<template>
    <div class="hello">
        <form>
            <table>
                <colgroup>
                    <col class="toiminnot"/>
                    <col/>
                    <col/>
                    <col/>
                    <col/>
                    <col class="toiminnot"/>
                    <col/>
                    <col/>
                    <col/>
                    <col/>
                    <col/>
                </colgroup>
                <thead>
                <tr>
                    <th class="toiminnot uusi" v-on:click="local.uusi = true; local.editId = undefined;">+</th>
                    <th colspan="2">Pvm</th>
                    <th>Tuloaika - <br> Lähtöaika</th>
                    <th><small>Lounas</small></th>
                    <th>Työaika</th>
                    <th>Kirjaus</th>
                    <th><small>Työaika<br>- Kirjaus</small></th>
                    <th>Saldo</th>
                    <th>&Delta;</th>
                    <th class="kommentti">kommentti</th>
                </tr>
                </thead>
                <tbody>
                <UusiRivi v-if="local.uusi" v-bind:done="uusiRiviLisatty"></UusiRivi>
                <tr v-for="paiva in computedPaivat" v-bind:key="paiva.date"
                    v-bind:class="{ 'vuoden-eka-paiva': paiva.paiva.dayOfYear() === 1, 'kuukauden-eka-paiva': paiva.paiva.date() === 1}">
                    <td class="toiminnot">
                        <div v-if="isEditing(paiva)">
                            <button type="button" class="submit" v-on:click="tallenna(paiva)">&#x2713;</button>
                            <button type="button" class="cancel" v-on:click="tyhjenna()">&#x2715;</button>
                        </div>
                        <button v-else-if="isEditable(paiva)"
                                type="button" class="edit" v-on:click="edit(paiva)">EDIT</button>
                    </td>
                    <td  class="pvm">
                        {{ paiva.date | moment("dd") }}
                    </td>
                    <td  class="pvm">
                        {{ paiva.date | moment("D.M.YYYY") }}
                    </td>
                    <td  class="tuloJaLahtoajat">
                        <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                            <template v-if="isEditing(paiva)">
                                <input type="text" class="tuloaika" minlength="3" maxlength="5" v-model="merkinta.tuloaika"/>
                                <button type="button" v-on:click="tulinJust(merkinta)">ny</button>
                                <button type="button" v-on:click="tulinYsilt(merkinta)">9</button>
                                -
                                <input type="text" class="lahtoaika" minlength="3" maxlength="5" v-model="merkinta.lahtoaika"/>
                                <button type="button" v-on:click="meenIhanKohta(merkinta)">ny</button>
                                <button type="button" v-on:click="meenViidelta(merkinta)">5</button>
                                <button type="button" class="delete" v-on:click="poista(merkinta.id)">&#x2715;</button>
                            </template>
                            <span v-else>{{ merkinta.tuloaika }} - {{ merkinta.lahtoaika }}<br></span>
                            <span v-if="merkinta.saving">saving in progress</span>
                        </div>
                    </td>
                    <td>
                        <div v-if="isEditing(paiva)">
                            <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                                <input type="number" class="lounaita" v-model="merkinta.lounaita" min="0"/>
                            </div>
                        </div>
                        <span v-else>{{ paiva.lounaita }}</span>
                    </td>
                    <td>
                        <small v-if="isEditing(paiva)">
                            <span v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">{{ laskeTyoaika(merkinta) | aikavali2UiStr }} <br></span>
                        </small>
                        <small v-else>{{ paiva.tyoaika | aikavali2UiStr }}</small>
                        </td>
                    <td>
                        <div v-if="isEditing(paiva)">
                            <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                                <input type="number" class="kirjaus" v-model="merkinta.kirjaus" min="0" step="0.5"/>
                            </div>
                        </div>
                        <span v-else-if="paiva.kirjaus">{{ paiva.kirjaus }} h</span>
                    </td>
                    <td class="kirjausvirhe">
                        <small v-if="!isEditing(paiva) && paiva.kirjausvirheenmuutos" v-bind:class="{ alert: paiva.kirjausvirheAlert}">
                            {{ paiva.kirjausvirheenmuutos | aikavali2UiStr(true) }}
                        </small>
                    </td>
                    <td class="saldo">
                        <span v-if="!isEditing(paiva) && paiva.saldo">{{ paiva.saldo | numeral('0.0') }} h </span>
                    </td>
                    <td class="saldo">
                        <small v-if="!isEditing(paiva) && paiva.saldomuutos"  v-bind:class="{ alert: paiva.saldomuutosAlert}">
                            {{ paiva.saldomuutos | numeral('+0.0') }} h
                        </small>
                    </td>
                    <td class="kommentti">
                        <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                            <input v-if="isEditing(paiva)" class="kommentti" type="text" v-model="merkinta.kommentti"/>
                            <span v-else>{{ merkinta.kommentti }}</span>
                        </div>

                    </td>
                </tr>
                <tr>
                    <td colspan="11" class="rajoitus">
                        <div class="clickable"
                             v-for="sivukoko in sivukoot"
                             v-bind:key="sivukoko.name"
                             v-bind:class="{ active: local.sivukoko === sivukoko}"
                             v-on:click="local.sivukoko = sivukoko">{{ sivukoko.name }}</div>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>
</template>

<script>

    import _ from 'lodash';
    import axios from 'axios';
    import moment from 'moment';
    import Tuntikirjanpito from '../data.js';
    import UusiRivi from "./UusiRivi";
    import {aikavaliMinuutteina, formatTimeFromString, kaikkiAikavalitTapahtumienValilla, kaikkiAikavalit, nyt} from '../date-time-util';

    function sivukoko(name, alku, loppu) {
        return {name, alku, loppu}
    }
    const oletusSivukoot = [
        sivukoko('kk', moment().subtract(1, 'month').startOf('day'), moment().endOf('day')),
        sivukoko('3kk', moment().subtract(3, 'month').startOf('day'), moment().endOf('day')),
        sivukoko('6kk', moment().subtract(6, 'month').startOf('day'), moment().endOf('day')),
        sivukoko('vuosi', moment().subtract(1, 'year').startOf('day'), moment().endOf('day')),
    ];

    export default {
        name: 'Paivat',
        components: {UusiRivi},
        props: {},
        computed: {
            computedPaivat() {
                const self = this;
                return _.chain(kaikkiAikavalit(self.local.sivukoko.alku, self.local.sivukoko.loppu, 'day'))
                    .map(paiva => {
                        const merkinnat = this.global.merkinnatPaivittain[paiva.alku.format('YYYY-MM-DD')];
                        return merkinnat ? merkinnat : {
                            date: paiva.alku.format('YYYY-MM-DD'),
                            paiva: paiva.alku,
                            merkinnat: []
                        }
                    })
                    .sortBy(['date', 'tuloaika'])
                    .value()
                    .reverse();
            },
            sivukoot () {
                const firstDay = _.get(this.global, 'merkinnat[0].paiva', moment().startOf('day'));
                const sivukoot = [ ...oletusSivukoot ];
                sivukoot.splice(4, 0, sivukoko('kaikki', firstDay, moment().endOf('day')))
                sivukoot.splice(4, 0,
                    ...kaikkiAikavalitTapahtumienValilla(this.global.merkinnat, 'year')
                        .map(aikavali => sivukoko(
                            aikavali.alku.format('YYYY'),
                            aikavali.alku,
                            moment().isBefore(aikavali.loppu) ? moment() : aikavali.loppu)));
                return sivukoot;
            }
        },
        methods: {
            tallenna(paiva) {
                paiva.merkinnat.forEach(merkinta => {
                    merkinta.tuloaika = formatTimeFromString(merkinta.tuloaika);
                    merkinta.lahtoaika = formatTimeFromString(merkinta.lahtoaika);
                    merkinta.lounaita = parseInt(merkinta.lounaita);
                    merkinta.kirjaus = parseFloat(merkinta.kirjaus);
                    merkinta.saving = true;
                    axios.put('/tunnit.data', merkinta).then(
                        () => {
                            merkinta.saving = undefined;
                            this.tyhjenna();
                            Tuntikirjanpito.laskeUudestaan();
                        }
                    )
                });
            },
            tyhjenna() {
                this.local.editId = undefined;
            },
            edit(tyoaika) {
                this.local.uusi = false;
                this.local.editId = tyoaika.date;
            },
            isEditing(paiva) {
                return this.local.editId === paiva.date;
            },
            isEditable(paiva) {
                return paiva.merkinnat && paiva.merkinnat.length > 0;
            },
            poista(merkintaId) {
                const merkinnat = this.global.merkinnat;
                if (confirm(`Delete row ${merkintaId} ??`)) {
                    axios.delete(`/tunnit.data?${merkintaId}`).then(
                        () => {
                            const idx = merkinnat.findIndex(m => m.id === merkintaId);
                            merkinnat.splice(idx, 1);
                            Tuntikirjanpito.laskeUudestaan();
                        }
                    )
                }
            },
            uusiRiviLisatty() {
                this.local.uusi = false;
                Tuntikirjanpito.laskeUudestaan();
            },
            laskeTyoaika(merkinta) {
                return aikavaliMinuutteina(merkinta.tuloaika, merkinta.lahtoaika, merkinta.lounaita, 0, '-');
            },
            tulinJust(merkinta) {
                merkinta.tuloaika = nyt();
            },
            tulinYsilt(merkinta) {
                merkinta.tuloaika = '09:00';
            },
            meenIhanKohta(merkinta) {
                merkinta.lahtoaika = nyt()
            },
            meenViidelta(merkinta) {
                merkinta.lahtoaika = '17:00';
            }
        },
        data() {
            const global = Tuntikirjanpito.get();
            const local = {
                editId: undefined,
                uusi: false
            };
            local.sivukoko = oletusSivukoot[0]
            return {global, local}
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    col.toiminnot {
        width: 45px;
    }

    th.toiminnot, td.toiminnot {
        padding: 1px 1px 1px 0;
    }

    label {
        display: inline-block;
        width: 100px;
        text-align: left;
        margin: 5px 0;
    }

    input[text] {
        text-align: left;
        margin: 5px 0;
        padding: 2px 15px;
        height: 15px;
    }

    button {
        height: 23px;
        color: grey;
        border: 1px solid lightgray;
        background-color: white;
        border-left: none;
        margin-left: 1px;
        padding: 3px;
    }

    button.submit, button.cancel {
        border: none;
        color: white;
        padding: 2px;
        margin-right: 2px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        width: 45px;
    }

    button.submit {
        background-color: #4CAF50;
    }

    button.cancel {
        background-color: lightgrey;
    }

    button.delete {
        color: #f44336;
        border: 1px solid #f44336;
        background-color: transparent;
        height: 19px;
        width: 19px;
        margin: 2px;
        padding: 0;
    }

    button.delete:hover {
        color: white;
        background-color: #f44336;
    }

    button.edit {
        border: 1px solid grey;
        width: 45px;
    }

    input.tuloaika, input.lahtoaika {
        width: 50px;
        padding: 2px 10px;
    }

    input.lounaita {
        width: 30px;
        padding: 2px 0 2px 10px;
    }

    input.kirjaus {
        width: 50px;
        padding: 2px 0 2px 10px;
    }

    table {
        border: 1px solid black;
        margin: 20px auto;
        border-collapse: collapse;
    }

    td {
        white-space: nowrap;
        padding: 3px 15px;
    }

    tr:nth-child(even) {
        background: #CCC
    }

    tr:nth-child(odd) {
        background: #FFF
    }

    th {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 10px 20px;
    }

    th.uusi {
        font-size: 30px;
        font-weight: bold;
        color: #4CAF50;
    }

    th.uusi:hover {
        color: white;
        background-color: #4CAF50;
    }

    .lomake td {
        white-space: nowrap;
    }

    .saldo {
        text-align: left;
        white-space: nowrap;
    }

    .kommentti {
        padding: 2px 5px 2px 10px;
        text-align: left;
        color: gray;
        padding-right: 20px;
    }

    td.kommentti, th.kommentti {
        border-left: 1px solid lightgrey;
    }

    input.kommentti {
        width: calc(100% - 30px);
    }

    .pvm {
        #text-align: left;
        padding: 3px;
    }

    .tuloJaLahtoajat {
        white-space: nowrap;
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

    .alert {
        color: red;
        font-weight: bold;
    }

    .kuukauden-eka-paiva {
        border-bottom: 1px solid black;
    }

    .vuoden-eka-paiva {
        border-bottom: 3px double black;
    }

</style>

