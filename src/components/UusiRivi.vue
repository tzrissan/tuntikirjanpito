<template>
    <form @submit="tallennaUusi">
        <table>
            <tr class="lomake">
                <td>
                    <button type="submit" v-if="tuloaika">&#x2713;</button>
                    <button type="reset" v-if="tuloaika" v-on:click="tyhjenna()">&#x2715;</button>
                </td>
                <td colspan="2">{{ id }}<input type="text" class="date" maxlength="10" v-model="date"/></td>
                <td colspan="2">
                    <input type="text" class="tuloaika" maxlength="5" v-model="tuloaika"/>
                    <button v-on:click="tulinJust">ny</button>
                    <button v-on:click="tulinYsilt">9</button>
                    -
                    <input type="text" class="lahtoaika" maxlength="5" v-model="lahtoaika"/>
                    <button v-on:click="meenIhanKohta">ny</button>
                    <button v-on:click="meenViidelta">5</button>
                </td>
                <td><input type="number" class="lounaita" v-model="lounaita" min="0"/></td>
                <td></td>
                <td>
                    <input type="number" class="kirjaus" v-model="kirjaus" min="0.0" max="24" step="0.5"/>
                    <button v-on:click="normiTunnit()">7½</button>
                </td>
                <td colspan="3"><input class="kommentti" type="text" v-model="kommentti"/></td>
            </tr>
        </table>
    </form>
</template>

<script>

    import axios from 'axios';
    import Tuntikirjanpito from '../data.js';

    function tanaan() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        return `${day}.${month}.${year}`;
    }

    export default {
        name: "UusiRivi",
        methods: {
            tallennaUusi(e) {
                e.preventDefault();
                console.log("FIXME: TOTEUTA");

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
        }
    }
</script>

<style scoped>

</style>