var nodemailer = require('nodemailer');
let account = require('./config/email_user');
//Class for sending e-mail
module.exports = class Mail{
  //constructor to instantiate Mail object
  constructor(user,pass){
    this.user = user;
    this.pass = pass;
    //transporter is used to send mail. Here we are creating the transporter object with its
    //settings
    this.transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:this.user,
        pass:this.pass
      }
    });
  }

  sendMail(recipientString,subject,contentHTML){
    //mailOptions sets the options for the e-mail we need to send. html prop can be
    //valid HTML, e.g h1 tags.
    const mailOptions = {
      from:this.user,
      to: recipientString,//'zarinsrt@gmail.com, windowpane1712@gmail.com',
      subject:subject,//'TEST',
      html:contentHTML//'<p> Test <p>'
    }

    //transporter.sendMail sends the mail.
    this.transporter.sendMail(mailOptions,function(err,info){
      if(err){
        console.log(err);
      }

      else{
        console.log(info);
      }
    });
  }
}

//const mail = new Mail(account.user,account.pass);
//mail.sendMail('windowpane1712@gmail.com','TEST2','<h1> Hi </h1>');
