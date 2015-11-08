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
    
    var username = prompt("What's your name?");
    var validName = true;
    if(username == "" || username == null) validName = false;

    while(!validName) {
        var username = prompt("Please enter a valid name.");
        if(username == "" || username == null) validName = false;
        else validName = true;
    }
    socket.emit('adduser', username);
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
$('#m').keypress(function(e){
    if(e.which==13) {
        if($('#m').val() == "") return false;
        console.log('calling sendchat with message: ' + $('#m').val());
        socket.emit('sendchat', $('#m').val());
        $('#m').val('');
    }
});
