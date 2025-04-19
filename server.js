require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Configurar CORS para permitir requisições do frontend
app.use(cors());

// Definir cabeçalhos CORS manualmente (caso necessário)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Configuração da API do Notion
const NOTION_API_URL = `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`;
const API_KEY = process.env.NOTION_API_KEY;

// Endpoint para buscar posts do Notion
app.get("/notion-data", async (req, res) => {
    try {
        const response = await axios.post(NOTION_API_URL, {}, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28"
            }
        });

        console.log("Dados brutos do Notion:", response.data.results); // Debug

        // Processar dados recebidos
        const posts = response.data.results.map(item => ({
            url: item.properties.Artes?.files[0]?.file.url || null, // Buscar imagem
            fixed: item.properties.Fixado?.checkbox || false,       // Checkbox de fixado
            date: item.properties.Data?.date.start                  // Data do post
        }));

        // Ordenação: fixados primeiro, depois do mais recente ao mais antigo
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
