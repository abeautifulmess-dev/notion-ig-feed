document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const refreshBtn = document.getElementById("refresh");
    const loadMoreBtn = document.getElementById("loadMore");
    let allPosts = []; 
    let displayedCount = 9; // Exibir 9 posts inicialmente

    // 🗓️ Função para formatar a data (Ex: Jan 01)
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    }

    // 🚀 Buscar dados da API do Notion
    async function fetchImages() {
        try {
            const response = await fetch("https://notion-ig-feed.onrender.com/notion-data");
            allPosts = await response.json();
            console.log("✅ Dados recebidos:", allPosts);
            renderImages();
            toggleLoadMoreButton();
        } catch (error) {
            console.error("❌ Erro ao carregar imagens:", error);
        }
    }

    // 📷 Renderizar os posts
    function renderImages() {
        imageGrid.innerHTML = "";

        allPosts.slice(0, displayedCount).forEach(post => {
            const div = document.createElement("div");
            div.classList.add("image-container");

            if (post.images.length > 0) {
                if (post.mediaType === "Carrossel" && post.images.length > 1) {
                    div.classList.add("carousel");
                    div.innerHTML = `
                        <div class="date-box">${formatDate(post.date)}</div>
                        <div class="carousel-inner">
                            ${post.images.map((image, index) => `<img class="slide ${index === 0 ? 'active' : ''}" src="${image}">`).join('')}
                        </div>
                        <div class="dots">
                            ${post.images.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
                        </div>
                    `;
                } else {
                    div.innerHTML = `
                        <div class="date-box">${formatDate(post.date)}</div>
                        <img src="${post.images[0]}" alt="Postagem">
                        ${post.mediaType === "Vídeo" ? '<span class="video-icon">🎥 Reels</span>' : ""}
                    `;
                }
            } else {
                div.innerHTML = `<div class="placeholder"><img src="icons/image-placeholder.svg" alt="Sem imagem"></div>`;
            }

            imageGrid.appendChild(div);
        });
    }

    // 🔘 Botão "Ver Mais"
    function toggleLoadMoreButton() {
        loadMoreBtn.style.display = allPosts.length > displayedCount ? "block" : "none";
    }

    loadMoreBtn?.addEventListener("click", () => {
        displayedCount += 9;
        renderImages();
        toggleLoadMoreButton();
    });

    refreshBtn?.addEventListener("click", fetchImages);

    fetchImages();
});
