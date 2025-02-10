// Pastikan pdf.js sudah dimuat sebelum menggunakan pdfjsLib
if (typeof pdfjsLib !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs/pdf.worker.mjs";
}

// ======= LOGIN FUNCTION =======
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "123") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
    } else {
        alert("Username atau password salah!");
    }
}

// ======= LOGOUT FUNCTION =======
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
});

// ======= CEK LOGIN SEBELUM MASUK HALAMAN =======
if (!localStorage.getItem("isLoggedIn") && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
}

// Daftar buku (Cover, Judul, Deskripsi, Kategori, dan Link PDF)
const books = [
    { 
        title: "Belajar HTML & CSS", 
        file: "books/book1.pdf", 
        cover: "covers/html-css.png", 
        description: "Panduan lengkap belajar HTML dan CSS untuk pemula.",
        category: "Web Development"
    },
    { 
        title: "JavaScript untuk Pemula", 
        file: "books/book2.pdf", 
        cover: "covers/javascript.jpg", 
        description: "Pahami dasar-dasar JavaScript dengan mudah dan cepat.",
        category: "Web Development"
    },
    { 
        title: "Pemrograman Python", 
        file: "books/book3.pdf", 
        cover: "covers/python.jpg", 
        description: "Pelajari bahasa Python dari dasar hingga mahir.",
        category: "Pemrograman"
    },
    { 
        title: "Algoritma dan Struktur Data", 
        file: "books/book4.pdf", 
        cover: "covers/algoritma.jpg", 
        description: "Konsep dan implementasi algoritma serta struktur data.",
        category: "Algoritma"
    },
    { 
        title: "Pengembangan Web dengan Laravel", 
        file: "books/book5.pdf", 
        cover: "covers/laravel.jpg", 
        description: "Membangun aplikasi web modern dengan framework Laravel.",
        category: "Web Development"
    }
];

// Tampilkan daftar buku secara dinamis
const bookList = document.querySelector(".book-list");
function displayBooks(filteredBooks) {
    bookList.innerHTML = "";
    filteredBooks.forEach(book => {
        let bookItem = document.createElement("div");
        bookItem.classList.add("book-item");

        bookItem.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.description}</p>
            <button onclick="selectBook('${book.file}')">📖 Baca Sekarang</button>
        `;

        bookList.appendChild(bookItem);
    });
}
displayBooks(books);

// Filter berdasarkan kategori
function filterBooks(category) {
    if (category === "all") {
        displayBooks(books);
    } else {
        const filtered = books.filter(book => book.category === category);
        displayBooks(filtered);
    }
}

// Pencarian buku
document.getElementById("searchBar").addEventListener("keyup", function () {
    const searchText = this.value.toLowerCase();
    const filtered = books.filter(book => book.title.toLowerCase().includes(searchText));
    displayBooks(filtered);
});

// ======= MEMILIH BUKU =======
function selectBook(pdfUrl) {
    localStorage.setItem("selectedBook", pdfUrl);
    window.location.href = "reader.html";
}

// ======= MEMBACA BUKU (PDF VIEWER) =======
let pdfDoc = null,
    pageNum = 1,
    canvas = document.getElementById("pdfCanvas"),
    ctx = canvas?.getContext("2d"),
    selectedBook = localStorage.getItem("selectedBook");

// Cek apakah ada buku yang dipilih sebelum masuk ke halaman
if (selectedBook && window.location.href.includes("reader.html")) {
    pdfjsLib.getDocument(selectedBook).promise.then((pdf) => {
        pdfDoc = pdf;
        renderPage(pageNum);
    });
} else if (!selectedBook && window.location.href.includes("reader.html")) {
    alert("Silakan pilih buku terlebih dahulu.");
    window.location.href = "index.html";
}

// Render halaman PDF
function renderPage(num) {
    pdfDoc.getPage(num).then((page) => {
        let viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = { canvasContext: ctx, viewport: viewport };
        page.render(renderContext);

        document.getElementById("pageNum").textContent = `Halaman ${num} / ${pdfDoc.numPages}`;
    });
}

// Pindah ke halaman sebelumnya
function prevPage() {
    if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
    }
}

// Pindah ke halaman selanjutnya
function nextPage() {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
    }
}

// Kembali ke daftar buku
function goBack() {
    window.location.href = "index.html";
}
