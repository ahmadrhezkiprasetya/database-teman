const formLogin = document.getElementById('form-login');
const inputNama = document.getElementById('nama-kamu');
const teksSapaan = document.getElementById('teks-sapaan');
const layarMasuk = document.getElementById('layar-masuk');
const layarApp = document.getElementById('layar-app');

// window.onload = function() {
//     const hari = new Date();
//     const formatnya = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     document.getElementById('hari-ini').innerText = hari.toLocaleDateString('id-ID', formatnya);
// }

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
/* Logika Tanggal */

/* Logika Jam */
function logikaJam(){
    let time = new Date()
    let jam = time.getHours();
    let menit = time.getMinutes();
    let detik = time.getSeconds();

    // Format agar selalu dua digit
    jam = (jam < 10) ? "0" + jam : jam;
    menit = (menit < 10) ? "0" + menit : menit;
    detik = (detik < 10) ? "0" + detik : detik;

    let tampilan = `${jam}:${menit}:${detik}`;
    
    // Pilih salah satu saja, .textContent lebih disarankan untuk performa
    document.getElementById("waktu-sekarang").textContent = tampilan;
}
setInterval(logikaJam, 1000);
logikaJam(); // Panggilan pertama agar tidak menunggu 1 detik
/* Logika Jam */

/* Database */
let data = [];
let dataKategori = [];
let dataSifat = [];
/* Database */

/* Logika CRUD */
function hasil(){
    const modalElement = document.getElementById("modal");
    const nama = document.getElementById("nama").value;
    const nomorHp = document.getElementById("nomorHp").value || 0;
    const gender = document.getElementById("kelamin").value || "Tidak terdefinisi";
    const lahir = document.getElementById("birth").value;

    if (nama === "" && nomorHp === 0){
        alert("Form harus diisi untuk menyimpan!");
        return;
    }

    data.push({
        nama: nama,
        hp: nomorHp,
        gender: gender,
        tanggalLahir: lahir
    })

    // const jumlahTeman = data.length
    // document.getElementById("total").innerHTML = `Total teman anda saat ini ${jumlahTeman}`;

    const tableRows = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.hp} <button type="button"  onclick="bukaWA('${item.hp}')">Kontak</button></td>
            <td>${item.gender}</td>
            <td>${item.tanggalLahir}</td>
        </tr>`).join('');

    // 3. Otomatis Tutup Modal
    modalElement.classList.remove("open");

    // 4. Berikan Notifikasi (Gunakan alert sederhana atau SweetAlert)
    alert("Berhasil! Data " + nama + " telah tersimpan ke database.");

    document.getElementById("hasil").innerHTML = `

        <table border="1">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>HP</th>
                    <th>Gender</th>
                    <th>Tgl Lahir</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
`;
    document.getElementById("formulir-crud-teman").reset();
}
/* Logika CRUD */

/* Logika CRUD Kategori */
function ambilKategori() {
    const kategori = document.getElementById("kategori-relasi").value.trim();
    const warna = document.getElementById("warna-kategori").value;

    let checkDouble = dataKategori.some(item => item.namaKategori.toLowerCase() === kategori.toLowerCase())

    if (checkDouble){
        alert("Kategori '" + kategori + "' sudah ada!");
        return;
    }
    // 1. Simpan ke Array
    dataKategori.push({
        namaKategori: kategori,
        warnaKategori: warna
    });

    // 2. Map data menjadi HTML (agar semua kategori muncul, bukan cuma yang terakhir)
    const listHTML = dataKategori.map((item) => `
        <div class="list-item" style="border-left: 5px solid ${item.warnaKategori};">
            ${item.namaKategori}
        </div>
    `).join('');

    // 3. Render ke Class .list-data
    const container = document.getElementById("list-data");
    if (container) {
        container.innerHTML = listHTML;
    }

}

/* Logika CRUD Kategori */

/* Logika Modal */
function modal(){
    const openBtn = document.getElementById("openModal");
    const closeBtn = document.getElementById("closeModal");
    const modal = document.getElementById("modal");

    openBtn.addEventListener("click", () => {
        modal.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    });
}
modal()
/* Logika Modal */

/* Logika buka whatsapp */
function bukaWA(nomor) { // Terima parameter nomor di sini
    let jamSekarang = new Date().getHours();
    let waktu = "Pagi";

    if (jamSekarang >= 11 && jamSekarang < 15) {
        waktu = "Siang";
    } else if (jamSekarang >= 15 && jamSekarang < 19) {
        waktu = "Sore";
    } else if (jamSekarang >= 19 || jamSekarang < 4) {
        waktu = "Malam";
    }

    // Menggunakan template literal untuk pesan yang lebih rapi
    let pesan = `Halo, Selamat ${waktu}! Saya tertarik dengan mobil Anda.`;
    let direct = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`; //encodeURIComponent() => untuk memberi spasi khusus pada url ke string yang ada

    window.open(direct, '_blank');
}   
/* Logika buka whatsapp */

/* Logika hitung teman */
function totalTeman(){
    let jumlah = data.length
    document.getElementById("total-teman").textContent = jumlah;
}
setInterval(totalTeman, 1000)
totalTeman()
/* Logika hitung teman */

/* Logika CRUD sifat */
function ambilSifat(){
    const sifat = document.getElementById("nama-sifat").value.trim()
    const deskripsi = document.getElementById("desc-sifat").value;
    const warna = document.getElementById("warna-sifat").value;
    let outputHtml = document.getElementById("list-sifat")

    const checkDouble = dataSifat.some(item => item.namaSifat.toLowerCase() === sifat.toLowerCase())
    if (checkDouble){
        alert(`Sifat '${sifat}' sudah terdaftar disistem!`)
        return
    } else {
        alert(`Sifat '${sifat}' berhasil ditambahkan!`)
    }

    dataSifat.push({
        namaSifat: sifat,
        deskripsiSifat: deskripsi,
        warnaSifat: warna
    })

    const dataSifatOutput = dataSifat.map((item) => `
    <div class="list-item" style="border-left: 5px solid ${item.warnaSifat};">
        <strong>${item.namaSifat}</strong><br>
        ${item.deskripsiSifat}
    </div>
    `).join('')

    outputHtml.innerHTML = dataSifatOutput;

}
/* Logika CRUD sifat*/