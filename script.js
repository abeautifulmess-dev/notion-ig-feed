document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const loadMoreBtn = document.getElementById("loadMore");
    const refreshBtn = document.getElementById("refresh");

    let allPosts = [];
    let displayedCount = 6;

    async function fetchImages() {
        try {
            const response = await fetch("https://notion-ig-feed-git-main-abeautifulmess-devs-projects.vercel.app/"); // Substitua pela URL do seu servidor na Vercel
            allPosts = await response.json();

            // Verificar se os dados estão sendo carregados corretamente
            console.log("Dados recebidos:", allPosts);

            renderImages();
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
        }
    }

    function renderImages() {
        imageGrid.innerHTML = "";
        allPosts.slice(0, displayedCount).forEach(post => {
            if (post.url) { // Certifica que há uma URL válida antes de renderizar
                const div = document.createElement("div");
                div.classList.add("image-container");
                div.innerHTML = `
                    <img src="${post.url}" alt="Postagem">
                    ${post.fixed ? '<span class="fixed-badge">📌</span>' : ""}
                `;
                imageGrid.appendChild(div);
            }
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

fetch("https://notion-ig-feed-git-main-abeautifulmess-devs-projects.vercel.app/")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log("JSON recebido:", data))
    .catch(error => console.error("Erro ao buscar posts:", error));
