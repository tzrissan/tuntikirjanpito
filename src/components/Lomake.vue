<template>
    <div class="hello">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>
        <form>
            <label for="tuloaika">Tuloaika</label>
            <input type="text" id="tuloaika" v-model="tuloaika"/><br/>
            <label for="lahtoaika" v-if="tuloaika">Lähtöaika</label>
            <input type="text" id="lahtoaika" v-model="lahtoaika" v-if="tuloaika"/><br/>
            <input type="button" value="Tallenna" v-if="tuloaika || lahtoaika" v-on:click="tallenna" />
        </form>
        <table>
            <tbody>
            <tr v-for="tyoaika in tyoajat" v-bind:key="tyoaika.id">
                <td>{{ tyoaika.id }}</td>
                <td>{{ tyoaika.tuloaika }}</td>
                <td>{{ tyoaika.lahtoaika }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import Tuntikirjanpito from '../data.js';

    export default {
        name: 'Lomake',
        props: {},
        methods: {
            tallenna() {
                this.tyoajat.push({
                    id: Math.floor(Math.random() * 1000000),
                    tuloaika: this.tuloaika,
                    lahtoaika: this.lahtoaika
                });
                this.tuloaika = undefined;
                this.lahtoaika = undefined;
            }
        },
        data() {
            return {
                today: new Date(),
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
        width: 200px;
        text-align: left;
        margin: 5px 0;
        padding: 2px 15px;
    }
</style>
