const ZALO_API = "https://openapi.zalo.me/v3.0/oa/message/cs";

interface ZaloConfig {
  accessToken: string;
  oaId: string;
}

function getConfig(): ZaloConfig | null {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const oaId = process.env.ZALO_OA_ID;

  if (!accessToken || !oaId) return null;
  return { accessToken, oaId };
}

export async function sendZaloOA(
  userId: string,
  message: string
): Promise<boolean> {
  const config = getConfig();
  if (!config) {
    console.warn("[Zalo] Missing ZALO_OA_ACCESS_TOKEN or ZALO_OA_ID");
    return false;
  }

  try {
    const res = await fetch(ZALO_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: config.accessToken,
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text: message },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Zalo] Send failed:", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Zalo] Error:", err);
    return false;
  }
}

export async function sendZaloOAByPhone(
  phone: string,
  message: string
): Promise<boolean> {
  const config = getConfig();
  if (!config) {
    console.warn("[Zalo] Missing config, skipping phone-based send");
    return false;
  }

  // Zalo OA requires user_id from phone lookup.
  // This is a placeholder — real implementation needs Zalo OA phone→user_id API.
  console.warn(`[Zalo] Phone-to-userId lookup not implemented for ${phone}`);
  return false;
}
