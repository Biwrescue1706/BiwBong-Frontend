document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();
    await loadNavbar();
    loadEquipments();
});

async function loadEquipments() {
    try {
        const res = await fetch(`${backendURL}/equipments/getall`, {
            credentials: 'include'
        });

        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');

        const equipments = await res.json();

        equipments.sort((a, b) => a.EName.localeCompare(b.EName, 'th', { sensitivity: 'base' }));

        const tbody = document.getElementById('equipmentBody');
        tbody.innerHTML = '';

        equipments.forEach((e, index) => {
            const tr = document.createElement('tr');

            const borrowBtn = e.Available > 0
                ? `<button class="borrow-btn" onclick="borrowEquipment(${e.EID}, ${e.Available}, '${e.EName}')">ยืม</button>`
                : `<span style="color:gray;"></span>`;

            tr.innerHTML = `
                <td data-label="ลำดับ">${index + 1}</td>
                <td data-label="ชื่อ">${e.EName}</td>
                <td data-label="ทั้งหมด">${e.Total}</td>
                <td data-label="เหลือ">${e.Available}</td>
                <td data-label="จัดการ">
                    ${borrowBtn}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'โหลดข้อมูลอุปกรณ์ล้มเหลว',
            text: err.message,
        });
    }
}

window.borrowEquipment = async (EID, available, EName) => {
    const { value: formValues } = await Swal.fire({
        title: 'กรอกข้อมูลการยืม',
        html:
            `<input id="swal-input-name" class="swal2-input" placeholder="ชื่อผู้ยืม">` +
            `<input id="swal-input-qty" type="number" class="swal2-input" placeholder="จำนวน" min="1" max="${available}" value="1">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'ยืม',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const name = document.getElementById('swal-input-name').value.trim();
            const qty = Number(document.getElementById('swal-input-qty').value);

            if (!name) {
                Swal.showValidationMessage('กรุณากรอกชื่อผู้ยืม');
                return false;
            }

            if (!qty || qty < 1 || qty > available) {
                Swal.showValidationMessage(`กรุณาระบุจำนวนระหว่าง 1 ถึง ${available}`);
                return false;
            }

            return { name, qty };
        }
    });

    if (!formValues) return;

    try {
        const res = await fetch(`${backendURL}/borrows/getall/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                EquipmentID: EID,
                EName: EName,
                Quantity: formValues.qty,
                names: formValues.name
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'ยืมไม่สำเร็จ');
        }

        Swal.fire({
            icon: 'success',
            title: 'ยืมอุปกรณ์สำเร็จ',
            timer: 1500,
            showConfirmButton: false,
        });
        loadEquipments();

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
        });
    }
};
