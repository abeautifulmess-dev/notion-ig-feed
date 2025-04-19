document.addEventListener("DOMContentLoaded", () => {
    const imageGrid = document.getElementById("imageGrid");
    const loadMoreBtn = document.getElementById("loadMore");
    const refreshBtn = document.getElementById("refresh");

    let allPosts = []; // Simulação de database
    let displayedCount = 6; // Número inicial de imagens

    function fetchImages() {
        // Simulação de posts com prioridade nos fixados
        allPosts = [
            { url: "imagem1.jpg", fixed: true, date: "2025-04-18" },
            { url: "imagem2.jpg", fixed: false, date: "2025-04-17" },
            { url: "imagem3.jpg", fixed: false, date: "2025-04-16" },
            { url: "imagem4.jpg", fixed: true, date: "2025-04-15" },
            { url: "imagem5.jpg", fixed: false, date: "2025-04-14" },
            { url: "imagem6.jpg", fixed: true, date: "2025-04-13" }
        ];

        // Organizar: fixados primeiro, depois do mais novo para mais velho
        allPosts.sort((a, b) => b.fixed - a.fixed || new Date(b.date) - new Date(a.date));
        renderImages();
    }

    function renderImages() {
        imageGrid.innerHTML = "";
        allPosts.slice(0, displayedCount).forEach(post => {
            const div = document.createElement("div");
            div.classList.add("image-container");
            div.innerHTML = `<img src="${post.url}" alt="Postagem">`;
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

    fetchImages(); // Inicializar
});
