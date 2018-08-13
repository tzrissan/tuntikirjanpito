<template>
    <div class="hello">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>
        <form @submit="tallenna">
            <table>
                <thead>
                <tr class="lomake">
                    <td>{{ id }}</td>
                    <td><input type="text" id="date" maxlength="10" v-model="date"/></td>
                    <td colspan="3">
                        <input type="text" id="tuloaika" maxlength="5" v-model="tuloaika"/>
                        <input type="button" value="ny" v-on:click="tulinJust()"/>
                        <input type="button" value="9" v-on:click="tulinYsilt()"/>
                        -
                        <input type="text" id="lahtoaika" v-model="lahtoaika"/>
                        <input type="button" value="ny" v-on:click="meenIhanKohta()"/>
                        <input type="button" value="5" v-on:click="meenViidelta()"/>
                    </td>
                    <td><input type="number" id="lounaita" v-model="lounaita" min="0"/></td>
                    <td><input type="number" id="kirjaus" v-model="kirjaus" min="0.0" max="24" step="0.5"/></td>
                    <td colspan="3">
                        <input type="submit" value="Tallenna" v-if="tuloaika"/>
                        <input type="reset" value="Peruuta" v-if="id" v-on:click="tyhjenna()"/>
                    </td>
                </tr>
                <tr>
                    <th>id</th>
                    <th>pvm</th>
                    <th>tuloaika</th>
                    <th></th>
                    <th>lähtöaika</th>
                    <th>lounas</th>
                    <th>kirjaus</th>
                    <th>työaika</th>
                    <th>saldo</th>
                    <th>&Delta;</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="tyoaika in laskevassaJarjestyksessa(tyoajat.merkinnat)" v-bind:key="tyoaika.id"
                    v-on:click="edit(tyoaika)">
                    <td>{{ tyoaika.id }}</td>
                    <td>{{ tyoaika.date | moment("dd D.M.YYYY") }}</td>
                    <td>{{ tyoaika.tuloaika }}</td><td>-</td><td>{{ tyoaika.lahtoaika }}</td>
                    <td>{{ tyoaika.lounaita }}</td>
                    <td><span v-if="tyoaika.kirjaus">{{ tyoaika.kirjaus }} h</span></td>
                    <td>{{ aika(tyoaika.tuloaika, tyoaika.lahtoaika, tyoaika.lounaita) }}</td>
                    <td>{{ aikavali2UiStr(tyoaika.saldo) }}</td>
                    <td><small>{{ aikavali2UiStr(tyoaika.saldomuutos) }}</small></td>
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
                    update.lounaita = this.lounaita;
                    update.kirjaus = this.kirjaus;
                    axios.put('/tunnit.data', update)
                        .then(function () {
                            Tuntikirjanpito.laskeSaldot();
                        });
                } else {
                    const newLine = {
                        date: formatDbDateFromUiString(this.date),
                        tuloaika: formatTimeFromString(this.tuloaika),
                        lahtoaika: formatTimeFromString(this.lahtoaika),
                        lounaita: this.lounaita,
                        kirjaus: this.kirjaus
                    };
                    const merkinnat = this.tyoajat.merkinnat;
                    axios.post('/tunnit.data', newLine)
                        .then(function (response) {
                            newLine.id = response.data;
                            merkinnat.push(newLine);
                            Tuntikirjanpito.laskeSaldot();
                        });
                }
                this.tyhjenna();
            },
            tyhjenna() {
                this.id = undefined;
                this.date = tanaan();
                this.tuloaika = undefined;
                this.lahtoaika = undefined;
                this.lounaita = 1;
                this.kirjaus = 7.5;
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
            aika(alku, loppu, lounaita) {
                if (!alku || !loppu) {
                    return undefined;
                } else {
                    return this.aikavali2UiStr(aikavaliMinuutteina(alku, loppu, lounaita));
                }
            },
            saldo(alku, loppu, lounaita) {
                if (!alku || !loppu) {
                    return undefined;
                } else {
                    const aikavali = aikavaliMinuutteina(alku, loppu, lounaita);
                    const saldomuutos = aikavali - (7.5 * 60);
                    return this.aikavali2UiStr(saldomuutos, true);
                }
            },
            aikavali2UiStr(aikavaliMinuutteina, naytaPlusMerkki=false) {
                const sign = aikavaliMinuutteina < 0 ? '-' : (aikavaliMinuutteina > 0 && naytaPlusMerkki ? '+' : '');
                const minuutteja = Math.abs(aikavaliMinuutteina);
                const d = numeral(Math.trunc(minuutteja / (24*60))).format('0');
                const h = numeral(Math.trunc(minuutteja / 60)).format('0');
                const m = numeral(Math.trunc(minuutteja % 60)).format('00');
                const fullText = `${sign}${d}:${h}:${m}`;
                return fullText.replace(/0:0:(\d+)/, '$1 min').replace(/0:(\d+:\d+)/, '$1');
            },
            edit(tyoaika) {
                if (tyoaika.editing) {
                    tyoaika.editing = false;
                } else {
                    tyoaika.editing = true;
                    this.id = tyoaika.id;
                    this.date = formatUiDateFromDbString(tyoaika.date);
                    this.tuloaika = tyoaika.tuloaika;
                    this.lahtoaika = tyoaika.lahtoaika;
                    this.lounaita = tyoaika.lounaita;
                    this.kirjaus = tyoaika.kirjaus;
                }
            },
            isEditing(tyoaika) {
                return tyoaika.editing ? 'editing' : '';
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
    }

    input#date {
        width: 80px;
        padding: 2px 10px;
    }

    input#tuloaika, input#lahtoaika {
        width: 50px;
        padding: 2px 10px;
    }

    input#lounaita {
        width: 30px;
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

</style>

