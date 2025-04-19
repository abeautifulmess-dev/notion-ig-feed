document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const loadMoreBtn = document.getElementById("loadMore");
    const refreshBtn = document.getElementById("refresh");

    let allPosts = [];
    let displayedCount = 6;

    async function fetchImages() {
        try {
            const response = await fetch("http://localhost:3000/posts");
            allPosts = await response.json();
            renderImages();
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
        }
    }

    function renderImages() {
        imageGrid.innerHTML = "";
        allPosts.slice(0, displayedCount).forEach(post => {
            const div = document.createElement("div");
            div.classList.add("image-container");
            div.innerHTML = `
                <img src="${post.url}" alt="Postagem">
                ${post.fixed ? '<span class="fixed-badge">📌</span>' : ""}
            `;
            imageGrid.appendChild(div);
        });
    }

    loadMoreBtn.addEventListener("click", () => {
        displayedCount += 3;
        renderImages();
    });

    refreshBtn.addEventListener("click", () => {
        fetchImages();
    });

    fetchImages();
});
