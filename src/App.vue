<template>
    <div id="app">
        <Paivat/>
    </div>
</template>

<script>
    import Paivat from './components/Paivat.vue'

    export default {
        name: 'app',
        components: {
            Paivat
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
</style>
