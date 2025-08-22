import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();

// بروكسي ألماني مجاني
const proxy = "http://57.129.81.201:8080";

// Railway بيحدد البورت من متغير PORT
const PORT = process.env.PORT || 3000;

app.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("Missing url");

    const agent = new HttpsProxyAgent(proxy);

    const response = await fetch(targetUrl, { agent });
    const data = await response.arrayBuffer();

    res.set("content-type", response.headers.get("content-type"));
    res.send(Buffer.from(data));
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy server running on port ${PORT}`);
});
