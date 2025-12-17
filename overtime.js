// ------------------------------------------- CONFIG ---------------------------------------------

const userid = localStorage.getItem("refid") || "UNKNOWN";
// const GAS_URL = "https://script.google.com/macros/s/AKfycbxhNJ_l_zrBYXyU-ktVWC0ZjFJaXmkXEs6BX_quhzEs1ZVp6iNuJ_rKh8hosI-y5JX7DA/exec";

// ------------------------------------------- UTILS ---------------------------------------------

function getCurrentDateTimeLocal() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}

function getTodayDateString() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
}

function formatOtTime(date) {
    if (!date || isNaN(date)) return "-";
    return date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function generateReference(date = new Date()) {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${userid}`;
}

// ฟังก์ชันแปลง decimal hours → "ชม. นาที"
function decimalToHrsMinutes(decimalHrs) {
  const hours = Math.floor(decimalHrs);
  const minutes = Math.round((decimalHrs - hours) * 60);
  return `${hours} ชม. ${minutes} นาที`;
}

// อ้างอิง input และ display div
const hoursInput = document.getElementById("hourslimit");
const hoursDisplay = document.getElementById("hoursDisplay");

// Event: ทุกครั้งที่ผู้ใช้กรอกหรือเปลี่ยนค่า
hoursInput.addEventListener("input", () => {
  const val = parseFloat(hoursInput.value);

  if (!isNaN(val) && val >= 1 && val <= 24) {
    hoursDisplay.textContent = decimalToHrsMinutes(val);
  } else {
    hoursDisplay.textContent = ""; // ล้างข้อความหากค่าไม่ถูกต้อง
  }
});


// ------------------------------------------- STORAGE ---------------------------------------------

function saveOtEntries() {
    localStorage.setItem("otEntries", JSON.stringify(otEntries));
}

function loadOtEntries() {
    const saved = localStorage.getItem("otEntries");
    return saved ? JSON.parse(saved) : [];
}

// -------------------------------------------------------- ส่งข้อมูล OT ไปยัง GAS --------------------------------------------------------
function saveOTToGAS(data) {
    // เพิ่มข้อมูลผู้ใช้
    data.userName = localStorage.getItem("name") || "unknown";
    data.userJob = localStorage.getItem("job") || "";
    data.office = localStorage.getItem("office") || "";
    data.userID = localStorage.getItem("refid") || "";
    data.userBoss = localStorage.getItem("boss") || "";

    console.log("🔧 Data ที่ส่งไป GAS:", data);

    if (!("otAmount" in data)) console.warn("⚠ ไม่มี otAmount ในข้อมูลที่ส่งไป GAS");
    if (!("totalHours" in data)) console.warn("⚠ ไม่มี totalHours ในข้อมูลที่ส่งไป GAS");

    Swal.fire({
        title: "กำลังส่งข้อมูล...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    const urlapidb = "https://script.google.com/macros/s/AKfycbxhNJ_l_zrBYXyU-ktVWC0ZjFJaXmkXEs6BX_quhzEs1ZVp6iNuJ_rKh8hosI-y5JX7DA/exec";

    return fetch(urlapidb, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        // ล้างสถานะเริ่มงาน
        localStorage.removeItem("otStartData");
        otStartTime = null;
        otEndTime = null;

        Swal.close();
        Swal.fire({
            icon: "success",
            title: "ส่งข้อมูลสำเร็จ",
            text: "บันทึกข้อมูลเรียบร้อยแล้ว",
            timer: 1500,
            showConfirmButton: false,
        });
        return res;
    })
    .catch(err => {
        Swal.close();
        Swal.fire({
            title: "ส่งข้อมูลไม่สำเร็จ",
            text: err.message,
            icon: "error",
            allowOutsideClick: false,
        });
        throw err;
    });
}


// ฟังก์ชัน global สำหรับอัปเดตรายงาน OT

function updateOtReport() {
    if (!window.otEntries) window.otEntries = [];

    // ทำลาย DataTable เดิมก่อน (ถ้ามี)
    if ($.fn.DataTable.isDataTable("#otReport")) {
        $("#otReport").DataTable().clear().destroy();
    }

    // สร้าง array ของ row
    const data = window.otEntries.map((entry, i) => {
        let statusColor = entry.status === "สำเร็จ" ? "text-success" :
                          entry.status === "ผิดพลาด" ? "text-danger" : "text-secondary";

        return [
            i + 1,
            entry.date || "-",
            entry.start || "-",
            entry.end || "-",
            entry.duration || "-",
            `<span class="${statusColor}">${entry.status || "-"}</span>`,
            entry.note || "-",
            entry.reference || "-",
            entry.stamp ? new Date(entry.stamp).toLocaleString("th-TH") : "-"
        ];
    });

    // สร้าง DataTable ใหม่
    $("#otReport").DataTable({
        data: data,
        columns: [
            { title: "ลำดับ" },
            { title: "วันที่" },
            { title: "เริ่ม" },
            { title: "สิ้นสุด" },
            { title: "ระยะเวลา" },
            { title: "สถานะ" },
            { title: "หมายเหตุ" },
            { title: "อ้างอิง" },
            { title: "Stamp" }
        ],
                language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json",
        },
        order: [[1, "desc"], [2, "desc"]], // เรียงวันที่+เวลา ใหม่→เก่า
        pageLength: 30,
        lengthMenu: [
            [10, 30, 50, 100, 150, -1],
            [10, 30, 50, 100, 150, "ทั้งหมด"]
        ],
        responsive: true,
        dom: "lBfrtip",
    });
}



// --------------------------------------------- ฟังก์ชันกลางสำหรับส่ง OT และอัปเดตรายงาน ---------------------------------------------

async function submitOTEntry({ startTime, endTime, autoClosed = false, note = "" }) {
    if (!startTime) return;

    const durationMs = endTime - startTime;
    const totalMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const durationStr = `${hours} ชั่วโมง ${mins} นาที`;
    const rate = parseFloat(localStorage.getItem("otRate") || "0");
    const totalHours = hours + (mins / 60);
    const otAmount = (totalHours * rate).toFixed(2);

    const now = new Date();
    const ref = generateReference(now);

    const data = {
        staffName: localStorage.getItem("otStaffName") || "-",
        rate: rate,
        startTime: formatOtTime(startTime),
        endTime: endTime instanceof Date ? formatOtTime(endTime) : endTime,
        duration: durationStr,
        totalHours: totalHours.toFixed(2),
        otAmount,
        stamp: now.getTime(),
        date: startTime.toISOString().slice(0,10),
        autoClosed,
        reference: ref
    };

    // ✅ เพิ่มหน้าต่างยืนยันก่อนส่ง
    const { isConfirmed } = await Swal.fire({
        title: autoClosed ? 'ยืนยันส่ง OT อัตโนมัติ?' : 'ยืนยันส่ง OT?',
        html: `
            วันที่: <b>${data.date}</b><br>
            เวลาเริ่ม: <b>${data.startTime}</b><br>
            เวลาเลิก: <b>${data.endTime}</b><br>
            รวมเวลา: <b>${totalHours.toFixed(2)} ชั่วโมง</b><br>
            ค่าตอบแทน: <b>${otAmount} บาท</b>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ส่งข้อมูล',
        cancelButtonText: 'ยกเลิก',
        allowOutsideClick: false
    });

    if (!isConfirmed) return; // ถ้ายกเลิก → ออกจากฟังก์ชัน

    // ส่งข้อมูลไป GAS
    try {
        await saveOTToGAS(data);

        otEntries.push({
            stamp: now.getTime(),
            date: data.date,
            start: data.startTime,
            end: data.endTime,
            duration: durationStr,
            totalHours: totalHours.toFixed(2),
            otAmount,
            status: "สำเร็จ",
            note: note || (autoClosed ? "ส่งโดยระบบ (Auto)" : "ส่งโดยผู้ใช้"),
            reference: ref
        });
        otDurationText.textContent = durationStr;
        saveOtEntries();
        updateOtReport();

        if (autoClosed) {
            Swal.fire({
                icon: "warning",
                title: "พบการทำงานค้างวัน",
                html: `ระบบได้ส่งข้อมูลของวันที่ <b>${data.date}</b><br>โดยสิ้นสุดงานเวลา <b>${data.endTime}</b><br>
                       คิดเป็นเวลา <b>${totalHours.toFixed(2)} ชั่วโมง</b><br>
                       ค้างชำระ <b>${otAmount} บาท</b>`,
                confirmButtonText: "ตกลง",
                allowOutsideClick: false,
            });
        }

    } catch(err) {
        Swal.fire({
            title: "เกิดข้อผิดพลาดในการส่งข้อมูล OT",
            text: err.message,
            icon: "error",
            allowOutsideClick: false,
        });
    }
}



