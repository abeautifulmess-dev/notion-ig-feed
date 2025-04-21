document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const refreshBtn = document.getElementById("refresh");
    const loadMoreBtn = document.getElementById("loadMore");
    let allPosts = [];
    let displayedCount = 9; // Exibir 9 posts inicialmente

    // 🗓️ Função para formatar a data (Ex: Jan 01)
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", { month: "short", day: "2-digit" });
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

    // 📷 Renderizar os posts e placeholders
    function renderImages() {
        imageGrid.innerHTML = "";

        let totalPosts = allPosts.slice(0, displayedCount);
        let emptySlots = Math.max(9 - totalPosts.length, 0); // Garante que sempre haja 9 itens visíveis

        totalPosts.forEach((post, postIndex) => {
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
                        <button class="prev" onclick="changeSlide(${postIndex}, -1)">&#10095;</button>
                        <button class="next" onclick="changeSlide(${postIndex}, 1)">&#10095;</button>
                        <div class="dots">
                            ${post.images.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}" onclick="setSlide(${postIndex}, ${index})"></span>`).join('')}
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

        // Adiciona placeholders para preencher os slots vazios
        for (let i = 0; i < emptySlots; i++) {
            const div = document.createElement("div");
            div.classList.add("image-container");
            div.innerHTML = `<div class="placeholder"><img src="icons/image-placeholder.svg" alt="Sem imagem"></div>`;
            imageGrid.appendChild(div);
        }
    }

    // 🔄 Exibição do botão "Ver Mais"
    function toggleLoadMoreButton() {
        loadMoreBtn.style.display = allPosts.length > displayedCount ? "block" : "none";
    }

    // 🔄 Navegação no Carrossel
    window.changeSlide = function(postIndex, direction) {
        const slides = document.querySelectorAll(`.carousel:nth-child(${postIndex + 1}) .slide`);
        const dots = document.querySelectorAll(`.carousel:nth-child(${postIndex + 1}) .dot`);
        const activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains("active"));
        const newIndex = (activeIndex + direction + slides.length) % slides.length;
        setSlide(postIndex, newIndex);
    };

    window.setSlide = function(postIndex, newIndex) {
        const slides = document.querySelectorAll(`.carousel:nth-child(${postIndex + 1}) .slide`);
        const dots = document.querySelectorAll(`.carousel:nth-child(${postIndex + 1}) .dot`);
        slides.forEach((slide, i) => slide.classList.toggle("active", i === newIndex));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === newIndex
