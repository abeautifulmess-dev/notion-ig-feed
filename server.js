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
    console.log("🚀 Rota /notion-data foi acessada!"); // Log para verificar se a rota foi chamada

    try {
        console.log("ℹ️ Enviando requisição para a API do Notion...");
        const response = await axios.post(NOTION_API_URL, {}, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28"
            }
        });

        console.log("✅ Resposta recebida da API do Notion:", response.data.results); // Log para verificar os dados recebidos

        const posts = response.data.results.map(item => ({
            url: item.properties.Artes?.files[0]?.file.url || null,
            fixed: item.properties.Fixado?.checkbox || false,
            date: item.properties.Data?.date.start
        }));

        console.log("📦 Posts processados:", posts); // Log para verificar os dados processados
        res.json(posts);
    } catch (error) {
        console.error("❌ Erro ao acessar a API do Notion:", error.response?.data || error); // Log do erro detalhado
        res.status(500).send("Erro ao buscar dados");
    }
});
    try {
        const response = await axios.post(NOTION_API_URL, {}, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28"
            }
        });

        const posts = response.data.results.map(item => ({
            url: item.properties.Artes?.files[0]?.file.url || null,
            fixed: item.properties.Fixado?.checkbox || false,
            date: item.properties.Data?.date.start
        }));

        posts.sort((a, b) => b.fixed - a.fixed || new Date(b.date) - new Date(a.date));

        res.json(posts);
    } catch (error) {
        console.error("Erro ao buscar dados do Notion:", error.response?.data || error);
        res.status(500).send("Erro ao buscar posts do Notion");
    }
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
