<template>
  <div id='app'>
  </div>
</template>

<script>
import Song from './components/Song.vue';
import uniqueId from 'lodash.uniqueid'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Song
  },
  data () {
    return {
      Songs : [
        {id: uniqueId('song-'), player: 'spotify', uri: 'spotify:track:39lSeqnyjZJejRuaREfyLL'},
        {id: uniqueId('song-'), player: 'spotify', uri: 'spotify:track:3yfqSUWxFvZELEM4PmlwIR'},
        {id: uniqueId('song-'), player: 'apple', uri: '1025210938'}
      ]
    }
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #b2b9b3;
  margin-top: 60px;
}
</style>
