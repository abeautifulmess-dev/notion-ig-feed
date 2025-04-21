document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const refreshBtn = document.getElementById("refresh");
    const loadMoreBtn = document.getElementById("loadMore");
    let allPosts = [];
    let displayedCount = 9; // Exibir 9 posts inicialmente

    // 🗓️ Função para formatar a data
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    }

    // 🚀 Buscar dados da API
    async function fetchImages() {
        try {
            const response = await fetch("https://notion-ig-feed.onrender.com/notion-data");
            if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
            allPosts = await response.json();
            console.log("✅ Dados recebidos:", allPosts);
            renderImages();
            toggleLoadMoreButton();
        } catch (error) {
            console.error("❌ Erro ao carregar imagens:", error);
            imageGrid.innerHTML = `<p>Erro ao carregar dados. Tente novamente mais tarde.</p>`;
        }
    }

    // 📷 Renderizar os posts e placeholders
    function renderImages() {
        imageGrid.innerHTML = "";

        let totalPosts = allPosts.slice(0, displayedCount);
        let emptySlots = Math.max(9 - totalPosts.length, 0); // Garante 9 itens visíveis

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
                            ${post.images.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
                        </div>
                        ${post.fixed ? '<span class="fixed-icon">📌</span>' : ""}
                    `;
                } else {
                    div.innerHTML = `
                        <div class="date-box">${formatDate(post.date)}</div>
                        <img src="${post.images[0]}" alt="Postagem">
                        ${post.mediaType === "Vídeo" ? '<span class="video-icon">🎥</span>' : ""}
                        ${post.fixed ? '<span class="fixed-icon">📌</span>' : ""}
                    `;
                }
            } else {
                div.innerHTML = `<div class="placeholder"><i class="fa fa-image"></i></div>`;
            }

            imageGrid.appendChild(div);
        });

        for (let i = 0; i < emptySlots; i++) {
            const div = document.createElement("div");
            div.classList.add("image-container");
            div.innerHTML = `<div class="placeholder"><i class="fa fa-image"></i></div>`;
            imageGrid.appendChild(div);
        }
    }

    // 🔄 Exibição do botão "Ver Mais"
    function toggleLoadMoreButton() {
        loadMoreBtn.style.display = allPosts.length > displayedCount ? "block" : "none";
    }

    // 🔄 Navegação no Carrossel
    window.changeSlide = function (postIndex, direction) {
        const container = imageGrid.children[postIndex];
        const slides = container.querySelectorAll(".slide");
        const dots = container.querySelectorAll(".dot");
        const activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains("active"));
        const newIndex = (activeIndex + direction + slides.length) % slides.length;
        setSlide(container, slides, dots, newIndex);
    };

    window.setSlide = function (container, slides, dots, newIndex) {
        slides.forEach((slide, i) => slide.classList.toggle("active", i === newIndex));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === newIndex));
    };

    refreshBtn?.addEventListener("click", fetchImages);

    fetchImages();
});