// ------------------------------------------- AUTO SEND ---------------------------------------------

// ส่งอัตโนมัติเมื่อค้างวัน
function sendOTDataAutoClose(prevDate, startISO) {
    const startTime = new Date(startISO);

    // ดึง hourslimit จาก localStorage (ชั่วโมง)
    const hourslimit = parseFloat(localStorage.getItem("hourslimit") || "4");

    if (isNaN(startTime) || isNaN(hourslimit)) {
        console.error("❌ Invalid start time or hourslimit", startISO, hourslimit);
        return;
    }

    // สร้างเวลาเลิกงานจาก start + hourslimit
    const endTime = new Date(startTime.getTime() + hourslimit * 60 * 60 * 1000);

    // เรียก submitOTEntry ให้ส่งไป GAS
    submitOTEntry({
        startTime,
        endTime,
        autoClosed: true,
        note: "ส่งโดยระบบ (Auto)"
    });
    
}



// ------------------------------------------- MAIN ---------------------------------------------

window.addEventListener("load", () => {
    let otStartTime = null;
    let otEndTime = null;
    let otReportVisible = false;

    window.otEntries = loadOtEntries();

    const otStartBtn = document.getElementById("otStartBtn");
    const otEndBtn = document.getElementById("otEndBtn");
    const otResetBtn = document.getElementById("otResetBtn");
    const otToggleReportBtn = document.getElementById("otToggleReportBtn");
    const otStartDateText = document.getElementById("otStartDateText");
    const otStartTimeText = document.getElementById("otStartTimeText");
    const otEndTimeText = document.getElementById("otEndTimeText");
    const otDurationText = document.getElementById("otDurationText");
    const otReportBody = document.getElementById("otReportBody");
    const otReportTableWrapper = document.getElementById("otReportTableWrapper");
    const otRateInput = document.getElementById("otRate");
    const otRateDayInput = document.getElementById("otRateDay");
    const otStaffNameInput = document.getElementById("otStaffName");
    const hourslimitInput = document.getElementById("hourslimit");
    const otAutoEndTimeInput = document.getElementById("otAutoEndTime");
    const savedLat = localStorage.getItem("mylat");
    const savedLon = localStorage.getItem("mylon");


    otToggleReportBtn.addEventListener("click", () => {
        otReportVisible = !otReportVisible;
        otReportTableWrapper.style.display = otReportVisible ? "block" : "none";
        otToggleReportBtn.innerHTML = otReportVisible
            ? '<i class="fas fa-eye-slash me-1"></i> ซ่อนรายงาน'
            : '<i class="fas fa-eye me-1"></i> แสดงรายงาน';
    });

document.getElementById("otConfigModal").addEventListener("show.bs.modal", () => {
    otRateInput.value = localStorage.getItem("otRate") || "";
    otRateDayInput.value = localStorage.getItem("otRateDay") || "";
    otAutoEndTimeInput.value = localStorage.getItem("otAutoEndTime") || "20:30";
    hourslimitInput.value = localStorage.getItem("hourslimit") || 4;

    loadOtConfigByRefid();

    displayStaffGeneric("otStaffName", "otStaffName", "-- เลือกผู้ควบคุม --");
    displayStaffGeneric("otApprover", "otApproverName", "-- เลือกผู้อนุมัติ --");
    displayStaffGeneric("otPayer", "otPayerName", "-- เลือกผู้จ่ายเงิน --");
});


    document.getElementById("otSaveConfigBtn").addEventListener("click", () => {
        const name = otStaffNameInput.value.trim();
        const rate = otRateInput.value.trim();
        const rateDay = otRateDayInput.value.trim();
        const autoEndTime = otAutoEndTimeInput.value.trim();
        const hourslimit = hourslimitInput.value.trim();
        const approver = document.getElementById("otApprover").value.trim();
const payer = document.getElementById("otPayer").value.trim();

        if (!name)
            return Swal.fire({ title: "แจ้งเตือน", text: "กรุณากำหนดผู้ควบคุม", icon: "warning", allowOutsideClick: false });
        if (!approver)
  return Swal.fire({ title: "แจ้งเตือน", text: "กรุณาเลือกผู้อนุมัติ", icon: "warning" });
if (!payer)
  return Swal.fire({ title: "แจ้งเตือน", text: "กรุณาเลือกผู้จ่ายเงิน", icon: "warning" });
        if (!rateDay || isNaN(rateDay) || rateDay <= 0)
            return Swal.fire({ title: "แจ้งเตือน", text: "กรุณากรอกอัตราต่อวัน", icon: "warning", allowOutsideClick: false });
        if (!rate || isNaN(rate) || rate <= 0)
            return Swal.fire({ title: "แจ้งเตือน", text: "กรุณากรอกอัตราต่อชั่วโมง", icon: "warning", allowOutsideClick: false });
        if (!autoEndTime)
            return Swal.fire({ title: "แจ้งเตือน", text: "กรุณากำหนดเวลา", icon: "warning", allowOutsideClick: false });
        if (!hourslimit || isNaN(hourslimit) || hourslimit < 1 || hourslimit > 24)
            return Swal.fire({ title: "แจ้งเตือน", text: "กรุณากรอกจำนวนชั่วโมง", icon: "warning", allowOutsideClick: false });

        localStorage.setItem("otAutoEndTime", autoEndTime);
        localStorage.setItem("otStaffName", name);
        localStorage.setItem("otApproverName", approver);
localStorage.setItem("otPayerName", payer);
        localStorage.setItem("otRate", rate);
        localStorage.setItem("otRateDay", rateDay);
        localStorage.setItem("hourslimit", hourslimit);

        const modalEl = document.getElementById("otConfigModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();

        modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
                document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
                document.body.classList.remove("modal-open");
                document.body.style.overflow = '';

Swal.fire({
    title: "กำลังบันทึกข้อมูล...",
    icon: "info",
    allowOutsideClick: false,
    showConfirmButton: false
});

// ดึงค่าเดิมจาก localStorage
const refid = localStorage.getItem("refid") || "";
const staffNameLocal = localStorage.getItem("name") || "";
const staffJobLocal = localStorage.getItem("job") || "";

const data = {
    otAutoEndTime: autoEndTime,
    otStaffName: name,
    otApprover: approver,
    otPayer: payer,
    otRate: rate,
    otRateDay: rateDay,
    hourslimit: hourslimit,
    refid,
    staffName: staffNameLocal,
    job: staffJobLocal
};


console.log("Data to save to GAS:", data);

// ส่งไปเก็บใน Google Apps Script
saveToGAS(data).then(() => {
    Swal.fire({
        title: "บันทึกข้อมูลเรียบร้อย",
        icon: "success",
        allowOutsideClick: false,
    }).then(() => location.reload());
});


            },
            { once: true }
        );
    });


    //  ส่งข้อมูล config ไปยัง GAS 
    function saveToGAS(data) {
    
            const urlapidb = "https://script.google.com/macros/s/AKfycbw5jciw6NO_j2ryQgC1EF2DuPt9fN1OrUchjSCuZVNeSNOwa-HvE0kZCqXqADBiK6A/exec";
     

    return fetch(urlapidb, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}


    // โหลดข้อมูลเริ่มงานค้างถ้ามี และตรวจสอบวัน
    const saved = localStorage.getItem("otStartData");
    if (saved) {
        const data = JSON.parse(saved);
        if (data.date === getTodayDateString()) {
            otStartTime = new Date(data.iso);
            otStartDateText.textContent = data.date;
            otStartTimeText.textContent = data.time;
        } else {
            sendOTDataAutoClose(data.date, data.iso);
        }
    }

 
    // ---------------------------------------------------------------------------- ปุ่มเริ่มงาน ----------------------------------------------------------------------------

    otStartBtn.addEventListener("click", async () => {

        if (!savedLat && !savedLon) {
            return Swal.fire({
                title: "แจ้งเตือน",
                text: `ไม่พบข้อมูลตำแหน่งปัจจุบัน กรุณาเปิดใช้งาน GPS และตรวจสอบสิทธิ์การเข้าถึงตำแหน่ง`,
                icon: "info",
                allowOutsideClick: false
            });
        }

        if (otStartTime) {
            return Swal.fire({
                title: "แจ้งเตือน",
                text: `วันที่ ${otStartDateText.textContent} คุณได้เริ่มงานแล้ว เวลา: ${otStartTimeText.textContent}`,
                icon: "info",
                allowOutsideClick: false
            });
        }

        if (!localStorage.getItem("otRate")) {
            return Swal.fire({
                title: "แจ้งเตือน",
                text: "ยังไม่ได้ตั้งค่าอัตราค่าตอบแทน",
                icon: "warning",
                allowOutsideClick: false,
            }).then(() => {
                new bootstrap.Modal(document.getElementById("otConfigModal")).show();
            });
        }

        const defaultDateTime = getCurrentDateTimeLocal();
        const { isConfirmed, value: dateTimeStr } = await Swal.fire({
            title: "ยืนยันเวลาเริ่มงาน",
            html: `<input type="datetime-local" id="otDateTimePicker" class="swal2-input" value="${defaultDateTime}" />`,
            showCancelButton: true,
            confirmButtonText: "เริ่มงาน",
            cancelButtonText: "ยกเลิก",
            allowOutsideClick: false,
            preConfirm: () => document.getElementById("otDateTimePicker").value
        });

        if (isConfirmed && dateTimeStr) {
            const selectedStartTime = new Date(dateTimeStr);

            // ห้ามเลือกวันที่มากกว่าวันนี้
            const selectedDateOnly = new Date(selectedStartTime.getFullYear(), selectedStartTime.getMonth(), selectedStartTime.getDate());
            const today = new Date();
            const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            if (selectedDateOnly > todayDateOnly) {
                return Swal.fire({
                    title: "ผิดพลาด",
                    text: "ไม่สามารถเลือกวันที่มากกว่าวันนี้ได้",
                    icon: "error",
                    allowOutsideClick: false
                });
            }

            // ห้ามเริ่มงานในช่วงเวลางานปกติ (8:30-16:30)
            const selectedDateStr = selectedStartTime.toLocaleDateString("th-TH");
            const datechecktoday = localStorage.getItem("datecheck");

            const startHours = selectedStartTime.getHours();
            const startMinutes = selectedStartTime.getMinutes();

            const isWorkingHours = (
                (selectedDateStr === datechecktoday &&
                    (
                        (startHours > 8 || (startHours === 8 && startMinutes >= 30)) &&
                        (startHours < 16 || (startHours === 16 && startMinutes <= 30))
                    )
                )
            );

            if (isWorkingHours) {
                return Swal.fire({
                    title: "ไม่สามารถเริ่มงานได้",
                    text: "ไม่อนุญาตให้เริ่มงานโอทีในช่วงเวลาทำงาน (08:30-16:30)",
                    icon: "error",
                    allowOutsideClick: false
                });
            }

            otStartTime = selectedStartTime;
            const timeStr = formatOtTime(otStartTime);
            const dateStr = selectedStartTime.toISOString().slice(0, 10);
            otStartDateText.textContent = dateStr;
            otStartTimeText.textContent = timeStr;
            otEndTime = null;
            otEndTimeText.textContent = "-";
            otDurationText.textContent = "-";

            localStorage.setItem("otStartData", JSON.stringify({
                date: dateStr,
                time: timeStr,
                iso: otStartTime.toISOString(),
            }));

            Swal.fire({
                title: "เริ่มงานแล้ว",
                text: `${dateStr}\nเวลา: ${timeStr}`,
                icon: "success",
                allowOutsideClick: false
            });
        }
    });

    // ---------------------------------------------------------------------------- ปุ่มเริ่มเลิกงาน ----------------------------------------------------------------------------

otEndBtn.addEventListener("click", async () => {
    if (!otStartTime) {
        return Swal.fire({
            title: "แจ้งเตือน",
            text: "ยังไม่ได้เริ่มงาน",
            icon: "warning",
            allowOutsideClick: false,
        });
    }

    if (!localStorage.getItem("hourslimit")) {
        return Swal.fire({
            title: "แจ้งเตือน",
            text: "ยังไม่ได้กำหนดจำนวนชั่วโมง",
            icon: "warning",
            allowOutsideClick: false,
        }).then(() => {
            new bootstrap.Modal(document.getElementById("otConfigModal")).show();
        });
    }

    const defaultDateTime = getCurrentDateTimeLocal();
    const { isConfirmed, value: dateTimeStr } = await Swal.fire({
        title: "ยืนยันเวลาเลิกงาน",
        html: `<input type="datetime-local" id="otDateTimePicker" class="swal2-input" value="${defaultDateTime}" />`,
        showCancelButton: true,
        confirmButtonText: "เลิกงาน",
        cancelButtonText: "ยกเลิก",
        allowOutsideClick: false,
        preConfirm: () => document.getElementById("otDateTimePicker").value
    });

    if (isConfirmed && dateTimeStr) {
        const selectedEndTime = new Date(dateTimeStr);

        // วันที่ต้องตรงกับวันเริ่มงาน
        if (
            selectedEndTime.getFullYear() !== otStartTime.getFullYear() ||
            selectedEndTime.getMonth() !== otStartTime.getMonth() ||
            selectedEndTime.getDate() !== otStartTime.getDate()
        ) {
            return Swal.fire({
                title: "แจ้งเตือน",
                text: "วันที่เลิกงานต้องตรงกับวันเริ่มงาน",
                icon: "warning",
                allowOutsideClick: false,
            });
        }

        const hourslimit = Number(localStorage.getItem("hourslimit"));
        const durationMs = selectedEndTime - otStartTime;

        if (durationMs <= 0) {
            return Swal.fire({
                title: "แจ้งเตือน",
                text: "เวลาเลิกงานต้องมากกว่าเวลาเริ่มงาน",
                icon: "warning",
                allowOutsideClick: false,
            });
        }

const durationHrs = durationMs / (60 * 60 * 1000);

if (durationHrs < hourslimit) {
  return Swal.fire({
    title: "แจ้งเตือน",
    text: `เวลาทำงาน ${decimalToHrsMinutes(durationHrs)} 
ยังไม่ครบ ${decimalToHrsMinutes(hourslimit)}`,
    icon: "warning",
    allowOutsideClick: false,
  });
}

        otEndTime = selectedEndTime;
        otEndTimeText.textContent = formatOtTime(otEndTime);
        
        // เรียกฟังก์ชันกลาง submitOTEntry
        await submitOTEntry({
            startTime: otStartTime,
            endTime: otEndTime,
            autoClosed: false,
            note: "ส่งโดยผู้ใช้"
        });

    }
});



    function formatOtTime(date) {
        if (!date || isNaN(date)) return "-";
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }




    // ปุ่มรีเซ็ต
    otResetBtn.addEventListener("click", () => {
        Swal.fire({
            title: "ยืนยัน",
            text: "ต้องการล้างข้อมูลทั้งหมดหรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ล้างข้อมูล",
            cancelButtonText: "ยกเลิก",
            allowOutsideClick: false,
        }).then(({ isConfirmed }) => {
            if (!isConfirmed) return;
            otEntries.length = 0;
            saveOtEntries();
            updateOtReport();

            localStorage.removeItem("otStartData");
            otStartTime = null;
            otEndTime = null;
            otStartDateText.textContent = "-";
            otStartTimeText.textContent = "-";
            otEndTimeText.textContent = "-";
            otDurationText.textContent = "-";

            Swal.fire({
                icon: "success",
                title: "ล้างข้อมูลเรียบร้อยแล้ว",
                allowOutsideClick: false,
            });
        });
    });

    updateOtReport();
});



