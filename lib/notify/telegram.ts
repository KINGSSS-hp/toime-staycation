const TELEGRAM_API = "https://api.telegram.org/bot";

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

function getConfig(): TelegramConfig | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return null;
  return { botToken, chatId };
}

export async function sendTelegram(
  message: string,
  chatIdOverride?: string
): Promise<boolean> {
  const config = getConfig();
  if (!config) {
    console.warn("[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  const chatId = chatIdOverride || config.chatId;

  try {
    const res = await fetch(`${TELEGRAM_API}${config.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Telegram] Send failed:", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Telegram] Error:", err);
    return false;
  }
}
