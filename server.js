require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Configuração de CORS
app.use(cors());

// Configuração da API do Notion
const NOTION_API_URL = `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`;
const API_KEY = process.env.NOTION_API_KEY;

// Rota para buscar dados do Notion
app.get("/notion-data", async (req, res) => {
    console.log("🚀 Rota /notion-data foi acessada!");

    try {
        console.log("ℹ️ Enviando requisição para a API do Notion...");
        const response = await axios.post(NOTION_API_URL, {}, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28"
            }
        });

        console.log("✅ Resposta recebida da API do Notion:", JSON.stringify(response.data, null, 2));

        const posts = response.data.results.map(item => {
            // Verifica se 'Artes' e 'files' existem antes de acessar
            const artes = item.properties?.Artes?.files;
            const imageUrl = artes && artes.length > 0 ? artes[0]?.file?.url || artes[0]?.external?.url || null : null;

            return {
                url: imageUrl,
                fixed: item.properties?.Fixado?.checkbox || false,
                date: item.properties?.Data?.date?.start || null
            };
        });

        // Ordena os posts (fixados primeiro, depois por data)
        posts.sort((a, b) => b.fixed - a.fixed || new Date(b.date) - new Date(a.date));

        console.log("📦 Posts processados:", posts);
        res.json(posts);
    } catch (error) {
        console.error("❌ Erro ao acessar a API do Notion:", error.response?.data || error);
        res.status(500).send("Erro ao buscar dados");
    }
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
