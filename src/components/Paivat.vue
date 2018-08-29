<template>
    <div class="hello">
        <form>
            <table>
                <thead>
                <tr>
                    <th class="uusi" v-on:click="local.uusi = true; local.editId = undefined;">+</th>
                    <th colspan="2">pvm</th>
                    <th>tuloaika - lähtöaika</th>
                    <th>lounas</th>
                    <th>työaika</th>
                    <th>kirjaus</th>
                    <th><small>työaika<br>- kirjaus</small></th>
                    <th>saldo</th>
                    <th>kommentti</th>
                </tr>
                </thead>
                <tbody>
                <UusiRivi v-if="local.uusi" v-bind:done="() => local.uusi = false"></UusiRivi>
                <tr v-for="paiva in local.paivat" v-bind:key="paiva.date">
                    <td>
                        <div v-if="isEditing(paiva)">
                            <button type="button" class="submit" v-on:click="tallenna(paiva)">&#x2713;</button>
                            <button type="button" class="cancel" v-on:click="tyhjenna()">&#x2715;</button>
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
                            <template v-if="isEditing(paiva)">
                                <input type="text" class="tuloaika" minlength="3" maxlength="5" v-model="merkinta.tuloaika"/>
                                -
                                <input type="text" class="lahtoaika" minlength="3" maxlength="5" v-model="merkinta.lahtoaika"/>
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
                            <span v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">{{ merkinta.tyoaika | aikavali2UiStr }} <br></span>
                        </small>
                        <small v-else>{{ paiva.tyoaika | aikavali2UiStr }}</small>
                        </td>
                    <td>
                        <div v-if="isEditing(paiva)">
                            <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                                <input type="number" class="kirjaus" v-model="merkinta.kirjaus" min="0" step="0.5"/>
                            </div>
                        </div>
                        <span v-else>{{ paiva.kirjaus }} h</span>
                    </td>
                    <td class="kirjausvirhe">
                        <small v-if="isEditing(paiva)">
                            <span v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">({{ merkinta.kirjausvirhe | aikavali2UiStr }})<br></span>
                        </small>
                        <span v-else>{{ paiva.kirjausvirhe | aikavali2UiStr }} <small v-if="paiva.kirjausvirheenmuutos">({{ paiva.kirjausvirheenmuutos | aikavali2UiStr(true) }})</small></span>
                    </td>
                    <td class="saldo">
                        <span v-if="isEditing(paiva)"></span>
                        <span v-else>{{ paiva.saldo | numeral('0.0') }} h </span>
                        <small v-if="paiva.saldomuutos">({{ paiva.saldomuutos | numeral('+0.0') }} h)</small>
                    </td>
                    <td class="kommentti">
                        <div v-for="merkinta in paiva.merkinnat" v-bind:key="merkinta.id">
                            <input v-if="isEditing(paiva)" class="kommentti" type="text" v-model="merkinta.kommentti"/>
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

    import axios from 'axios';
    import Tuntikirjanpito from '../data.js';
    import UusiRivi from "./UusiRivi";
    import {formatTimeFromString} from '../date-time-util';
    import {yhdistaPaivat} from './paiva-util';

    export default {
        name: 'Paivat',
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
            tyhjenna() {
                this.local.editId = undefined;
            },
            edit(tyoaika) {
                this.local.uusi = false;
                this.local.editId = tyoaika.date;
            },
            isEditing(tyoaika) {
                return this.local.editId === tyoaika.date;
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
            }
        },
        data() {
            const global = Tuntikirjanpito.get();
            return {
                global,
                local: {
                    editId: undefined,
                    paivat: yhdistaPaivat(global.merkinnat),
                    uusi: false
                }
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
        padding: 2px 5px 2px 10px;
        text-align: left;
    }

    .pvm {
        #text-align: left;
        padding: 3px;
    }

    .tuloJaLahtoajat {
        white-space: nowrap;
    }

</style>

