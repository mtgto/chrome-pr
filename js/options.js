function restore_access_token() {
    var access_token = localStorage['access_token'];
    if (!access_token) {
        console.log('Fail to load access token from local storage.');
        $('#access_token_status').removeClass('alert-success').addClass('alert-danger');
        $('#access_token_status p:first').html("Your access token is not acquired.");
        $('#access_token_status a:first').html("Get your access token (move to GitHub)")
            .removeClass('disabled').removeClass('btn-default').removeClass('btn-danger').addClass('btn-primary');
        $('#access_token_status a:last').addClass('disabled').removeClass('btn-danger').addClass('btn-default');
    } else {
        console.log('Success to load access token from local storage.');
        $('#access_token_status').removeClass('alert-danger').addClass('alert-success');
        $('#access_token_status p:first').html("Your access token is successfully acquired.");
        $('#access_token_status a:last').removeClass('disabled').removeClass('btn-default').addClass('btn-danger');
    }
}
function revoke_access_token() {
    localStorage.removeItem('access_token');
    restore_access_token();
}
$(function() {
    var code = url('?code');
    if (!code) {
        restore_access_token();
    } else {
        $.post(
            'https://github.com/login/oauth/access_token',
            {
                'client_id': '949770e81d5fa1bdc905',
                'client_secret': 'cb8b1f151cef5ce6a8913c543946722c0711155b',
                'code': code
            },
            function(data, status) {
                console.log(data);
                var token = data['access_token'];
                var type = data['token_type'];
                if (token) {
                    localStorage['access_token'] = token;
                    restore_access_token();
                    window.location = 'options.html';
                } else {
                    var error = data['error'];
                    console.log('Error occurred while acquiring access token. code = ' + error);
                }
            },
            "json"
        );
    }
    $('#access_token_status a:last').click(function() {
        revoke_access_token();
    });
});
