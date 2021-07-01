require("dotenv").config();
var nodemailer = require("nodemailer");
var fs = require("fs");
const {
  Cart,
  Card,
  User,
  Discount,
  Address,
  ShippingMethod,
  CartItem,
  ProductVariant,
  Product,
  ProductImage,
  CardType,
} = require("../model");

async function sendMailConfirmOrder(order) {
  try {
    template = await fs.readFileSync("helper/mail-template.html");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    let result = await Cart.findOne({
      where: { id: order },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "password",
              "role",
              "resetToken",
              "lastAccess",
              "avatar",
              "identify_number",
              "address",
              "sex",
              "phone",
              "birthYear",
            ],
          },
        },
        {
          model: Discount,
        },
        {
          model: Address,
        },
        {
          model: ShippingMethod,
        },
        {
          model: CartItem,
          include: [
            { model: ProductVariant },
            {
              model: Product,
              include: [{ model: ProductImage, as: "images" }],
            },
          ],
        },
        { model: Card, include: [{ model: CardType }] },
      ],
      order: [["createdAt", "DESC"]],
      nest: true,
    });

    const tableItem = result.cart_items
      .map(
        (item) => `
      <tr>
      <th style="
      text-align: left;">${item.product.name} - ${
          item.product_variant.name
        } x ${item.number}</th>
      <th style="
      text-align: right;">${item.product_variant.price}</th>
      <th style="
      text-align: right;">${item.number * item.product_variant.price}</th>
      </tr>
      `
      )
      .join("");

    paymentDetail = `
    <p style="font-size: 14px; line-height: 140%; text-align: right;"><span style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 19.6px;">Total:     ${result.merchandise_money} VND</span></p>
    <p style="font-size: 14px; line-height: 140%; text-align: right;"><span style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 19.6px;">Shipping fee:    +${result.shipping_fee} VND</span></p>
    <p style="font-size: 14px; line-height: 140%; text-align: right;"><span style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 19.6px;">Card fee:     +${result.card_fee} VND</span></p>
    <p style="font-size: 14px; line-height: 140%; text-align: right;"><span style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 19.6px;">Discount:    -${result.discount_money} VND</span></p>
    <p style="font-size: 14px; line-height: 140%; text-align: right;"><span style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 19.6px;">Paid: ${result.amount} VND</span></p>
    `;
    template = String(template)
      .replace("<<!table-content!>>", tableItem)
      .replace("<<!payment-detail!>>", paymentDetail);
    //   template.replace("<<!table-content!>>", tableItem);

    var mailOptions = {
      from: "customer.vklshop@gmail.com",
      to: result.user.email,
      subject: "Your order had been placed successfully!",
      html: template,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log("Send mail failed!", err);
  }
}

module.exports = {
  sendMailConfirmOrder,
};
