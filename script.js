document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid"); // Local onde as imagens serão exibidas
    const loadMoreBtn = document.getElementById("loadMore"); // Botão "Ver mais"
    const refreshBtn = document.getElementById("refresh"); // Botão de atualização

    let allPosts = []; // Array para armazenar os posts carregados
    let displayedCount = 6; // Número inicial de imagens exibidas

    // Função para buscar os dados da API do Notion
    async function fetchImages() {
        try {
            const response = await fetch("https://notion-ig-feed.onrender.com/notion-data"); // Chama o backend
            allPosts = await response.json();

            console.log("✅ Dados recebidos:", allPosts); // Log para depuração
            renderImages();
        } catch (error) {
            console.error("❌ Erro ao carregar imagens:", error);
        }
    }

    // Função para exibir as imagens na página
    function renderImages() {
        imageGrid.innerHTML = ""; // Limpa antes de adicionar novas imagens

        allPosts.slice(0, displayedCount).forEach(post => {
            if (post.url) { // Certifica que há uma URL válida antes de exibir
                const div = document.createElement("div");
                div.classList.add("image-container");
                div.innerHTML = `
                    <img src="${post.url}" alt="Postagem">
                    ${post.fixed ? '<span class="fixed-badge">📌</span>' : ""}
                `;
                imageGrid.appendChild(div);
            }
        });

        console.log("📷 Imagens renderizadas:", allPosts.slice(0, displayedCount)); // Log para depuração
    }

    // Botão "Ver mais" para carregar mais imagens progressivamente
    loadMoreBtn?.addEventListener("click", () => {
        displayedCount += 3; // Mostra mais imagens ao clicar em "Ver mais"
        renderImages();
    });

    // Botão de atualização para recarregar as imagens
    refreshBtn?.addEventListener("click", () => {
        fetchImages(); // Atualiza os posts ao clicar no botão de atualização
    });

    fetchImages(); // Carrega imagens ao iniciar a página
});
