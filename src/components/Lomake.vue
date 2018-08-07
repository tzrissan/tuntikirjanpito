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
                <td>{{ tyoaika.id }}</td>
                <td>{{ tyoaika.date | moment("D.M.YYYY") }}</td>
                <td>{{ tyoaika.tuloaika }}</td>
                <td>{{ tyoaika.lahtoaika }}</td>
                <td>{{ tyoaika.lounaat }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import _ from 'lodash';
    import numeral from 'numeral';
    import Tuntikirjanpito from '../data.js';

    function nyt() {
        const now = new Date();
        const hour = parseInt(now.toISOString().replace(/.*T(\d\d):.*/, '$1'));
        const minute = parseInt(now.toISOString().replace(/.*T\d\d:(\d\d).*/, '$1'));
        const hourFormatted = numeral(hour).format('00');
        const minuteRoundedAndFormatted = numeral(Math.round(minute/5)*5).format('00');
        return `${hourFormatted}:${minuteRoundedAndFormatted}`;
    }

    export default {
        name: 'Lomake',
        props: {},
        methods: {
            tallenna(e) {
                this.tyoajat.push({
                    id: Math.floor(Math.random() * 1000000),
                    date: this.date.replace(/(\d{1,2})\.(\d{1,2})\.(\d{4})/, '$3-$2-$1'),
                    tuloaika: this.tuloaika,
                    lahtoaika: this.lahtoaika,
                    lounaat: 1
                });
                this.date = new Date().toISOString().replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$3.$2.$1');
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
        },
        data() {
            return {
                today: new Date(),
                date: new Date().toISOString().replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$3.$2.$1'),
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
</style>
