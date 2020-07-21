var SISUCondition = [false, false]

const getCondition = () => {
    let returnVal = true;
    SISUCondition.forEach(e => {
        returnVal &= e;
    })
    return returnVal
}

const signInHtml = `<div class="mt-2 mb-2" id="s-i-cli-ui">
<p class="text-primary text-center" id="s-i-form-head-ui">Welcome back</p>
<div class="dropdown-divider border  bg-dark"></div>
<small class="text-danger" style="display:none" id="usern-alert">Your username required!</small>
<div class="input-group flex-nowrap">
    <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping">@</span>
    </div>
    <input type="text" onkeyup="UserChange(this)" id="si-username" class="form-control" placeholder="Email" aria-label="Username"
        aria-describedby="addon-wrapping">
</div>
<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
    else.</small>

<div class="dropdown-divider"></div>
<small class="text-danger" id="paw-alert" style="display:none">Your password must  at least 8 characters!</small>
<div class="input-group flex-nowrap">
    <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping"><i class="fas fa-key"></i></span>
    </div>
    <input type="password" onkeyup="PawChange(this)" id="si-password" class="form-control" placeholder="Password" aria-label="Password"
        aria-describedby="addon-wrapping">
</div>
<div class="mt-4 mb-3 align-middle pl-2" id="submit-oraction">
    <button type="submit" class="btn btn-primary" onClick=localSIAuth()>Submit</button>
    <span class="pl-1 pr-1">or use</span>
    <button type="submit" class="btn btn-danger" onClick=googleAuthRequest()>
        <span class="gg-icon border-right pr-3"><i class="fab fa-google"></i></span>
        <span class="gg-text pl-2" >Google Account</span></button>
</div>
<div class="d-flex" id="small-text-redirect">
<small class="mr-auto" ><span class="redirect-signin" id="renew-pw-ok" onClick=renewRender()>Forgot password ?</span></small>
<small class="ml-auto">You don't have account, 
    <span class="redirect-signin" id="redi-s-i-addr" onClick=SUFUNCTION()> Create one</span></small>
</div>
</div>`

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function UserChange(self) {
    if (self.value.length == 0) {
        document.getElementById('usern-alert').style.display = 'inline-block'
        document.getElementById('usern-alert').textContent = 'Username is mandatory!'
        SISUCondition[0] = false
    }
    else {
        if (validateEmail(self.value)) {
            SISUCondition[0] = true
            document.getElementById('usern-alert').style.display = 'none'
        }
        else{
            document.getElementById('usern-alert').style.display = 'inline-block'
            document.getElementById('usern-alert').textContent = 'Username must be an email!'
            SISUCondition[0] = false
        }
    }
}
function PawChange(self) {
    if (self.value.length <= 8) {
        document.getElementById('paw-alert').style.display = "inline-block"
        SISUCondition[1] = false
    }
    else {
        SISUCondition[1] = true
        document.getElementById('paw-alert').style.display = "none"
    }
}


function localSIAuth() {
    if (getCondition()) {
        $.ajax({
            type: "POST",
            url: "/auth/require-log-local-sign",
            data: {
                username: document.getElementById('si-username').value,
                password: document.getElementById('si-password').value,
            }
        }).done(res => {
            console.log(res)
            if (res) {
                window.location.replace('/home')
            }
            else {
                alert("Login failed")
            }
        })
    }
    else {
        if (!SISUCondition[0])
            document.getElementById('usern-alert').style.display = 'inline-block'
        if (!SISUCondition[1])
            document.getElementById('paw-alert').style.display = "inline-block"
    }
}


const signUpHtml = `<div class="mt-2 mb-2" id="s-u-cli-ui">
<p class="text-primary text-center" id="s-i-form-head-ui">Welcome back</p>
<div class="dropdown-divider border  bg-dark"></div>
<small class="text-danger" style="display:none" id="usern-alert">Your username required!</small>
<div class="input-group flex-nowrap">

    <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping">@</span>
    </div>
    <input type="text" id="su-username" onkeyup={UserChange(this)} class="form-control" placeholder="Email" aria-label="Username"
        aria-describedby="addon-wrapping" name="email" id="ip-user-evn">
</div>
<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
    else.</small>

<div class="dropdown-divider"></div>
<small class="text-danger" id="paw-alert" style="display:none">Your password must  at least 8 characters!</small>
<div class="input-group flex-nowrap">  
    <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping"><i class="fas fa-key"></i></span>
    </div>
    <input type="password" id="su-password" onkeyup={PWSUChange(this)} class="form-control" placeholder="Password" aria-label="Password"
        aria-describedby="addon-wrapping" name="password" id="ip-pass-evn">
</div>
<small class="text-danger" id="checking-pw-alert" style="display:none">Your password does not same!</small>
<div class="input-group flex-nowrap mt-2" id="ip-c-pas-contain">
    <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping"><i
                class="fas fa-check-double"></i></span>
    </div>
    <input type="password" id="su-password-c" onkeyup={PasswordSUCheckChange(this)}  class="form-control" placeholder="Check password" aria-label="Check"
        aria-describedby="addon-wrapping" id="ip-c-pass-evn">
</div>
<div class="mt-4 mb-3 align-middle pl-2" id="submit-oraction">
    <button type="submit" class="btn btn-primary" onClick=localSUAuth()>Submit</button>
    <span class="pl-1 pr-1">or use</span>
    <button type="submit" class="btn btn-danger" onClick=googleAuthRequest()>
        <span class="gg-icon border-right pr-3"><i class="fab fa-google"></i></span>
        <span class="gg-text pl-2">Google Account</span></button>
</div>
<div class="d-flex" id="small-text-redirect">
    <small class="mr-auto" ><span class="redirect-signin" id="renew-pw-ok" onClick=renewRender()>Forgot password ?</span></small>
    <small class="ml-auto">You already have an account, 
    <span class="redirect-signin" id="redi-s-i-addr" onClick=SIFUNCTION()>Sign in</span></small>
</div>
</div>`