// ------------------------------------------- STAFF LOADER ---------------------------------------------

async function displayStaffGeneric(selectId, storageKey, placeholderText) {
    const staffSelect = document.getElementById(selectId);
    const savedStaff = localStorage.getItem(storageKey);
    const refid = localStorage.getItem("refid");
    const mainsub = localStorage.getItem("mainsub");
    const office = localStorage.getItem("office");

    if (savedStaff && staffSelect.options.length === 0) {
        const opt = document.createElement("option");
        opt.value = savedStaff;
        opt.textContent = savedStaff;
        opt.selected = true;
        staffSelect.appendChild(opt);
    }

    if (staffSelect.options.length > 0) return;

    try {
        Swal.fire({
            title: 'กำลังโหลดข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

      const isAllOffice = localStorage.getItem("staffScopeAll") === "1";

const url =
  "https://script.google.com/macros/s/AKfycbwX-bK4nJM53d_BGgiJP-vZsTz-t7uu_BIPFFNY-ITxYBGJT9JWfev8jbY_ICleCHwEtA/exec" +
  `?xmain=${mainsub}` +
  (isAllOffice ? "" : `&xsub=${office}`);

const response = await fetch(url);


        const data = await response.json();
        Swal.close();

        staffSelect.innerHTML = "";

        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = placeholderText;
        staffSelect.appendChild(emptyOption);

        data.role.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = item.name;

            if (savedStaff === item.name || item.id == refid) {
                option.selected = true;
            }

            staffSelect.appendChild(option);
        });

    } catch (err) {
        Swal.close();
        Swal.fire("Error", err.message, "error");
    }
}


