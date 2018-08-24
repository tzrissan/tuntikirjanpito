<template>
    <div class="hello">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>

        <h3 v-if="uusi">uuusi</h3>
        <form>
            <table>
                <thead>
                <tr>
                    <th class="uusi" v-on:click="uusi = true; editId = undefined;">+</th>
                    <th colspan="2">pvm</th>
                    <th>tuloaika - lähtöaika</th>
                    <th>lounas</th>
                    <th>työaika</th>
                    <th>kirjaus</th>
                    <th><small>todellisuus<br>- kirjaus</small></th>
                    <th>saldo</th>
                    <th>kommentti</th>
                </tr>
                </thead>
                <tbody>
                <UusiRivi v-if="uusi" v-bind:done="() => uusi = false"></UusiRivi>
                <tr v-for="paiva in laskevassaJarjestyksessa(tyoajat.paivat)" v-bind:key="paiva.date">
                    <td>
                        <div v-if="isEditing(paiva)">
                            <button type="button" class="submit" v-on:click="tallenna(paiva)">&#x2713;</button>
                            <button type="button" class="cancel" v-on:click="tyhjenna()">&#x2715;</button>
                            <button type="button" class="delete" v-on:click="tyhjenna()">&#x1F5D1;</button>
                        </div>
                        <button v-else type="button" class="edit" v-on:click="edit(paiva)">EDIT</button>
                    </td>
                    <td  class="pvm">
                        {{ paiva.date | moment("dd") }}
                    </td>
                    <td  class="pvm">
                        {{ paiva.date | moment("D.M.YYYY") }}
                    </td>
                    <td  class="tuloJaLahtoajat">
                        <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                            <span v-if="isEditing(paiva)">
                                <input type="text" class="tuloaika" minlength="3" maxlength="5" v-model="merkinta.tuloaika"/>
                                -
                                <input type="text" class="lahtoaika" minlength="3" maxlength="5" v-model="merkinta.lahtoaika"/>
                            </span>
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
                            <span v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">{{ aikavali2UiStr(merkinta.tyoaika) }} <br></span>
                        </small>
                        <small v-else>{{ aikavali2UiStr(paiva.tyoaika) }}</small>
                        </td>
                    <td>
                        <div v-if="isEditing(paiva)">
                            <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                                <input type="number" class="kirjaus" v-model="merkinta.kirjaus" min="0" step="0.25"/>
                            </div>
                        </div>
                        <span v-else>{{ paiva.kirjaus }} h</span>
                    </td>
                    <td class="kirjausvirhe">
                        <small v-if="isEditing(paiva)">
                            <span v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">({{ aikavali2UiStr(merkinta.kirjausvirhe) }})<br></span>
                        </small>
                        <span v-else>{{ aikavali2UiStr(paiva.kirjausvirhe) }} <small v-if="paiva.kirjausvirheenmuutos">({{ aikavali2UiStr(paiva.kirjausvirheenmuutos) }})</small></span>
                    </td>
                    <td class="saldo">
                        <span v-if="isEditing(paiva)"></span>
                        <span v-else>{{ aikavali2UiStr(paiva.saldo) }}</span>
                        <small v-if="paiva.saldomuutos">({{ aikavali2UiStr(paiva.saldomuutos) }})</small>
                    </td>
                    <td class="kommentti">
                        <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                            <input v-if="isEditing(paiva)" class="kommentti" type="text" v-model="merkinta.kommentti" min="0" step="0.25"/>
                            <span v-else>{{ merkinta.kommentti }}</span>
                        </div>

                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>
</template>

<script>

    import _ from 'lodash';
    import numeral from 'numeral';
    import axios from 'axios';
    import Tuntikirjanpito from '../data.js';
    import UusiRivi from "./UusiRivi";
    import { formatTimeFromString } from '../date-time-util';

    export default {
        name: 'Lomake',
        components: {UusiRivi},
        props: {},
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
            laskevassaJarjestyksessa(rivit) {
                return _.sortBy(rivit, ['date', 'tuloaika']).reverse();
            },
            aikavali2UiStr(aikavaliMinuutteina, naytaPlusMerkki=false) {
                const sign = aikavaliMinuutteina < 0 ? '-' : (aikavaliMinuutteina > 0 && naytaPlusMerkki ? '+' : '');
                const minuutteja = Math.abs(aikavaliMinuutteina);
                const d = numeral(Math.trunc(minuutteja / (24 * 60))).format('0');
                const h = numeral(Math.trunc(minuutteja / 60) - (d * 24)).format('00');
                const m = numeral(Math.trunc(minuutteja % 60)).format('00');
                const fullText = `${sign}${d}:${h}:${m}`;
                return fullText.replace(/^(-?)0:0?([1-9]?[0-9]:)/, '$1$2').replace(/^0:00$/, '-');
            },
            tyhjenna() {
                this.editId = undefined;
            },
            edit(tyoaika) {
                this.uusi = false;
                this.editId = tyoaika.date;
            },
            isEditing(tyoaika) {
                return this.editId === tyoaika.date;
            }
        },
        data() {
            return {
                editId: undefined,
                tyoajat: Tuntikirjanpito.get(),
                today: new Date(),
                uusi: false
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

    button.submit, button.cancel, button.delete {
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
        background-color: white;
    }

    button.delete:hover {
        color: white;
        background-color: #f44336;
    }

    button.edit {
        border: 1px solid grey;
        width: 45px;
    }

    input.date {
        width: 80px;
        padding: 2px 10px;
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
        text-align: right;
    }

    .kommentti {
        padding: 2px 0 2px 10px;
        text-align: left;
        width: 90%;
    }

    .pvm {
        #text-align: left;
        padding: 3px;
    }

    .tuloJaLahtoajat {
        white-space: nowrap;
    }

</style>

