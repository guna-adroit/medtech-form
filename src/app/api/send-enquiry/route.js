import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message, product_title, seller_email } = body;

    if (!name || !email || !message || !product_title || !seller_email) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // upgrade later with STARTTLS

      auth: {
        user: process.env.MAIL_USER1,
        pass: process.env.MAIL_PASS1
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: seller_email,
      subject: `New Enquiry for ${product_title}`,
      html: `
        <h2>New Product Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ success: false, error: 'Email failed to send' }, { status: 500 });
  }
}