function PWSUChange(self) {
    if (self.value.length <= 8) {
        document.getElementById('paw-alert').style.display = "inline-block";
    }
    else {
        document.getElementById('paw-alert').style.display = "none";
    }
}

function PasswordSUCheckChange(self) {
    let pwValue = document.getElementById('su-password').value;
    if (self.value === pwValue) {
        document.getElementById('checking-pw-alert').style.display = "none";
        SISUCondition[1] = true;
    }
    else {
        document.getElementById('checking-pw-alert').style.display = "inline-block";
        SISUCondition[1] = false;
    }
}

function localSUAuth() {
    if (getCondition()) {
        $.ajax({
            type: "POST",
            url: "/auth/require-log-local-sign-up",
            data: {
                username: document.getElementById('su-username').value,
                password: document.getElementById('su-password').value
            }
        }).done(res => {
            if (res) {
                initNotification(document.getElementById('su-username').value, document.getElementById('su-password').value)
                document.getElementById('usern-alert').style.display = "none";
            }
            else {
                document.getElementById('usern-alert').textContent = "Your username is already exist!";
                document.getElementById('usern-alert').style.display = "inline-block";
            }
        })
    }
    else {
        if (!SISUCondition[0])
            document.getElementById('usern-alert').style.display = "inline-block";
        if (!SISUCondition[1]) {
            document.getElementById('checking-pw-alert').style.display = "inline-block";
            if (document.getElementById('su-password').value.length == 0)
                document.getElementById('paw-alert').style.display = "inline-block";
        }
    }
}



function googleAuthRequest() {
    window.open("/auth/google", "MsgWindow", "width=450,height=600, top=40, left=500");
}


var C = [false, false]


$('#s-i-ui-control').click(e => {
    SIFUNCTION()
})
SIFUNCTION = () => {
    if (!C[0]) {
        $('#auth-frame-cont').html(signInHtml)
        C[1] = false
    }
    else {
        $('#auth-frame-cont').html(``)
    }
    C[0] = !C[0]
}

$('#s-u-ui-control').click(e => {
    SUFUNCTION()
})

SUFUNCTION = () => {
    if (!C[1]) {
        $('#auth-frame-cont').html(signUpHtml)
        C[0] = false
    }
    else {
        $('#auth-frame-cont').html(``)
    }
    C[1] = !C[1]
}


function initNotification(username, password) {
    let NotificationHtml = `
    <div id="elementToast" class="toast" style="position: absolute; top: 0; right: 0; min-width:300px">
    <div class="toast-header">
        <strong class="mr-auto">Notification</strong>
        <small>just now</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="toast-body">
    Your account has been signed up:<br>
    <label for="submit" class="btn btn-success">Click here</label> to sign in.
    <form action="/auth/require-log-local-sign" method="GET" style="display:none">
                <input type="text" name="username" value="${username}">
                <input type="password" name="password" value="${password}">
                <button id="submit"></button>
            </form>
    </div>
    </div>
    `
    $("body").append(NotificationHtml)
    $('#elementToast').toast({ autohide: false })
    $('#elementToast').toast('show')
}

function renewRender() {
    document.getElementById('auth-frame-cont').innerHTML = renewHtml
}


const renewHtml = `<div class="mt-2 mb-2" id="s-i-cli-ui">
<p class="text-primary text-center" id="s-i-form-head-ui">Renew password</p>
<div class="dropdown-divider border  bg-dark"></div>
<small class="text-danger" style="display:none" id="usern-alert">Your username is not in our system!</small>
<div id="showing-renew-2-client" class="input-group flex-nowrap">
    <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping">@</span>
    </div>
    <input type="text" onkeyup="hideAlert()" id="si-email-renew" class="form-control" placeholder="Email" aria-label="Username"
        aria-describedby="addon-wrapping">
</div>
<div class="mt-4 mb-3 align-middle pl-2" id="submit-oraction">
    <button type="submit" class="btn btn-primary" onClick=renewPwNow()>Confirm</button>
</div>

</div>`

function hideAlert() {
    document.getElementById('usern-alert').style.display = "none";
}

function renewPwNow() {
    $.ajax({
        type: "POST",
        data: { mail: document.getElementById('si-email-renew').value },
        url: '/cli/check-exist-email'
    }).done(res => {
        if (!res) {
            document.getElementById('usern-alert').style.display = 'inline-block';
        }
        else {
            $.ajax({
                type: "POST",
                data: { email: document.getElementById('si-email-renew').value },
                url: '/adm/send-mail-renew-password'
            })
            document.getElementById('usern-alert').style.display = 'none';
            document.getElementById('s-i-cli-ui').innerHTML = `
            We have been sent to your email, please check!
            `
        }
    })
}
