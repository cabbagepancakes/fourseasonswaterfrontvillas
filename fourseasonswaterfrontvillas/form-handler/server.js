/**
 * Four Seasons Waterfront Villas – Contact Form Handler
 * Node.js / Express — sends via Postmark API
 */

const express = require('express');
const https   = require('https');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// -----------------------------------------------
// CONFIG
// -----------------------------------------------
const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;
const FROM_EMAIL     = process.env.FROM_EMAIL     || 'noreply@fortewebdesign.com.au';
const TO_EMAIL       = process.env.TO_EMAIL       || 'june.mason2@bigpond.com';
const SITE_NAME      = 'Four Seasons Waterfront Villas';

// -----------------------------------------------
// POST /api/contact
// -----------------------------------------------
app.post('/api/contact', (req, res) => {
  const firstName = sanitise(req.body.first_name);
  const lastName  = sanitise(req.body.last_name);
  const email     = sanitise(req.body.email);
  const phone     = sanitise(req.body.phone);
  const subject   = sanitise(req.body.subject) || 'Website Enquiry';
  const message   = sanitise(req.body.message);

  // Basic validation
  if (!firstName || !isValidEmail(email) || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  const fullName     = `${firstName} ${lastName}`.trim();
  const emailSubject = `${SITE_NAME} Enquiry: ${subject}`;

  const textBody = [
    `New enquiry from the ${SITE_NAME} website.`,
    '',
    `Name:    ${fullName}`,
    `Email:   ${email}`,
    `Phone:   ${phone}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const htmlBody = `
    <h2>New Website Enquiry</h2>
    <table cellpadding="6" cellspacing="0" style="font-family:sans-serif;font-size:15px;">
      <tr><td><strong>Name</strong></td><td>${fullName}</td></tr>
      <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
      <tr><td><strong>Subject</strong></td><td>${subject}</td></tr>
    </table>
    <h3 style="margin-top:20px;">Message</h3>
    <p style="font-family:sans-serif;font-size:15px;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
  `;

  const payload = JSON.stringify({
    From:          FROM_EMAIL,
    To:            TO_EMAIL,
    ReplyTo:       email,
    Subject:       emailSubject,
    TextBody:      textBody,
    HtmlBody:      htmlBody,
    MessageStream: 'outbound',
  });

  const options = {
    hostname: 'api.postmarkapp.com',
    path:     '/email',
    method:   'POST',
    headers: {
      'Accept':                    'application/json',
      'Content-Type':              'application/json',
      'X-Postmark-Server-Token':   POSTMARK_TOKEN,
      'Content-Length':            Buffer.byteLength(payload),
    },
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      if (response.statusCode === 200) {
        res.json({ success: true });
      } else {
        console.error(`Postmark error ${response.statusCode}: ${data}`);
        res.status(500).json({ success: false, error: 'Could not send message. Please call us on 0408 879 604.' });
      }
    });
  });

  request.on('error', (err) => {
    console.error('Network error:', err);
    res.status(500).json({ success: false, error: 'Network error. Please call us on 0408 879 604.' });
  });

  request.write(payload);
  request.end();
});

// -----------------------------------------------
// Helpers
// -----------------------------------------------
function sanitise(val) {
  return String(val || '').trim().replace(/[<>]/g, '');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// -----------------------------------------------
// Start
// -----------------------------------------------
app.listen(3000, () => {
  console.log('Form handler running on port 3000');
});
