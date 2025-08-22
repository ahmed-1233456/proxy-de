import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();

// بروكسي روماني (ممكن تغيره عند الحاجة)
const proxy = "http://86.120.122.3:3128";

// Railway (أو أي استضافة) بتحدد البورت في ENV
const PORT = process.env.PORT || 3000;

app.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).send("Missing url");
    }

    // إعداد البروكسي
    const agent = new HttpsProxyAgent(proxy);

    // جلب البيانات مع Headers أساسية
    const response = await fetch(targetUrl, {
      agent,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://rr.cdn.vodafone.pt/",
        "Origin": "https://rr.cdn.vodafone.pt"
      }
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Upstream error: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();

    // تمرير نوع المحتوى زي ما هو
    res.set("content-type", response.headers.get("content-type"));
    res.send(Buffer.from(data));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error: " + err.message);
  }
});

// استماع على البورت اللي Railway مديه
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
