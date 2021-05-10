<template>
  <div>
  </div>
</template>

<script>
//import uniqueId from 'lodash.uniqueid';

export default {
  name: 'Song',
  props: {
    player: {required: true, type: String },
    uri: {required: true, type: String },
  },
  data () {
    return {
      myplayer: this.player,
      myuri: this.uri,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #b2b9b3;
}
</style>
