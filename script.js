const formLogin = document.getElementById('form-login');
const inputNama = document.getElementById('nama-kamu');
const teksSapaan = document.getElementById('teks-sapaan');
const layarMasuk = document.getElementById('layar-masuk');
const layarApp = document.getElementById('layar-app');

formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let ketikanNama = inputNama.value.trim();
    if(ketikanNama === "") return;

    let jamSekarang = new Date().getHours();
    let salam = "Pagi";

    if(jamSekarang >= 11 && jamSekarang < 15) {
        salam = "Siang";
    } else if(jamSekarang >= 15 && jamSekarang < 19) {
        salam = "Sore";
    } else if(jamSekarang >= 19 || jamSekarang < 4) {
        salam = "Malam";
    }

    teksSapaan.innerText = "Selamat " + salam + ", " + ketikanNama + "!";

    layarMasuk.style.display = 'none';
    layarApp.style.display = 'block';
});

/* Logika Tanggal */
function logikaTanggal(){
    const tanggal = new Date()
    const daftarHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
    const daftarBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Desember"]

    const hari = daftarHari[tanggal.getDay()];
    const tgl = tanggal.getDate();
    const bulan = daftarBulan[tanggal.getMonth()];
    const tahun = tanggal.getFullYear();

    let show = `${hari}, ${tgl} ${bulan} ${tahun}`;

    document.getElementById("hari-ini").innerHTML = show;
}
logikaTanggal()

/* Logika Jam */
function logikaJam(){
    let time = new Date()
    let jam = time.getHours();
    let menit = time.getMinutes();
    let detik = time.getSeconds();

    jam = (jam < 10) ? "0" + jam : jam;
    menit = (menit < 10) ? "0" + menit : menit;
    detik = (detik < 10) ? "0" + detik : detik;

    let tampilan = `${jam}:${menit}:${detik}`;
    
    document.getElementById("waktu-sekarang").textContent = tampilan;
}
setInterval(logikaJam, 1000);
logikaJam(); 

/* Array Data Master */
let data = [];
let dataKategori = [];
let dataSifat = [];
let dataTugas = [];
let editIndex = -1; 

