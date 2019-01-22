<template>
    <tr>
        <td>
            <button type="button" class="submit" v-on:click="tallenna()">&#x2713;</button>
            <button type="button" class="cancel" v-on:click="tyhjenna()">&#x2715;</button>
        </td>
        <td colspan="2"><input type="text" class="date" maxlength="10" v-model="date"/></td>
        <td class="ajat">
            <input type="text" class="tuloaika" maxlength="5" v-model="tuloaika"/>
            <button type="button" v-on:click="tulinJust">ny</button>
            <button type="button" v-on:click="tulinYsilt">9</button>
            -
            <input type="text" class="lahtoaika" maxlength="5" v-model="lahtoaika"/>
            <button type="button" v-on:click="meenIhanKohta">ny</button>
            <button type="button" v-on:click="meenViidelta">5</button>
        </td>
        <td><input type="number" class="lounaita" v-model="lounaita" min="0"/></td>
        <td></td>
        <td class="kirjaus">
            <input type="number" class="kirjaus" v-model="kirjaus" min="0.0" max="24" step="0.5"/>
            <button type="button" v-on:click="normiTunnit()">7½</button>
        </td>
        <td colspan="3"></td>
        <td><input class="kommentti" type="text" v-model="kommentti"/></td>
    </tr>
</template>

<script>

    import axios from 'axios';
    import Tuntikirjanpito from '../data.js';
    import { formatTimeFromString, tanaan, nyt, formatDbDateFromUiString } from '../date-time-util';

    export default {
        name: "UusiRivi",
        props: {
            done: Function
        },
        methods: {
            tallenna() {
                const newLine = {
                    date: formatDbDateFromUiString(this.date),
                    tuloaika: formatTimeFromString(this.tuloaika),
                    lahtoaika: formatTimeFromString(this.lahtoaika),
                    lounaita: parseInt(this.lounaita),
                    kirjaus: parseFloat(this.kirjaus),
                    kommentti: this.kommentti
                };
                const doneFn = this.done;
                axios.post('/tunnit.data', newLine)
                    .then(function (response) {
                        newLine.id = response.data;
                        Tuntikirjanpito.get().merkinnat.push(newLine);
                        Tuntikirjanpito.laskeUudestaan();
                        doneFn();
                    })
            },
            tyhjenna() {
                this.done();
            },
            tulinJust(e) {
                e.preventDefault();
                this.tuloaika = nyt()
            },
            tulinYsilt(e) {
                e.preventDefault();
                this.tuloaika = '9:00';
            },
            meenIhanKohta(e) {
                e.preventDefault();
                this.lahtoaika = nyt()
            },
            meenViidelta(e) {
                e.preventDefault();
                this.lahtoaika = '17:00';
            },
            normiTunnit() {
                this.kirjaus = 7.5;
            }
        },
        data() {
            return {
                date: tanaan(),
                tuloaika: nyt(),
                lahtoaika: undefined,
                lounaita: 1,
                kirjaus: 7.5,
                kommentti: undefined
            }
        }
    }
</script>

<style scoped>

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

    .kommentti {
        padding: 2px 0 2px 10px;
        text-align: left;
        width: 90%;
    }

    td.ajat, td.kirjaus {
        white-space: nowrap;
    }


</style>