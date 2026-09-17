/* global Koneksi */
/**
 * APP.JS - Logika Utama Aplikasi
 */

// Menghindari error linter/IDE jika Koneksi dipanggil
const db = typeof Koneksi !== "undefined" ? Koneksi : window.Koneksi;

document.addEventListener("DOMContentLoaded", function () {
    console.log("Aplikasi berhasil dimuat.");

    // Inisialisasi elemen UI jika ada
    initApp();
});

function initApp() {
    // Contoh penanganan login / sesi
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (currentUser) {
        console.log("User terautentikasi:", currentUser);
        loadDashboardData(currentUser);
    }
}

// Fungsi Pendaftaran / Simpan Data Murid
function mendaftarMurid(dataMurid) {
    if (!db) {
        console.error("Modul Koneksi tidak ditemukan!");
        return { success: false, message: "Koneksi database gagal." };
    }

    try {
        const existing = db.findOne("murid", { email: dataMurid.email });
        if (existing) {
            return { success: false, message: "Email sudah terdaftar!" };
        }

        const newMurid = db.insert("murid", dataMurid);
        return { success: true, data: newMurid };
    } catch (error) {
        console.error("Gagal mendaftar:", error);
        return { success: false, message: "Terjadi kesalahan sistem." };
    }
}

// Fungsi Autentikasi / Login
function loginUser(email, password) {
    if (!db) {
        console.error("Modul Koneksi tidak ditemukan!");
        return { success: false, message: "Koneksi database gagal." };
    }

    const user = db.findOne("murid", { email: email, password: password });
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        return { success: true, user: user };
    } else {
        return { success: false, message: "Email atau password salah!" };
    }
}

// Memuat data berkas murid di dashboard
function loadDashboardData(user) {
    if (!db) return;

    const berkasContainer = document.getElementById("berkas-list");
    if (!berkasContainer) return;

    const daftarBerkas = db.getBerkas({ muridId: user.id });
    
    berkasContainer.innerHTML = "";
    if (daftarBerkas.length === 0) {
        berkasContainer.innerHTML = "<p>Belum ada berkas yang diunggah.</p>";
        return;
    }

    daftarBerkas.forEach(berkas => {
        const item = document.createElement("div");
        item.className = "berkas-item";
        item.innerHTML = `
            <h4>${berkas.namaBerkas || "Dokumen"}</h4>
            <p>Status: <strong>${berkas.status || "Pending"}</strong></p>
        `;
        berkasContainer.appendChild(item);
    });
}

// Upload Berkas
function uploadBerkas(fileData) {
    if (!db) return false;

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) return false;

    const berkasBaru = {
        muridId: currentUser.id,
        namaBerkas: fileData.nama,
        url: fileData.url,
        status: "Diproses"
    };

    const result = db.saveBerkas(berkasBaru);
    if (result) {
        loadDashboardData(currentUser);
        return true;
    }
    return false;
}