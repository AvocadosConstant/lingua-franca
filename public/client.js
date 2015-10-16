var socket = io();
var chatTitles = [
    'Chat a Little',
    'Charlar un Poquito',
    'Discuter un Peu',
    'Chat ein Wenig',
    'Chattare un Po'
]

//On connect
socket.on('connect', function(){
    $('#chat-title').text(chatTitles[Math.floor(Math.random() * (5))]);
    socket.emit('adduser', prompt("What's your name?"));
});

//Appends messages to chat
socket.on('updatechat', function (username, data) {
    if(username.localeCompare('SERVER') == 0) {
        $('#messages').append('<li class="server-message"><b>'+username + ':</b> ' + data + '<br></li>');
    }
    else {
        $('#messages').append('<li><b>'+username + ':</b> ' + data + '<br></li>');
    }
    updateScroll();
});

//Scrolls to bottom of chat when new messages added
function updateScroll() {
    var height = $('#messages').prop('scrollHeight');
    $('#messages').scrollTop(height);
}

//Fills Users with current users
socket.on('updateusers', function(data) {
    $('#users').empty();
    $.each(data, function(key, value) {
        $('#users').append('<li>' + key + '</li>');
    });
});

//When message is sent
$('#m').submit(function(){
    socket.emit('sendchat', $('#m').val());
    $('#m').val('');
    return false;
});