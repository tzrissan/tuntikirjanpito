<template>
    <div id="app">
        <Lomake/>
    </div>
</template>

<script>
    import Lomake from './components/Lomake.vue'

    export default {
        name: 'app',
        components: {
            Lomake
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
