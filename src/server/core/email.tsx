import { Resend } from "resend";
import { PriceDropAlertEmail } from "@/components/emails/price-drop-alert";
import { db } from "../db";

const resend = new Resend(process.env.RESEND_API_KEY);

interface PriceDropPayload {
  productName: string;
  competitorName: string;
  oldPrice: number;
  newPrice: number;
  productUrl: string;
}

export class EmailService {
  async sendPriceDropAlert(payload: PriceDropPayload) {
    try {
      const recipients = await db.query.alertRecipients.findMany();
      const recipientEmails = recipients.map((r) => r.email);

      if (recipientEmails.length === 0) {
        console.log("No alert recipients configured. Skipping email.");
        return;
      }

      await resend.emails.send({
        from: "Price Alert <mvlapatrick@gmail.com>",
        to: recipientEmails,
        subject: `🚨 Price Drop Alert: ${payload.productName} on ${payload.competitorName}`,
        react: <PriceDropAlertEmail {...payload} />,
      });
      console.log(
        `Price drop alert email sent to ${recipientEmails.length} recipients.`
      );
    } catch (error) {
      console.error("Failed to send price drop alert email:", error);
    }
  }
}
