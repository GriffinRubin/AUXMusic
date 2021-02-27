const queue = document.getElementById('queue');

new Sortable(queue, {
    animation: 150
    //On End calculate the new queue and apply the changes
});