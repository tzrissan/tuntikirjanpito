<template>
  <div class="hello">
  <form>
    <label for="tuloaika">Tuloaika</label>
    <input type="text" id="tuloaika" v-model="tuloaika" /><br/>
    <label for="lahtoaika" v-if="tuloaika">Lähtöaika</label>
    <input type="text" id="lahtoaika" v-model="lahtoaika" v-if="tuloaika" /><br/>
    <input type="button" value="Tallenna" v-if="tuloaika && lahtoaika" v-on:click="tallenna"></input>
  </form>
  </div>
</template>

<script>



export default {
  name: 'Lomake',
  props: {

  },
  methods: {
    tallenna() {
      console.log("tallenna");
      console.log({tuloaika: this.tuloaika, lahtoaika: this.lahtoaika});
      this.tuloaika=undefined;
      this.lahtoaika=undefined;
    }
  },
  data() {
    return {
      tuloaika: undefined,
      lahtoaika: undefined
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
