import "dotenv/config";

export class TestmailHelper {
  private static tag = "";

  static generateEmail(): string {
    this.tag = Math.random().toString(36).substring(2, 10);
    return `${process.env.TESTMAIL_NAMESPACE}.${this.tag}@inbox.testmail.app`;
  }

  static async getOTP(startedAt: number, timeoutMs = 60000): Promise<string> {
    const params = new URLSearchParams({
      apikey: process.env.TESTMAIL_API_KEY!,
      namespace: process.env.TESTMAIL_NAMESPACE!,
      tag: this.tag,
      livequery: "true", // the API waits until a matching email arrives
      timestamp_from: String(startedAt),
    });

    const res = await fetch(`https://api.testmail.app/api/json?${params}`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await res.text();
    if (!res.ok)
      throw new Error(`testmail ${res.status}: ${text.slice(0, 200)}`);

    const data = JSON.parse(text);
    const mail = data.emails?.[0];
    if (!mail) throw new Error("No email received");

    const match = (mail.text ?? mail.html ?? "").match(/\b\d{6}\b/);
    if (!match) throw new Error(`OTP not found. Subject: ${mail.subject}`);
    return match[0];
  }
}
