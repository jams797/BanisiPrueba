const nodemailer = require('nodemailer');

async function smtpSendMail(subject, html, to, cc, bcc, attachments) {
    try{
        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            logger: true,
            transactionLog: true, // include SMTP traffic in the logs
            allowInternalNetworkInterfaces: false
        });

        let message = {
            from: process.env.SMTP_FROM,
    
            // Comma separated list of recipients
            to: to,
            cc: cc,
            bcc: bcc,
    
            // Subject of the message
            subject: subject,
    
            // HTML body
            html: html,
    
            // An array of attachments
            attachments: attachments,
        };

        let info = await transporter.sendMail(message);
        console.log('Message sent successfully as %s', info.messageId);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

module.exports = {
    smtpSendMail,
}