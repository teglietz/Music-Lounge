//Global variables
var loginPage = true;

$(document).ready(function () {
    //Initial render
    render('/home');
});

function render(path) {
    $.ajax({
        type: 'GET', url: path
    }).then(d => {
        $('#content').html(d);
        discoverMusic();
    });
}

function renderAuth(path) {
    $.ajax({
        type: 'GET', url: path
    }).then(d => {
        console.log(d);
        $('#content').html(d);
    });
}

function renderArtist(path) {
    $.ajax({
        type: 'GET', url: path
    }).then(d => {
        $('#content').html(d[0]);
		$('#name').html(d[1]);
		$('#personalInformation').html(d[2]);
		$('#following').html(d[3]);
		$('#followers').html(d[4]);
		
		 var list = '<table class=\'ui selectable table\'>';
        list += '<thead><tr><th>Song Title</th><th> Artist </th>';
        list += '<th class=\'right aligned\'></th></tr><tbody>';

        d[5].forEach(x => {
            var song = x;
            var id = song;

            list += '<tr>';
            list += '<td>' + song + '</td>';
            list += '<td>' + d[1] + '</td>';
            list += '<td class=\'right aligned\'>';
            list += '<div class=\'ui vertical labeled icon buttons\'>'
            list += '<button class=\'ui orange button\' onclick=\'playMusic(' + id + ')\'><i class="play icon"></i>';
            list += 'Play </button></div</td></tr>';

        });

        list += '</table>';

        $('#songList').html(list);
    });
}

function home() {
    render('/home');
}

function profile() {
	renderArtist('/getProfilePage');
}

function discoverMusic() {
    $.ajax({
        type: 'GET',
        url: '\discoverMusic'
    }).then(data => {

        var list = '<table class=\'ui selectable table\'>';
        list += '<thead><tr><th>Song Title</th><th> Artist </th>';
        list += '<th class=\'right aligned\'></th></tr><tbody>';

        data.forEach(d => {
            var user = Object.keys(d)[0];
            var song = d[user];
            var id = song[song.length - 1];
            song = song.slice(0, song.length - 1);

            list += '<tr>';
            list += '<td>' + song + '</td>';
            list += '<td>' + user + '</td>';
            list += '<td class=\'right aligned\'>';
            list += '<div class=\'ui vertical labeled icon buttons\'>'
            list += '<button class=\'ui orange button\' onclick=\'playMusic(' + id + ')\'><i class="play icon"></i>';
            list += 'Play </button></div</td></tr>';

        });

        list += '</table>';

        $('#songList').html(list);
        //document.getElementById("songList").innerHTML = list;
    });
}

function authPage() {
    if (loginPage)
        renderAuth('/login');
    else
        renderAuth('/register')
}

function switchAuth() {

    loginPage = !loginPage;
    authPage();
}

function login() {

    var username = $('#username').val();
    var password = hash($('#password').val());

    input = { username: username, password: password };

    $.ajax({
        type: 'POST', url: '/login', data: input
    }).then(d => {
        //if successful d = true else false
        if (d)
            render('/home');
        else
            alert('Invalid username or passwor');
    });

}

function register() {
    var username = $('#username').val();
    var password = hash($('#password').val());

    input = { username: username, password: password };

    $.ajax({
        type: 'POST', url: '/register', data: input
    }).then(d => {

        if (d.code == 'ER_DUP_ENTRY')
            alert('Username already exists, please enter a different username.');
        else if (d) {
            alert('User successfully registered');
            loginPage = true;
            render('/login');
        }
        else
            alert('Oops.. something went wrong!');
    });

}

function logout() {

    $.ajax({ type: 'GET', url: '/logout' }).then(d => {
        if (d == 'success')
            render('/home');
        else
            alert('Oops.. something went wrong!');
    });

}

function uploadMusic() {
    render('/uploadMusic');
}

function upload() {
    $('#musicForm').submit();
}

function playMusic(q) {

    $.ajax({
        type: 'GET', url: '/getSongById?id=' + q
    }).then(d => {
        var player = "<audio controls autoplay id=player><source type=audio/mpeg";
        player += " src=\'" + d + "\'> Not Supported... </audio>";
        $('#nowPlaying').html(player);
    });
}

function getArtistPage(q) {
	render('/getArtistPage?artist=' + q);
}