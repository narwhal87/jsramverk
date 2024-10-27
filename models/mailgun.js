const formData = require('form-data');
const Mailgun = require('mailgun.js');
// import Mailgun from 'mailgun.js';
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});
const frontURL = process.env.NODE_ENV === 'development' || undefined ? "http://localhost:3000" : "https://www.student.bth.se/~alpt22/editor/";
  
const mailginUtils = {
    mgShare: function mgShare(email) {
        mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
            to: [email],
            subject: "Hello",
            text: "Testing some Mailgun awesomeness!",
            html: `
                    <h1>Sign up at Challe P and Narwhal!</h1>
                    <a href="${frontURL}/register">Register here</a>
                    `
        })
        .then(msg => console.log(msg)) // logs response data
        .catch(err => console.log(err)); // logs any error
    }
}

module.exports = mailginUtils;