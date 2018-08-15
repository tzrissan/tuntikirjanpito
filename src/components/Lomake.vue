<template>
    <div class="hello">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>
        <form @submit="tallenna">
            <table>
                <thead>
                <tr class="lomake">
                    <td colspan="2">{{ id}}<input type="text" class="date" maxlength="10" v-model="date"/></td>
                    <td colspan="2">
                        <input type="text" class="tuloaika" maxlength="5" v-model="tuloaika"/>
                        <button v-on:click="tulinJust()">ny</button>
                        <button v-on:click="tulinYsilt()">9</button>
                        -
                        <input type="text" class="lahtoaika" maxlength="5" v-model="lahtoaika"/>
                        <button v-on:click="meenIhanKohta()">ny</button>
                        <button v-on:click="meenViidelta()">5</button>
                    </td>
                    <td><input type="number" class="lounaita" v-model="lounaita" min="0"/></td>
                    <td></td>
                    <td>
                        <input type="number" class="kirjaus" v-model="kirjaus" min="0.0" max="24" step="0.5"/>
                        <button v-on:click="normiTunnit()">7½</button>
                    </td>
                    <td colspan="2"><input class="kommentti" type="text" v-model="kommentti"/></td>
                    <td>
                        <button type="submit" v-if="tuloaika">&#x2713;</button>
                        <button type="reset" v-if="tuloaika" v-on:click="tyhjenna()">&#x2715;</button>
                    </td>
                </tr>
                <tr>
                    <th colspan="2">pvm</th>
                    <th>tuloaika - lähtöaika</th>
                    <th>lounas</th>
                    <th>työaika</th>
                    <th>kirjaus</th>
                    <th><small>todellisuus<br>- kirjaus</small></th>
                    <th><small>saldo<br>&Delta;</small></th>
                    <th>saldo</th>
                    <th>kommentti</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="t in laskevassaJarjestyksessa(tyoajat.merkinnat)" v-bind:key="t.id">
                    <td  class="pvm">
                        {{ t.date | moment("dd") }}
                    </td>
                    <td  class="pvm">
                        <input v-if="isEditing(t)" type="text" class="date" maxlength="10" v-model="date"/>
                        <span v-else>{{ t.date | moment("D.M.YYYY") }}</span>
                    </td>
                    <td  class="tuloJaLahtoajat">
                        <div v-if="isEditing(t)">
                            <div v-if="vainYksiMerkinta(t)">
                                <input type="text" class="tuloaika" maxlength="5" v-model="t.tuloaika"/>
                                -
                                <input type="text" class="lahtoaika" maxlength="5" v-model="t.lahtoaika"/>
                            </div>
                            <div v-else>it's complicated</div>
                        </div>
                        <div v-else>
                            <div v-if="vainYksiMerkinta(t)">{{ t.tuloaika }} - {{ t.lahtoaika }}</div>
                            <div v-else>
                                <span v-for="tl in t.tuloJaLahtoajat" v-bind:key="tl.tuloaika+tl.lahtoaika">{{ tl.tuloaika }} - {{ tl.lahtoaika }}<br></span>
                            </div>
                        </div>
                    </td>
                    <td >
                        <input v-if="isEditing(t)" type="number" class="lounaita" v-model="lounaita" min="0"/>
                        <span v-else>{{ t.lounaita }}</span>
                    </td>
                    <td >{{ tyoaika(t.tuloaika, t.lahtoaika, t.lounaita) }}</td>
                    <td >
                        <input v-if="isEditing(t)" type="number" class="kirjaus" v-model="kirjaus" min="0.0" max="24" step="0.5"/>
                        <span v-else-if="t.kirjaus">{{ t.kirjaus }} h</span>
                    </td>
                    <td ><small>{{ kirjausvirhe(t.tuloaika, t.lahtoaika, t.lounaita, t.kirjaus) }}</small></td>
                    <td ><small>{{ aikavali2UiStr(t.saldomuutos) }}</small></td>
                    <td  class="saldo">{{ aikavali2UiStr(t.saldo) }}</td>
                    <td  class="kommentti">{{ t.kommentti }}</td>
                    <td>
                        <div v-if="isEditing(t)">
                            <button type="submit" v-if="tuloaika">&#x2713;</button>
                            <button type="reset" v-if="tuloaika" v-on:click="tyhjenna()">&#x2715;</button>
                        </div>
                        <button class="edit "v-else v-on:click="edit(t)">EDIT</button>
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
    import {aikavaliMinuutteina, TIME_REGEX, DB_DATE_REGEX, UI_DATE_REGEX} from '../data.js';

    function nyt() {
        const now = new Date();
        let hour = now.getHours();
        const minute = now.getMinutes();
        let minuteRounded = Math.round(minute / 5) * 5;
        if (minuteRounded >= 60) {
            hour++;
            minuteRounded -= 60;
        }
        const hourFormatted = numeral(hour).format('00');
        const minuteRoundedAndFormatted = numeral(minuteRounded).format('00');
        return `${hourFormatted}:${minuteRoundedAndFormatted}`;
    }

    function formatTimeFromString(time) {
        if (!time || time.length ===0) {
            return undefined;
        } else {
            const hour = numeral(time.replace(TIME_REGEX, '$1')).format('00');
            const minute = numeral(time.replace(TIME_REGEX, '$2')).format('00');
            return `${hour}:${minute}`;
        }
    }

    function formatDbDateFromUiString(date) {
        const day = numeral(date.replace(UI_DATE_REGEX, '$1')).format('00');
        const month = numeral(date.replace(UI_DATE_REGEX, '$2')).format('00');
        const year = numeral(date.replace(UI_DATE_REGEX, '$3')).format('0000');
        return `${year}-${month}-${day}`;
    }


    function formatUiDateFromDbString(date) {
        const day = numeral(date.replace(DB_DATE_REGEX, '$3')).format('00');
        const month = numeral(date.replace(DB_DATE_REGEX, '$2')).format('00');
        const year = numeral(date.replace(DB_DATE_REGEX, '$1')).format('0000');
        return `${day}.${month}.${year}`;
    }

    function tanaan() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        return `${day}.${month}.${year}`;
    }

    export default {
        name: 'Lomake',
        props: {},
        methods: {
            tallenna(e) {
                e.preventDefault();
                if (this.id && this.tyoajat.merkinnat.find(t => t.id === this.id)) {
                    const update = this.tyoajat.merkinnat.find(t => t.id === this.id);
                    update.date = formatDbDateFromUiString(this.date);
                    update.tuloaika = formatTimeFromString(this.tuloaika);
                    update.lahtoaika = formatTimeFromString(this.lahtoaika);
                    update.lounaita = parseInt(this.lounaita);
                    update.kirjaus = parseFloat(this.kirjaus);
                    update.kommentti = this.kommentti;
                    const merkinnat = this.tyoajat.merkinnat;
                    axios.put('/tunnit.data', update)
                        .then(function () {
                            Tuntikirjanpito.laskeSaldot(merkinnat);
                        });
                } else {
                    const newLine = {
                        date: formatDbDateFromUiString(this.date),
                        tuloaika: formatTimeFromString(this.tuloaika),
                        lahtoaika: formatTimeFromString(this.lahtoaika),
                        lounaita: parseInt(this.lounaita),
                        kirjaus: parseFloat(this.kirjaus),
                        kommentti: this.kommentti
                    };
                    const merkinnat = this.tyoajat.merkinnat;
                    axios.post('/tunnit.data', newLine)
                        .then(function (response) {
                            newLine.id = response.data;
                            merkinnat.push(newLine);
                            Tuntikirjanpito.laskeSaldot(merkinnat);
                            this.edit(newLine);
                        });
                }
                //this.tyhjenna();
            },
            tyhjenna() {
                this.id = undefined;
                this.date = tanaan();
                this.tuloaika = undefined;
                this.lahtoaika = undefined;
                this.lounaita = 1;
                this.kirjaus = 7.5;
                this.kommentti = undefined;
            },
            laskevassaJarjestyksessa(rivit) {
                return _.sortBy(rivit, ['date', 'tuloaika']).reverse();
            },
            tulinJust() {
                this.tuloaika = nyt()
            },
            tulinYsilt() {
                this.tuloaika = '9:00';
            },
            meenIhanKohta() {
                this.lahtoaika = nyt()
            },
            meenViidelta() {
                this.lahtoaika = '17:00';
            },
            normiTunnit() {
                this.kirjaus = 7.5;
            },
            tyoaika(alku, loppu, lounaita) {
                if (!alku || !loppu) {
                    return undefined;
                } else {
                    return this.aikavali2UiStr(aikavaliMinuutteina(alku, loppu, lounaita));
                }
            },
            kirjausvirhe(alku, loppu, lounaita, kirjaus) {
                if (!alku || !loppu || !kirjaus) {
                    return undefined;
                } else {
                    return this.aikavali2UiStr(aikavaliMinuutteina(alku, loppu, lounaita) - (kirjaus*60));
                }
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
            edit(tyoaika) {
                console.log(tyoaika);
                if (!this.isEditing(tyoaika)) {

                    const selectedId = this.id;
                    const currentIndex = tyoaika.merkinnat.findIndex(e => e.id === selectedId);
                    const nextIndex = (currentIndex +1) % tyoaika.merkinnat.length;



                    console.log(tyoaika.merkinnat[0].id);
                    this.id = tyoaika.merkinnat[0].id;
                    this.date = formatUiDateFromDbString(tyoaika.merkinnat[0].date);
                    this.tuloaika = tyoaika.merkinnat[0].tuloaika;
                    this.lahtoaika = tyoaika.merkinnat[0].lahtoaika;
                    this.lounaita = tyoaika.merkinnat[0].lounaita;
                    this.kirjaus = tyoaika.merkinnat[0].kirjaus;
                    this.kommentti = tyoaika.merkinnat[0].kommentti;
                } else {
                    console.log('oli jo auki')
                }
            },
            isEditing(tyoaika) {
                const id = this.id;
                return tyoaika.merkinnat.findIndex(e => e.id === id) >= 0
            },
            vainYksiMerkinta(tyoaika) {
                return tyoaika.tuloJaLahtoajat.length === 1;
            }
        },
        data() {
            return {
                id: undefined,
                today: new Date(),
                date: tanaan(),
                tuloaika: undefined,
                lahtoaika: undefined,
                lounaita: 1,
                kirjaus: 7.5,
                kommentti: undefined,
                tyoajat: Tuntikirjanpito.get()
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

    button[type=submit], button[type=reset] {
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

    button[type=submit] {
        background-color: #4CAF50;
    }

    button[type=reset] {
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

    input.kommentti {
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

    .lomake td {
        white-space: nowrap;
    }

    .saldo {
        text-align: right;
    }

    .kommentti {
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

