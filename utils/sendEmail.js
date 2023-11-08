var nodemailer = require("nodemailer");
const resetPasswordModel = require("../model/resetPasswordModel");

const sendEmail = async (email) => {
  var otp = 1111;
  //var otp = Math.floor(Math.random() * 10000);

  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "dbd7cd2a180dd0",
      pass: "c08b0377fca199",
    },
  });

  // var transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "hkhan7017@@gmail.com",
  //     pass: "ybgycemeqpjjgkge",
  //   },
  // });

  var mailOptions = {
    from: "AppinSnap",
    to: email,
    subject: "AppinSnap Reset Password",
    text: "Your OTP for resetting password is " + otp,
  };
  result = await transporter.sendMail(mailOptions);
  //If email is sent
  if (result) {
    var reset = new resetPasswordModel({
      email,
      otp,
    });
    await reset.save();
    let list = [email, otp];
    return list;
  }
  //if email is not sent
  return null;
};
module.exports = sendEmail;
