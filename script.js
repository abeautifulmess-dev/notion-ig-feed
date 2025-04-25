document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const refreshBtn = document.getElementById("refresh");
    const loadMoreBtn = document.getElementById("loadMore");
    let allPosts = [];
    let displayedCount = 9;

    // 🗓️ Função para formatar a data
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    }

    // 🚀 Buscar dados da API
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
        let emptySlots = Math.max(9 - totalPosts.length, 0);

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
                        <button class="prev">&#10095;</button>
                        <button class="next">&#10095;</button>
                        <div class="dots">
                            ${post.images.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
                        </div>
                        ${post.fixed ? '<img class="fixed-icon" src="public/icons/pinned.svg" alt="Fixado">' : ""}
                    `;

                    // Adicionar eventos de clique para os botões de navegação
                    const prevButton = div.querySelector(".prev");
                    const nextButton = div.querySelector(".next");
                    prevButton.addEventListener("click", () => changeSlide(postIndex, -1));
                    nextButton.addEventListener("click", () => changeSlide(postIndex, 1));
                } else {
                    div.innerHTML = `
                        <div class="date-box">${formatDate(post.date)}</div>
                        <img src="${post.images[0]}" alt="Postagem">
                        ${post.mediaType === "Vídeo" ? '<img class="video-icon" src="public/icons/reels.svg" alt="Reels">' : ""}
                        ${post.fixed ? '<img class="fixed-icon" src="public/icons/pinned.svg" alt="Fixado">' : ""}
                    `;
                }
            } else {
                div.innerHTML = `<div class="placeholder"><img src="public/icons/picture.svg" alt="Sem imagem"></div>`;
            }

            imageGrid.appendChild(div);
        });

        for (let i = 0; i < emptySlots; i++) {
            const div = document.createElement("div");
            div.classList.add("image-container");
            div.innerHTML = `<div class="placeholder"><img src="public/icons/picture.svg" alt="Sem imagem"></div>`;
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
        setSlide(slides, dots, newIndex);
    };

    window.setSlide = function (slides, dots, newIndex) {
        slides.forEach((slide, i) => slide.classList.toggle("active", i === newIndex));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === newIndex));
    };

    // 🔄 Botão de Atualizar
    refreshBtn?.addEventListener("click", fetchImages);

    fetchImages();
});
