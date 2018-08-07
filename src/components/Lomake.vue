<template>
    <div class="hello">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>
        <form @submit="tallenna">
            <label for="date">Päivä</label>
            <input type="text" id="date" v-model="date"/><br/>

            <label for="tuloaika" >Tuloaika</label>
            <input type="text" id="tuloaika" v-model="tuloaika"/>
            <input type="button" class="now" value="< now" v-on:click="tulinJust()" /><br/>

            <label for="lahtoaika" v-if="tuloaika">Lähtöaika</label>
            <input type="text" id="lahtoaika" v-model="lahtoaika" v-if="tuloaika"/>
            <input type="button" class="now" value="< now"  v-if="tuloaika" v-on:click="meenIhanKohta()" /><br/>

            <input type="submit" value="Tallenna" v-if="tuloaika && lahtoaika" />
        </form>
        <table>
            <tbody>
            <tr v-for="tyoaika in laskevassaJarjestyksessa(tyoajat)" v-bind:key="tyoaika.id">
                <td>{{ tyoaika.date | moment("D.M.YYYY") }}</td>
                <td>{{ tyoaika.tuloaika }} - {{ tyoaika.lahtoaika }}</td>
                <td>{{ tyoaika.lounaat }}</td>
                <td>{{ aika(tyoaika.tuloaika, tyoaika.lahtoaika) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import _ from 'lodash';
    import numeral from 'numeral';
    import Tuntikirjanpito from '../data.js';

    const TIME_REGEX = /(\d\d?).(\d\d?)/;
    const UI_DATE_REGEX = /(\d\d?).(\d\d?).(\d{4})/;

    function nyt() {
        const now = new Date();
        let hour = now.getHours();
        const minute = now.getMinutes();
        let minuteRounded = Math.round(minute/5)*5;
        if (minuteRounded >= 60) {
            hour++;
            minuteRounded-=60;
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

    function tanaan() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function aikavaliMinuutteina(alku, loppu) {
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
                this.tyoajat.push({
                    id: Math.floor(Math.random() * 1000000),
                    date: formatDbDateFromUiString(this.date),
                    tuloaika: formatTimeFromString(this.tuloaika),
                    lahtoaika: formatTimeFromString(this.lahtoaika),
                    lounaat: 1
                });
                this.date = tanaan();
                this.tuloaika = undefined;
                this.lahtoaika = undefined;
                e.preventDefault();
            },
            laskevassaJarjestyksessa(rivit) {
                return _.sortBy(rivit, 'date').reverse();
            },
            tulinJust() {
                this.tuloaika = nyt()
            },
            meenIhanKohta() {
                this.lahtoaika = nyt()
            },
            aika(alku, loppu) {
                const aikavali = aikavaliMinuutteina(alku, loppu);
                const h = Math.trunc(aikavali / 60);
                const m = numeral(Math.trunc(aikavali % 60)).format('00');
                return `${h}:${m}`;
            }
        },
        data() {
            return {
                today: new Date(),
                date: tanaan(),
                tuloaika: undefined,
                lahtoaika: undefined,
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

    input {
        width: 150px;
        text-align: left;
        margin: 5px 0;
        padding: 2px 15px;
    }

    input.now {
        width: initial;
        padding: 2px 5px;
    }


    table {
        border: 1px solid black;
        width: 100%;
        border-collapse: collapse;
    }

    td {
        padding: 3px 15px;
    }

    tr:nth-child(even) {background: #CCC}
    tr:nth-child(odd) {background: #FFF}

</style>
