require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const NOTION_API_URL = "https://api.notion.com/v1/databases/";
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const API_KEY = process.env.NOTION_API_KEY;

app.get("/posts", async (req, res) => {
    try {
        const response = await axios.post(`${NOTION_API_URL}${DATABASE_ID}/query`, {}, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28"
            }
        });

        const posts = response.data.results.map(item => ({
            url: item.properties.Artes.files[0]?.file.url || null, // Link da imagem
            fixed: item.properties.Fixado.checkbox || false,      // Checkbox para fixado
            date: item.properties.Data.date.start                 // Data do post
        }));

        // Organizar: fixados primeiro, depois mais recentes
        posts.sort((a, b) => b.fixed - a.fixed || new Date(b.date) - new Date(a.date));

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar posts");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

console.log("Dados do Notion:", response.data.results);
res.json(posts);
