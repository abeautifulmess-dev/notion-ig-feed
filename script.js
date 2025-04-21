document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const refreshBtn = document.getElementById("refresh");
    const loadMoreBtn = document.getElementById("loadMore");
    let allPosts = []; 
    let displayedCount = 6; 

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
        } catch (error) {
            console.error("❌ Erro ao carregar imagens:", error);
        }
    }

    // 📷 Renderizar os posts
    function renderImages() {
        imageGrid.innerHTML = "";

        allPosts.slice(0, displayedCount).forEach((post, postIndex) => {
            const div = document.createElement("div");
            div.classList.add("image-container");

            if (post.images.length > 1) {
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
                    ${post.isVideo ? '<span class="video-icon">🎥 Reels</span>' : ""}
                `;
            }

            imageGrid.appendChild(div);
        });

        console.log("📷 Imagens renderizadas:", allPosts.slice(0, displayedCount));
    }

    // 🔄 Navegação no Carrossel
    window.changeSlide = function(postIndex, direction) {
        const post = allPosts[postIndex];
        const activeIndex = post.images.findIndex(image => document.querySelectorAll(".slide")[postIndex].src === image);
        const newIndex = (activeIndex + direction + post.images.length) % post.images.length;
        setSlide(postIndex, newIndex);
    };

    window.setSlide = function(postIndex, newIndex) {
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".dot");
        slides.forEach((slide, i) => slide.classList.toggle("active", i === newIndex));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === newIndex));
    };

    // 🔘 Botão "Ver mais"
    loadMoreBtn?.addEventListener("click", () => {
        displayedCount += 3;
        renderImages();
    });

    // 🔄 Botão de atualização
    refreshBtn?.addEventListener("click", () => {
        fetchImages();
    });

    fetchImages();
});
