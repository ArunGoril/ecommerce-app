import nodeMailer from "nodemailer"

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        // Add host and port if this does not work
        // host: "smtp.gmail.com",
        // port: 465,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}

export default sendEmail