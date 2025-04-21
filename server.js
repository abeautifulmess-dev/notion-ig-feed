require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Configuração de CORS
app.use(cors());

// Configuração para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Configuração da API do Notion
const NOTION_API_URL = `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`;
const API_KEY = process.env.NOTION_API_KEY;

// Função para processar os dados recebidos da API do Notion
async function fetchNotionData() {
    try {
        console.log("ℹ️ Enviando requisição para a API do Notion...");
        const response = await axios.post(NOTION_API_URL, {}, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28"
            }
        });

        console.log("✅ Resposta recebida da API do Notion:", JSON.stringify(response.data, null, 2));

        return response.data.results.map(item => ({
            images: item.properties?.Artes?.files?.map(file => file.file?.url || file.external?.url) || [],
            date: item.properties?.Data?.date?.start || "Sem data",
            mediaType: item.properties?.Tipo_de_Mídia?.select?.name || "Imagem", // Captura o tipo de mídia
            fixed: item.properties?.Fixado?.checkbox || false,
            title: item.properties?.Name?.title?.[0]?.text?.content || "Sem título",
            description: item.properties?.Description?.rich_text?.[0]?.text?.content || "",
            tags: item.properties?.Tags?.multi_select?.map(tag => tag.name) || [],
            author: item.properties?.Autor?.rich_text?.[0]?.text?.content || "Desconhecido",
            likes: item.properties?.Likes?.number || 0
        })).sort((a, b) => b.fixed - a.fixed || new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error("❌ Erro ao acessar a API do Notion:", error.response?.data || error);
        throw new Error("Erro ao buscar dados do Notion");
    }
}

// Rota para buscar dados do Notion
app.get("/notion-data", async (req, res) => {
    try {
        const posts = await fetchNotionData();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Rota para servir a página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