function clearStaffGeneric(selectId, storageKey) {
    localStorage.removeItem(storageKey);
    const select = document.getElementById(selectId);
    select.innerHTML = "";

    Swal.fire({
        icon: "info",
        title: "เลือกใหม่",
        timer: 800,
        showConfirmButton: false,
        didClose: () => {
            displayStaffGeneric(
                selectId,
                storageKey,
                "-- เลือกใหม่ --"
            );
        }
    });
}


const staffScopeSwitch = document.getElementById("staffScopeSwitch");
const staffScopeLabel  = document.getElementById("staffScopeLabel");

// ค่าเริ่มต้น = เฉพาะหน่วยงาน
const savedScope = localStorage.getItem("staffScopeAll");
staffScopeSwitch.checked = savedScope === "1";
updateStaffScopeLabel();

// เมื่อเปลี่ยนสถานะ
staffScopeSwitch.addEventListener("change", () => {
    localStorage.setItem(
        "staffScopeAll",
        staffScopeSwitch.checked ? "1" : "0"
    );
    updateStaffScopeLabel();

    // reload dropdown ทั้งหมด
    ["otStaffName","otApprover","otPayer"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = "";
    });

    displayStaffGeneric("otStaffName","otStaffName","-- เลือกผู้ควบคุม --");
    displayStaffGeneric("otApprover","otApproverName","-- เลือกผู้อนุมัติ --");
    displayStaffGeneric("otPayer","otPayerName","-- เลือกผู้จ่ายเงิน --");
});

