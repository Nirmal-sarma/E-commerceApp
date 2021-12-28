const nodeMailer=require('nodemailer');

const SendEmail=async(option)=>{

    const transporter=nodeMailer.createTransport({
        host:"smpt.gmail.com",
        port:465,
        service:process.env.SMPT_SERVICE,
        auth:{
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        }

});

    const mailOption={
        from:process.env.SMPT_MAIL,
        to:option.email,
        subject:option.subject,
        text:option.message,
    }

    await transporter.sendMail(mailOption)
};

module.exports=SendEmail ;