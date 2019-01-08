<template>
    <div id="app">
        <h1>{{ today | moment("D.M.YYYY") }}</h1>
        <div class="tabs">
            <div class="tab clickable"><router-link to="/">Päivät</router-link>
            </div>
            <div class="tab clickable"><router-link to="/viikot">Viikot</router-link>
            </div>
            <div class="tab clickable"><router-link to="/saldot">Saldot</router-link>
            </div>
            <div class="tab clickable"><router-link to="/kellonajat">Kellonajat</router-link>
            </div>
        </div>
        <div class="tab-content">
            <router-view/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
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

    .tab a {
        color: black;
        text-decoration: none;
    }

    .router-link-exact-active {
        font-size: large;
        font-weight: bold;
    }


</style>
