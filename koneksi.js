// ==========================================
// KONEKSI.JS - Modul Koneksi & Operasi Data
// ==========================================

const Koneksi = (function () {
    // Database internal berbasis LocalStorage / Memory
    const DB_PREFIX = "app_data_";

    function getStorage(key) {
        try {
            const data = localStorage.getItem(DB_PREFIX + key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error reading from storage:", e);
            return [];
        }
    }

    function setStorage(key, data) {
        try {
            localStorage.setItem(DB_PREFIX + key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("Error writing to storage:", e);
            return false;
        }
    }

    return {
        // Mencari 1 data berdasarkan kriteria
        findOne: function (collection, query) {
            const items = getStorage(collection);
            return items.find(item => {
                return Object.keys(query).every(key => item[key] === query[key]);
            }) || null;
        },

        // Mencari banyak data berdasarkan kriteria
        find: function (collection, query = {}) {
            const items = getStorage(collection);
            if (Object.keys(query).length === 0) return items;
            return items.filter(item => {
                return Object.keys(query).every(key => item[key] === query[key]);
            });
        },

        // Menambahkan data baru
        insert: function (collection, data) {
            const items = getStorage(collection);
            const newItem = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...data
            };
            items.push(newItem);
            setStorage(collection, items);
            return newItem;
        },

        // Mengupdate data
        update: function (collection, query, updateData) {
            const items = getStorage(collection);
            let updated = false;
            const newItems = items.map(item => {
                const match = Object.keys(query).every(key => item[key] === query[key]);
                if (match) {
                    updated = true;
                    return { ...item, ...updateData, updatedAt: new Date().toISOString() };
                }
                return item;
            });
            if (updated) {
                setStorage(collection, newItems);
            }
            return updated;
        },

        // Menghapus data
        remove: function (collection, query) {
            const items = getStorage(collection);
            const filtered = items.filter(item => {
                return !Object.keys(query).every(key => item[key] === query[key]);
            });
            setStorage(collection, filtered);
            return items.length !== filtered.length;
        },

        // Mengambil daftar berkas/dokumen
        getBerkas: function (query = {}) {
            return this.find("berkas", query);
        },

        // Menyimpan berkas/dokumen baru
        saveBerkas: function (berkasData) {
            return this.insert("berkas", berkasData);
        }
    };
})();

// Eksport ke scope global window
if (typeof window !== "undefined") {
    window.Koneksi = Koneksi;
}