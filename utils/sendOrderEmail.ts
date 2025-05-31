import dotenv from "dotenv";
import { Product } from "@/types/Product";
import nodemailer from "nodemailer";

dotenv.config();

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendOrderEmail = async (name : string, email : string, product : Product, quantity : number, totalPrice : number) => {
    try {
        const mailOptions = {
            from: `E-Sales Mart <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Order Has Been Confirmed!",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <div style="text-align: center;">
                  <img src="${product.thumbnail}" alt="${product.title}" style="max-width: 100px; margin-bottom: 10px;" />
                  <h1 style="color: #4CAF50;">Order Confirmed!</h1>
                </div>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for shopping with <strong>E-Sales Mart</strong>! We're happy to let you know that your order has been successfully placed.</p>
          
                <h2 style="margin-top: 30px;">Order Details:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0;"><strong>Product</strong>:</td>
                    <td>${product.title}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Quantity</strong>:</td>
                    <td>${quantity}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Unit Price</strong>:</td>
                    <td>$${product.price.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Total Price</strong>:</td>
                    <td><strong>$${totalPrice.toFixed(2)}</strong></td>
                  </tr>
                </table>
          
                <h3 style="margin-top: 30px;">Shipping Info</h3>
                <p>${product.shippingInformation}</p>
          
                <h3 style="margin-top: 30px;">Return Policy</h3>
                <p>${product.returnPolicy}</p>
          
                <p>If you have any questions or need support, feel free to reply to this email.</p>
          
                <p style="margin-top: 30px;">Warm regards,</p>
                <p><strong>E-Sales Mart Team</strong></p>
                <hr style="margin: 30px 0;" />
                <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply directly to this email.</p>
              </div>
            `
          }
          
        await transport.sendMail(mailOptions);
        console.log("Email sent successfully");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default sendOrderEmail;
