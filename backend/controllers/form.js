const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
    const {email, name, message} = req.body;

    const emailData = {
        to: process.env.EMAIL_TO,
        from: email,
        subject: 'Contact form',
        text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
        html: `
            <h4>Email received from contact form</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contact sensitive information</p>
            <p>https://seoblog.com</p>
        `
    };

    sgMail.send(emailData)
    .then(sent => {
        return res.json({
            success: true
        });
    });
};

exports.contactBlogAuthorForm = (req, res) => {
    const {authorEmail, email, name, message} = req.body;

    const emailData = {
        to: authorEmail,
        from: email,
        subject: 'Contact form',
        text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
        html: `
            <h4>Email received from contact form</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contact sensitive information</p>
            <p>https://seoblog.com</p>
        `
    };

    sgMail.send(emailData)
    .then(sent => {
        return res.json({
            success: true
        });
    });
};