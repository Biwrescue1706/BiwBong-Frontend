
document.addEventListener('DOMContentLoaded', async () => {
  await checkLogin();       // ตรวจสอบว่า login อยู่ไหม
  await loadNavbar();       // โหลด navbar (ถ้ามี nav.js)
  await loadEquipments();   // โหลดอุปกรณ์
});

// ✅ ตรวจสอบว่า login หรือไม่ (ถ้าไม่ได้ ให้ redirect)
async function checkLogin() {
  try {
    const user = await fetchUserProfile();

    // (ตัวอย่าง) แสดงชื่อในหน้า
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      usernameEl.textContent = user.Username || user.name || 'ไม่มีชื่อ';
    }

    return user;
  } catch (err) {
    console.warn('ยังไม่ได้เข้าสู่ระบบ:', err.message);
    window.location.href = 'index.html'; // redirect กลับหน้า login
  }
}

// ✅ โหลดข้อมูลอุปกรณ์
async function loadEquipments() {
  try {
    const res = await fetch(`${backendURL}/equipments/getall`, {
      credentials: 'include',
    });
    const equipments = await res.json();

    const table = document.getElementById('equipmentTableBody');
    table.innerHTML = '';

    equipments.forEach((e, index) => {
      table.innerHTML += `
        <tr>
            <td data-label="ลำดับ">${index + 1}</td>
            <td data-label="ชื่อ">${e.EName}</td>
            <td data-label="ทั้งหมด">${e.Total}</td>
            <td data-label="เหลือ">${e.Available}</td>
            <td data-label="การจัดการ">
                <button onclick="editEquipment('${e.EID}')">แก้ไข</button>
                <button onclick="deleteEquipment('${e.EID}')">ลบ</button>
            </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('โหลดข้อมูลอุปกรณ์ล้มเหลว', err);
  }
}

// ✅ ลบอุปกรณ์ (SweetAlert2)
async function deleteEquipment(id) {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบอุปกรณ์นี้ใช่หรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`${backendURL}/equipments/getall/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      });
      loadEquipments();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบข้อมูลได้',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: error.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
    });
  }
}