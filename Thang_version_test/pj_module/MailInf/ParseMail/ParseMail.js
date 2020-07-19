const Domain = require('../../Config/DomainRoute')
exports.RenewMail = function(recieveMail, output){
    let linkHref = Domain.local+'/cli/renew-password-decrypt/' + output;
    return {
        from: 'Azbot-IotSystem',
        to: recieveMail,
        subject: "Renew password",
        html: `
        <h1>Mail to response which your have been required</h1>
        <h4>Please click that link to renew your password </h4>
        <a href="${linkHref}">${linkHref}</a>
        <p style="color:red">This link will be expired in 5 minutes</p>
        `
    }
}