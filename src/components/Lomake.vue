<template>
    <div class="hello">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>
        <form @submit="tallenna">
            <table>
                <thead>
                <tr class="lomake">
                    <td>{{ id }}</td>
                    <td><input type="text" id="date" maxlength="10" v-model="date"/></td>
                    <td>
                        <input type="text" id="tuloaika" maxlength="5" v-model="tuloaika"/>
                        <input type="button" value="< ny" v-on:click="tulinJust()"/>
                        <input type="button" value="< 9:00" v-on:click="tulinYsilt()"/>
                        -
                        <input type="text" id="lahtoaika" v-model="lahtoaika"/>
                        <input type="button" value="< ny" v-on:click="meenIhanKohta()"/>
                        <input type="button" value="< 17:00" v-on:click="meenViidelta()"/>
                    </td>
                    <td><input type="number" id="lounaita" v-model="lounaita" min="0"/></td>
                    <td>
                        <input type="submit" value="Tallenna" v-if="tuloaika"/>
                        <input type="reset" value="Peruuta" v-if="id" v-on:click="tyhjenna()"/>
                    </td>
                </tr>
                <tr>
                    <th>id</th>
                    <th>pvm</th>
                    <th>tulo- ja lähtöajat</th>
                    <th>lounas</th>
                    <th>työaika</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="tyoaika in laskevassaJarjestyksessa(tyoajat.merkinnat)" v-bind:key="tyoaika.id"
                    v-on:click="edit(tyoaika)">
                    <td>{{ tyoaika.id }}</td>
                    <td>{{ tyoaika.date | moment("D.M.YYYY") }}</td>
                    <td>{{ tyoaika.tuloaika }} - {{ tyoaika.lahtoaika }}</td>
                    <td>{{ tyoaika.lounaita }}</td>
                    <td>{{ aika(tyoaika.tuloaika, tyoaika.lahtoaika) }}</td>
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

    const TIME_REGEX = /(\d\d?).(\d\d?)/;
    const UI_DATE_REGEX = /(\d\d?).(\d\d?).(\d{4})/;
    const DB_DATE_REGEX = /(\d{4}).(\d{2}).(\d{2})/;

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
        const hour = numeral(time.replace(TIME_REGEX, '$1')).format('00');
        const minute = numeral(time.replace(TIME_REGEX, '$2')).format('00');
        return `${hour}:${minute}`;
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

    function aikavaliMinuutteina(alku, loppu) {
        if (!alku || !loppu) {
            return "-";
        }
        const alkuH = parseInt(alku.replace(TIME_REGEX, '$1'));
        const alkuM = parseInt(alku.replace(TIME_REGEX, '$2'));
        const loppuH = parseInt(loppu.replace(TIME_REGEX, '$1'));
        const loppuM = parseInt(loppu.replace(TIME_REGEX, '$2'));
        return (loppuH - alkuH) * 60 + (loppuM - alkuM);
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
                    axios.put('/tunnit.data', update)
                        .then(function (response) {
                            //NOOP
                        });
                } else {
                    const newLine = {
                        date: formatDbDateFromUiString(this.date),
                        tuloaika: formatTimeFromString(this.tuloaika),
                        lahtoaika: formatTimeFromString(this.lahtoaika),
                        lounaita: this.lounaita
                    };
                    const merkinnat = this.tyoajat.merkinnat;
                    axios.post('/tunnit.data', newLine)
                        .then(function (response) {
                            newLine.id = response.data[0].id;
                            merkinnat.push(newLine);
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
            },
            laskevassaJarjestyksessa(rivit) {
                return _.sortBy(rivit, 'date').reverse();
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
            aika(alku, loppu) {
                const aikavali = aikavaliMinuutteina(alku, loppu);
                const h = Math.trunc(aikavali / 60);
                const m = numeral(Math.trunc(aikavali % 60)).format('00');
                return `${h}:${m}`;
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

