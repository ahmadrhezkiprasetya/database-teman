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

/* Database */
let data = [];
let dataKategori = [];
let dataSifat = [];
let editIndex = -1; 

/* Logika Merender Tabel Teman */
function renderTabelTeman() {
    const tableRows = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.hp} <button type="button" onclick="bukaWA('${item.hp}')">Kontak</button></td>
            <td>${item.gender}</td>
            <td>${item.tanggalLahir}</td>
            <td>${item.kategori}</td>
            <td>
                <button type="button" style="background:#f59e0b;" onclick="editData(${index})">Edit</button>
                <button type="button" style="background:#ef4444;" onclick="hapusData(${index})">Hapus</button>
            </td>
        </tr>`).join('');

    document.getElementById("hasil").innerHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>HP</th>
                    <th>Gender</th>
                    <th>Tgl Lahir</th>
                    <th>Kategori</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
    
    document.getElementById("total-teman").textContent = data.length;
}

/* Logika Menyimpan (Create & Update) Data Teman */
function hasil(){
    const modalElement = document.getElementById("modal");
    const nama = document.getElementById("nama").value;
    const nomorHp = document.getElementById("nomorHp").value || 0;
    const gender = document.getElementById("kelamin").value || "Tidak terdefinisi";
    const lahir = document.getElementById("birth").value;
    const kategori = document.getElementById("pilih-kategori-teman").value;

    if (nama === "" || nomorHp === "" || nomorHp === 0){
        alert("Nama dan No HP harus diisi!");
        return;
    }

    const newData = {
        nama: nama,
        hp: nomorHp,
        gender: gender,
        tanggalLahir: lahir,
        kategori: kategori 
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
    document.getElementById("formulir-crud-teman").reset();
}

/* Logika Edit Data Teman */
function editData(index) {
    const item = data[index];
    document.getElementById("nama").value = item.nama;
    document.getElementById("nomorHp").value = item.hp;
    document.getElementById("kelamin").value = item.gender;
    document.getElementById("birth").value = item.tanggalLahir;
    document.getElementById("pilih-kategori-teman").value = item.kategori;

    editIndex = index;
    document.getElementById("modal").classList.add("open");
}

/* Logika Hapus Data Teman */
function hapusData(index) {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus teman ini?");
    if (konfirmasi) {
        data.splice(index, 1); 
        renderTabelTeman();    
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

    // Update List Tampilan di halaman Kategori
    renderListKategori();
    
    // Update Dropdown di form teman & tugas
    updateDropdownKategori();

    inputKategori.value = "";
}

function renderListKategori() {
    const listHTML = dataKategori.map((item) => `
        <div class="list-item" style="border-left: 5px solid ${item.warnaKategori};">
            ${item.namaKategori}
        </div>
    `).join('');
    document.getElementById("list-data").innerHTML = listHTML;
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

/* Logika Modal */
function modal(){
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
modal()

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
    const sifat = document.getElementById("nama-sifat").value.trim()
    const deskripsi = document.getElementById("desc-sifat").value;
    const warna = document.getElementById("warna-sifat").value;
    let outputHtml = document.getElementById("list-sifat")

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
    })

    // Render List di halaman Sifat
    const dataSifatOutput = dataSifat.map((item) => `
    <div class="list-item" style="border-left: 5px solid ${item.warnaSifat};">
        <strong>${item.namaSifat}</strong><br>
        ${item.deskripsiSifat}
    </div>
    `).join('')
    outputHtml.innerHTML = dataSifatOutput;

    // Update Dropdown Sifat di Form Teman
    updateDropdownSifat();
    alert(`Sifat '${sifat}' berhasil ditambahkan!`);
    
    document.getElementById("nama-sifat").value = "";
    document.getElementById("desc-sifat").value = "";
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