function updateStaffScopeLabel() {
    staffScopeLabel.textContent = staffScopeSwitch.checked
        ? "แสดงตัวเลือกทุกกลุ่มงาน/หน่วยงาน"
        : "แสดงตัวเลือกเฉพาะกลุ่มงาน/หน่วยงาน";
}


async function loadOtConfigByRefid() {
  const refid = localStorage.getItem("refid");
  if (!refid) return;

  const otStaffNameInput = document.getElementById("otStaffName");
  const otApproverInput = document.getElementById("otApprover");
  const otPayerInput = document.getElementById("otPayer");
  const otRateInput = document.getElementById("otRate");
  const otRateDayInput = document.getElementById("otRateDay");
  const otAutoEndTimeInput = document.getElementById("otAutoEndTime");
  const hourslimitInput = document.getElementById("hourslimit");

  // ถ้า localStorage มีค่า → ไม่ต้องโหลด
  if (localStorage.getItem("otStaffName")) return;

  try {
    Swal.fire({
      title: "กำลังโหลดค่าเดิม...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const response = await fetch(`https://script.google.com/macros/s/AKfycbwzkU5vfELuNJYDJq-JLG9UNCWrRQtkH0BedmnlzlKHFKoGTUKDWL5zvbSH0ahg_H4K1Q/exec?type=getOtConfigByRefid&refid=${refid}`);
    const data = await response.json();
    Swal.close();

    if (!data.roles || data.roles.length === 0) return;

    const record = data.roles[0];

    // เติม dropdown
    [ {el: otStaffNameInput, val: record.staffRaw},
      {el: otApproverInput, val: record.approverRaw},
      {el: otPayerInput, val: record.payerRaw} ].forEach(o => {
      const opt = document.createElement("option");
      opt.value = o.val;
      opt.textContent = o.val;
      opt.selected = true;
      o.el.appendChild(opt);
    });

    // เติมค่าอื่น ๆ
    otRateInput.value = record.otRate || "";
    otRateDayInput.value = record.otRateDay || "";
    otAutoEndTimeInput.value = record.otAutoEndTime || "20:30";
    hourslimitInput.value = record.hourslimit || 4;

  } catch (error) {
    Swal.close();
    console.error("โหลด OT config ไม่สำเร็จ:", error);
  }
}
