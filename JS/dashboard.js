
document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar(); // จาก nav.js
  await loadEquipments(); // โหลดข้อมูลอุปกรณ์
});

async function loadEquipments() {
  try {
    const res = await fetch(`${backendURL}/equipments/getall`, {
      credentials: 'include',
    });
    const equipments = await res.json();

    const table = document.getElementById('equipmentTableBody');
    table.innerHTML = '';

    equipments.forEach(e => {
      table.innerHTML += `
        <tr>
          <td>${e.EID}</td>
          <td>${e.EName}</td>
          <td>${e.Total}</td>
          <td>${e.Available}</td>
          <td>
            <button onclick="editEquipment('${e._id}')">แก้ไข</button>
            <button onclick="deleteEquipment('${e._id}')">ลบ</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('โหลดข้อมูลอุปกรณ์ล้มเหลว', err);
  }
}

async function addEquipment(data) {
  const res = await fetch(`${backendURL}/equipments/getall/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

async function editEquipment(id) {
  // ตัวอย่างเปิด modal แก้ไข แล้วค่อย PUT
  const res = await fetch(`${backendURL}/equipments/getall/${id}`, {
    method: 'PUT',
    credentials: 'include',
  });
  const data = await res.json();
  // โค้ดเปิด form / modal ที่แสดงค่า data
  // เมื่อ user กด save -> เรียก updateEquipment(id, updatedData)
}

async function updateEquipment(id, updatedData) {
  const res = await fetch(`${backendURL}/equipments/getall/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updatedData),
  });
  return res.json();
}

async function deleteEquipment(id) {
  const confirmed = confirm('คุณแน่ใจว่าต้องการลบ?');
  if (!confirmed) return;

  const res = await fetch(`${backendURL}/equipments/getall/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.ok) {
    alert('ลบสำเร็จ');
    loadEquipments();
  } else {
    alert('เกิดข้อผิดพลาด');
  }
}

async function borrowEquipment(data) {
  const res = await fetch(`${backendURL}/borrows/getall/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}
