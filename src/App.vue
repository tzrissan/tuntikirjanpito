<template>
    <div id="app">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>
        <div class="tabs">
            <div class="tab clickable"
                 v-bind:class="{ active: selectedTab === 'Päivät'}"
                 @click="selectedTab='Päivät'">Päivät
            </div>
            <div class="tab clickable"
                 v-bind:class="{ active: selectedTab === 'Viikot'}"
                 @click="selectedTab='Viikot'">Viikot
            </div>
            <div class="tab clickable"
                 v-bind:class="{ active: selectedTab === 'Käppyrät'}"
                 @click="selectedTab='Käppyrät'">Käppyrät
            </div>
        </div>
        <div class="tab-content">
            <Paivat v-if="selectedTab==='Päivät'"/>
            <Viikot v-if="selectedTab==='Viikot'"/>
            <Kappyrat v-if="selectedTab==='Käppyrät'"/>
        </div>
    </div>
</template>

<script>
    import Paivat from './components/Paivat.vue'
    import Viikot from './components/Viikot.vue'
    import Kappyrat from './components/Kappyrat.vue'

    export default {
        name: 'app',
        components: {
            Paivat, Viikot, Kappyrat
        },
        data() {
            return {
                today: new Date(),
                selectedTab: 'Päivät'
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .clickable {
        cursor: pointer;
    }
</style>

<style scoped>

    div.tabs .tab {
        display: inline;
        border: none;
        border-right: 1px solid black;
        padding: 10px 20px;
        margin: 0;
        vertical-align: center;
        text-align: center;
        background-color: white;
    }

    div.tabs .tab:last-child {
        border-right: none;
    }

    .active {
        font-size: large;
        font-weight: bold;
    }



</style>
