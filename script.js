// 1. Import fungsi Firebase yang dibutuhkan (versi 13.0.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

// 2. Konfigurasi Firebase Anda (Sudah benar)
const firebaseConfig = {
    apiKey: "AIzaSyD-2rYw5LAr6SIJwHZZjdX1DygPukCkzVU",
    authDomain: "inventaris-63e9b.firebaseapp.com",
    projectId: "inventaris-63e9b",
    databaseURL: "https://inventaris-63e9b-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "inventaris-63e9b.firebasestorage.app",
    messagingSenderId: "1037827503984",
    appId: "1:1037827503984:web:3c9402f8a6aa84597981b5",
    measurementId: "G-W0C571FTMP"
};

// 3. Inisialisasi Firebase & Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, 'barang');

// DOM Elements
const form = document.getElementById('item-form');
const formTitle = document.getElementById('form-title');
const itemIdInput = document.getElementById('item-id');
const namaInput = document.getElementById('nama');
const kategoriInput = document.getElementById('kategori');
const jumlahInput = document.getElementById('jumlah');
const btnSimpan = document.getElementById('btn-simpan');
const btnBatal = document.getElementById('btn-batal');
const itemList = document.getElementById('item-list');

// 4. TAMBAH / UPDATE DATA
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = itemIdInput.value;
    const nama = namaInput.value;
    const kategori = kategoriInput.value;
    const jumlah = Number(jumlahInput.value);

    if (id === "") {
        const newPostRef = push(dbRef);
        set(newPostRef, { nama, kategori, jumlah })
            .then(() => resetForm())
            .catch((error) => alert("Gagal menyimpan: " + error.message));
    } else {
        const itemRef = ref(db, 'barang/' + id);
        update(itemRef, { nama, kategori, jumlah })
            .then(() => resetForm())
            .catch((error) => alert("Gagal mengupdate: " + error.message));
    }
});

// 5. BACA / MENAMPILKAN DATA (Realtime)
onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    itemList.innerHTML = "";

    if (data) {
        let no = 1;
        Object.keys(data).forEach((key) => {
            const item = data[key];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${no++}</td>
                <td>${item.nama}</td>
                <td>${item.kategori}</td>
                <td>${item.jumlah}</td>
                <td>
                    <button class="btn-warning" onclick="window.editItem('${key}', '${item.nama}', '${item.kategori}', ${item.jumlah})">Edit</button>
                    <button class="btn-danger" onclick="window.deleteItem('${key}')">Hapus</button>
                </td>
            `;
            itemList.appendChild(tr);
        });
    } else {
        itemList.innerHTML = `<tr><td colspan="5" style="text-align: center;">Belum ada data barang.</td></tr>`;
    }
});

// 6. HAPUS DATA
window.deleteItem = function(id) {
    if (confirm("Yakin ingin menghapus barang ini?")) {
        const itemRef = ref(db, 'barang/' + id);
        remove(itemRef).catch((error) => alert("Gagal menghapus: " + error.message));
    }
};

// 7. ISI FORM UNTUK EDIT
window.editItem = function(id, nama, kategori, jumlah) {
    itemIdInput.value = id;
    namaInput.value = nama;
    kategoriInput.value = kategori;
    jumlahInput.value = jumlah;
    
    formTitle.innerText = "Edit Barang";
    btnSimpan.innerText = "Update Barang";
    btnBatal.style.display = "inline-block";
};

// 8. BATAL EDIT
btnBatal.addEventListener('click', () => {
    resetForm();
});

function resetForm() {
    form.reset();
    itemIdInput.value = "";
    formTitle.innerText = "Tambah Barang Baru";
    btnSimpan.innerText = "Simpan Barang";
    btnBatal.style.display = "none";
}
