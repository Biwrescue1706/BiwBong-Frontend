import { formatDateThai } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();
    await loadNavbar();
    loadBorrowHistory();
});

async function loadBorrowHistory() {
    try {
        const res = await fetch(`${backendURL}/borrows/getall`, {
            credentials: 'include'
        });

        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');

        const { borrows } = await res.json();
        const tbody = document.getElementById('borrowTableBody');
        tbody.innerHTML = '';

        borrows.sort((a, b) => b.BorrowID - a.BorrowID); // เรียงล่าสุดขึ้นก่อน

        borrows.forEach((e, index) => {
            const isReturned = e.Returned;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="ลำดับ">${index + 1}</td>
                <td data-label="ชื่อคนดำเนินการ">${e.name}</td>
                <td data-label="ชื่อคนยืม">${e.names || '-'}</td>
                <td data-label="ชื่ออุปกรณ์">${e.EName}</td>
                <td data-label="จำนวน">${e.Quantity}</td>
                <td data-label="วันที่ยืม">${formatDateThai(e.Date)}</td>
                <td data-label="วันที่คืน">${e.ReturnDate ? formatDateThai(e.ReturnDate) : '-'}</td>
                <td data-label="สถานะ">${isReturned
                    ? '<span class="returned">คืนแล้ว</span>'
                    : `<button class="return-btn" onclick="returnEquipment(${e.BorrowID}, ${e.Quantity - (e.ReturnedQuantity || 0)})">คืน</button>`
                }
      </td>
    `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถโหลดประวัติการยืมได้',
            text: err.message,
        });
    }
}
window.returnEquipment = async (borrowID, maxQty) => {
    const { value: qty } = await Swal.fire({
        title: 'ระบุจำนวนที่ต้องการคืน',
        input: 'number',
        inputAttributes: {
            min: 1,
            max: maxQty,
            step: 1
        },
        inputValue: 1,
        showCancelButton: true,
        confirmButtonText: 'คืน',
        cancelButtonText: 'ยกเลิก',
        preConfirm: (value) => {
            const val = parseInt(value);
            if (!val || val < 1 || val > maxQty) {
                Swal.showValidationMessage(`กรุณาระบุจำนวนระหว่าง 1 ถึง ${maxQty}`);
                return false;
            }
            return val;
        }
    });

    if (!qty) return;

    try {
        const res = await fetch(`${backendURL}/returns/getall/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                BorrowID: borrowID,
                returnQuantity: qty
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'เกิดข้อผิดพลาด');
        }

        Swal.fire({
            icon: 'success',
            title: 'คืนอุปกรณ์สำเร็จ',
            timer: 1500,
            showConfirmButton: false
        });

        loadBorrowHistory(); // โหลดใหม่หลังคืน

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.message
        });
    }
};
