// eslint-disable-next-line no-undef
const app = new Vue({
    el: '#app',
    data: {
        djName: 'Foobar',
        newSong: ['', ''],
        queue: [
            ['Get Lucky', 'Daft Punk'],
            ['Happy', 'Pharrell Williams'],
            ['Trumpets', 'Jason Derulo'],
            ['Teenage Dream', 'Katy Perry'],
            ['Party in the U.S.A.', 'Miley Cyrus'],
            ['Mr. Brightside', 'The Killers'],
        ]
    }
});

// eslint-disable-next-line no-unused-vars,no-undef
const Song = Vue.component('song', {
    props: ['title', 'artist'],
    template: '<div draggable="true" class="list-group-item">{{ title }} - {{ artist}}</div>',
});


//TODO Fix the problems that make this solution needed
//Really hacky way to get the queue to render
//With out this, now change in Queue means vue won't rerender the component
//Which for me, means nothing was visible.
//By removing and re-adding the last item, we get the queue to display
window.onload = function(){
    app.queue.push(app.queue.pop())
}