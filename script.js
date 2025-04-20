document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const refreshBtn = document.getElementById("refresh");
    const loadMoreBtn = document.getElementById("loadMore");
    let allPosts = []; 
    let displayedCount = 6; 

    // Buscar dados da API do Notion
    async function fetchImages() {
        try {
            const response = await fetch("https://seu-servico.onrender.com/notion-data");
            allPosts = await response.json();
            console.log("✅ Dados recebidos:", allPosts);
            renderImages();
        } catch (error) {
            console.error("❌ Erro ao carregar imagens:", error);
        }
    }

    // Renderizar os posts
    function renderImages() {
        imageGrid.innerHTML = "";

        allPosts.slice(0, displayedCount).forEach(post => {
            const div = document.createElement("div");
            div.classList.add("image-container");

            if (post.images.length > 1) {
                div.classList.add("carousel");
                div.innerHTML = `
                    <div class="date-box">${new Date(post.date).toLocaleDateString("pt-BR")}</div>
                    <div class="carousel-inner">
                        ${post.images.map((image, index) => `<img class="slide ${index === 0 ? 'active' : ''}" src="${image}">`).join('')}
                    </div>
                    <button class="prev">◀</button>
                    <button class="next">▶</button>
                    <div class="dots">
                        ${post.images.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
                    </div>
                `;
            } else {
                div.innerHTML = `
                    <div class="date-box">${new Date(post.date).toLocaleDateString("pt-BR")}</div>
                    <img src="${post.images[0]}" alt="Postagem">
                    ${post.isVideo ? '<span class="video-icon">🎥 Reels</span>' : ""}
                `;
            }

            imageGrid.appendChild(div);
        });

        console.log("📷 Imagens renderizadas:", allPosts.slice(0, displayedCount));
    }

    // Botão "Ver mais"
    loadMoreBtn?.addEventListener("click", () => {
        displayedCount += 3;
        renderImages();
    });

    // Botão de atualização
    refreshBtn?.addEventListener("click", () => {
        fetchImages();
    });

    fetchImages();
});
