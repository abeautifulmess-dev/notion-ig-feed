document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const loadMoreBtn = document.getElementById("loadMore");
    const refreshBtn = document.getElementById("refresh");

    let allPosts = [];
    let displayedCount = 6;

   const allPosts = [
    { url: "https://static-cse.canva.com/blob/759754/IMAGE1.jpg", fixed: true, date: "2025-04-18" },
    { url: "https://static-cse.canva.com/blob/759754/IMAGE1.jpg", fixed: false, date: "2025-04-17" },
    { url: "https://static-cse.canva.com/blob/759754/IMAGE1.jpg", fixed: true, date: "2025-04-16" }
];

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

    fetchImages();
});