/* Logika Merender Tabel Teman */
function renderTabelTeman() {
    const tableRows = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.nama} ${item.favorit ? "⭐" : ""}</td>
            <td>${item.hp} <button type="button" onclick="bukaWA('${item.hp}')">Kontak</button></td>
            <td>${item.gender}</td>
            <td>${item.tanggalLahir}</td>
            <td>${item.sifat || "-"}</td> <td>${item.kategori || "-"}</td>
            <td>
                <button type="button" style="background:#f59e0b;" onclick="editData(${index})">Edit</button>
                <button type="button" style="background:#ef4444;" onclick="hapusData(${index})">Hapus</button>
            </td>
        </tr>`).join('');

    document.getElementById("hasil").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>HP</th>
                    <th>Gender</th>
                    <th>Tgl Lahir</th>
                    <th>Kepribadian</th> <th>Kategori</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
    
    document.getElementById("total-teman").textContent = data.length;
}

/* Logika Merender Kontak Prioritas di Dashboard */
function renderPrioritas() {
    const listPrioritas = document.getElementById("list-prioritas");
    const favoritData = data.filter(item => item.favorit === true);
    
    if (favoritData.length === 0) {
        listPrioritas.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">Belum ada kontak prioritas yang ditandai.</div>';
        return;
    }
    
    const listHTML = favoritData.map(item => `
        <div class="list-item">
            <div class="item-header">
                <strong>${item.nama}</strong> <span>(${item.gender})</span>
            </div>
            <div class="item-body">Kategori: ${item.kategori || '-'} | Sifat: ${item.sifat || '-'}</div>
        </div>
    `).join('');
    
    listPrioritas.innerHTML = listHTML;
}

/* Logika Mengupdate Dropdown Teman (Orang yg Terlibat) */
function updateDropdownTeman() {
    const el = document.getElementById("tugas-orang");
    if (el) {
        el.innerHTML = '<option value="">-- Pilih Orang --</option>';
        data.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t.nama;
            opt.textContent = t.nama;
            el.appendChild(opt);
        });
    }
}

/* Logika Menyimpan (Create & Update) Data Teman */
function hasil(){
    const modalElement = document.getElementById("modal");
    const nama = document.getElementById("nama").value;
    const nomorHp = document.getElementById("nomorHp").value || 0;
    const gender = document.getElementById("kelamin").value || "Tidak terdefinisi";
    const lahir = document.getElementById("birth").value;
    const sifat = document.getElementById("pilih-sifat-teman").value;
    const kategori = document.getElementById("pilih-kategori-teman").value;
    const isFavorit = document.getElementById("fav-cek").checked;

    if (nama === "" || nomorHp === "" || nomorHp === 0){
        alert("Nama dan No HP harus diisi!");
        return;
    }

    const newData = {
        nama: nama,
        hp: nomorHp,
        gender: gender,
        tanggalLahir: lahir,
        sifat: sifat, 
        kategori: kategori,
        favorit: isFavorit
    };

    if (editIndex === -1) {
        data.push(newData);
        alert("Berhasil! Data " + nama + " telah tersimpan.");
    } else {
        data[editIndex] = newData;
        alert("Berhasil! Data " + nama + " telah diperbarui.");
        editIndex = -1; 
    }

    modalElement.classList.remove("open");
    renderTabelTeman();
    renderPrioritas();
    updateDropdownTeman();
    document.getElementById("formulir-crud-teman").reset();
}

/* Logika Edit Data Teman */
function editData(index) {
    const item = data[index];
    document.getElementById("nama").value = item.nama;
    document.getElementById("nomorHp").value = item.hp;
    document.getElementById("kelamin").value = item.gender;
    document.getElementById("birth").value = item.tanggalLahir;
    document.getElementById("pilih-sifat-teman").value = item.sifat || ""; 
    document.getElementById("pilih-kategori-teman").value = item.kategori || "";
    document.getElementById("fav-cek").checked = item.favorit || false;

    editIndex = index;
    document.getElementById("modal").classList.add("open");
}

/* Logika Hapus Data Teman */
function hapusData(index) {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus teman ini?");
    if (konfirmasi) {
        data.splice(index, 1); 
        renderTabelTeman();    
        renderPrioritas();
        updateDropdownTeman();
    }
}

/* Logika CRUD Kategori */
function ambilKategori() {
    const inputKategori = document.getElementById("kategori-relasi");
    const kategori = inputKategori.value.trim();
    const warna = document.getElementById("warna-kategori").value;

    if (kategori === "") {
        alert("Nama kategori tidak boleh kosong!");
        return;
    }

    let checkDouble = dataKategori.some(item => item.namaKategori.toLowerCase() === kategori.toLowerCase());

    if (checkDouble){
        alert("Kategori '" + kategori + "' sudah ada!");
        return;
    }
    
    dataKategori.push({
        namaKategori: kategori,
        warnaKategori: warna
    });

    renderListKategori();
    updateDropdownKategori();

    inputKategori.value = "";
}

function renderListKategori() {
    const listHTML = dataKategori.map((item, index) => `
        <div class="list-item" style="border-left: 5px solid ${item.warnaKategori}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <span>${item.namaKategori}</span>
            <button type="button" style="background:#ef4444; width: auto; padding: 6px 12px; font-size: 12px; border-radius: 6px; margin: 0;" onclick="hapusKategori(${index})">Hapus</button>
        </div>
    `).join('');
    document.getElementById("list-data").innerHTML = listHTML;
}

function hapusKategori(index) {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus kategori ini?");
    if (konfirmasi) {
        dataKategori.splice(index, 1);
        renderListKategori();
        updateDropdownKategori();
    }
}

function updateDropdownKategori() {
    const dropdowns = ["pilih-kategori-teman", "tugas-kategori"];
    dropdowns.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = '<option value="">-- Pilih Kategori --</option>';
            dataKategori.forEach(kat => {
                const opt = document.createElement("option");
                opt.value = kat.namaKategori;
                opt.textContent = kat.namaKategori;
                el.appendChild(opt);
            });
        }
    });
}

/* Logika Modal Teman */
function initModalTeman(){
    const openBtn = document.getElementById("openModal");
    const closeBtn = document.getElementById("closeModal");
    const modal = document.getElementById("modal");

    openBtn.addEventListener("click", () => {
        document.getElementById("formulir-crud-teman").reset();
        editIndex = -1; 
        modal.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    });
}
initModalTeman();

/* Logika buka whatsapp */
function bukaWA(nomor) {
    let jamSekarang = new Date().getHours();
    let waktu = "Pagi";

    if (jamSekarang >= 11 && jamSekarang < 15) {
        waktu = "Siang";
    } else if (jamSekarang >= 15 && jamSekarang < 19) {
        waktu = "Sore";
    } else if (jamSekarang >= 19 || jamSekarang < 4) {
        waktu = "Malam";
    }

    let pesan = `Halo, Selamat ${waktu}!`;
    let direct = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
    window.open(direct, '_blank');
}   

/* Logika CRUD sifat */
function ambilSifat(){
    const sifat = document.getElementById("nama-sifat").value.trim();
    const deskripsi = document.getElementById("desc-sifat").value;
    const warna = document.getElementById("warna-sifat").value;

    if (sifat === "") {
        alert("Nama sifat tidak boleh kosong!");
        return;
    }

    const checkDouble = dataSifat.some(item => item.namaSifat.toLowerCase() === sifat.toLowerCase())
    if (checkDouble){
        alert(`Sifat '${sifat}' sudah terdaftar disistem!`)
        return
    }

    dataSifat.push({
        namaSifat: sifat,
        deskripsiSifat: deskripsi,
        warnaSifat: warna
    });

    renderListSifat();
    updateDropdownSifat();
    alert(`Sifat '${sifat}' berhasil ditambahkan!`);
    
    document.getElementById("nama-sifat").value = "";
    document.getElementById("desc-sifat").value = "";
}

function renderListSifat() {
    const outputHtml = document.getElementById("list-sifat");
    const dataSifatOutput = dataSifat.map((item, index) => `
    <div class="list-item" style="border-left: 5px solid ${item.warnaSifat}; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
        <div>
            <strong>${item.namaSifat}</strong><br>
            <span style="font-size:13px; color:#6b7280;">${item.deskripsiSifat}</span>
        </div>
        <button type="button" style="background:#ef4444; width: auto; padding: 6px 12px; font-size: 12px; border-radius: 6px; margin: 0;" onclick="hapusSifat(${index})">Hapus</button>
    </div>
    `).join('');
    outputHtml.innerHTML = dataSifatOutput;
}

function hapusSifat(index) {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus sifat ini?");
    if (konfirmasi) {
        dataSifat.splice(index, 1);
        renderListSifat();
        updateDropdownSifat();
    }
}

function updateDropdownSifat() {
    const el = document.getElementById("pilih-sifat-teman");
    if (el) {
        el.innerHTML = '<option value="">-- Pilih Sifat --</option>';
        dataSifat.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.namaSifat;
            opt.textContent = s.namaSifat;
            el.appendChild(opt);
        });
    }
}

/* LOGIKA TUGAS DAN AGENDA */

function initModalTugas() {
    const openBtn = document.getElementById("openModalTugas");
    const closeBtn = document.getElementById("closeModalTugas");
    const modalTugas = document.getElementById("modal-tugas");

    openBtn.addEventListener("click", () => {
        document.getElementById("formulir-tugas").reset();
        modalTugas.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
        modalTugas.classList.remove("open");
    });
}
initModalTugas();

function simpanTugas() {
    const namaTugas = document.getElementById("nama-tugas").value.trim();
    const descTugas = document.getElementById("desc-tugas").value;
    const orangTugas = document.getElementById("tugas-orang").value;
    const katTugas = document.getElementById("tugas-kategori").value;
    const tenggatTugas = document.getElementById("tugas-tenggat").value;

    if (namaTugas === "" || tenggatTugas === "") {
        alert("Nama Kegiatan dan Tanggal/Tenggat Waktu wajib diisi!");
        return;
    }

    dataTugas.push({
        nama: namaTugas,
        deskripsi: descTugas,
        orang: orangTugas,
        kategori: katTugas,
        tenggat: tenggatTugas
    });

    alert(`Tugas / Agenda "${namaTugas}" berhasil disimpan!`);
    
    document.getElementById("modal-tugas").classList.remove("open");
    document.getElementById("formulir-tugas").reset();

    renderTugasHalaman();
    renderTugasDashboard();
}

function renderTugasHalaman() {
    const hasilTugas = document.getElementById("hasil-tugas");
    
    if (dataTugas.length === 0) {
        hasilTugas.innerHTML = '<div style="text-align: center; padding: 30px; background: #fff; border-radius: 10px; color: #6b7280; font-size: 15px; border: 1px solid #e5e7eb;">Belum ada tugas atau agenda yang dibuat.</div>';
        return;
    }

    const htmlTugas = dataTugas.map((t, index) => `
        <div class="list-item" style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                <div>
                    <span class="tag-merah">Tenggat: ${t.tenggat}</span>
                    <div class="item-header" style="margin-top: 8px;">
                        <strong style="font-size: 17px;">${t.nama}</strong>
                    </div>
                    <div class="item-body" style="margin-top: 5px;">
                        ${t.deskripsi ? `<p style="margin-bottom: 5px;">${t.deskripsi}</p>` : ''}
                        <em style="color: #6b7280; font-size: 12px;">
                            Bersama: ${t.orang || 'Sendiri'} | Kategori: ${t.kategori || '-'}
                        </em>
                    </div>
                </div>
                <button type="button" style="background:#ef4444; width: auto; padding: 8px 16px; font-size: 13px; border-radius: 6px; margin: 0;" onclick="hapusTugas(${index})">Tandai Selesai</button>
            </div>
        </div>
    `).join('');

    hasilTugas.innerHTML = htmlTugas;
}

function renderTugasDashboard() {
    const containerDash = document.getElementById("list-tugas-dashboard");
    const totalTugasTeks = document.getElementById("total-tugas");

    totalTugasTeks.textContent = dataTugas.length;

    if (dataTugas.length === 0) {
        containerDash.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">Hore! Tidak ada tugas atau agenda tertunda.</div>';
        return;
    }

    const htmlDash = dataTugas.map(t => `
        <div class="list-item">
            <span class="tag-merah">${t.tenggat}</span>
            <div class="item-header" style="margin-top: 6px;">
                <strong>${t.nama}</strong>
            </div>
            <div class="item-body">Bersama: ${t.orang || 'Sendiri'}</div>
        </div>
    `).join('');

    containerDash.innerHTML = htmlDash;
}

function hapusTugas(index) {
    const setuju = confirm("Apakah kamu yakin tugas/agenda ini sudah selesai atau ingin dihapus?");
    if (setuju) {
        dataTugas.splice(index, 1);
        renderTugasHalaman();
        renderTugasDashboard();
    }
}

/* =========================================
   LOGIKA HAMBURGER MENU (RESPONSIVE SIDEBAR)
   ========================================= */
const hamburgerBtn = document.getElementById('hamburger-menu');
const menuKiri = document.getElementById('menu-kiri');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if (hamburgerBtn && menuKiri && sidebarOverlay) {
    function toggleSidebar() {
        menuKiri.classList.toggle('open');
        sidebarOverlay.classList.toggle('open');
    }

    hamburgerBtn.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Tutup sidebar saat item menu diklik (khusus di HP)
    const menuItems = document.querySelectorAll('#menu-kiri ul li label');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuKiri.classList.remove('open');
                sidebarOverlay.classList.remove('open');
            }
        });
    });
}

// Render awal
renderPrioritas();
renderTugasHalaman();
renderTugasDashboard();