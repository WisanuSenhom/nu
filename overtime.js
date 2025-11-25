// ------------------------------------------- CONFIG ---------------------------------------------

const userid = localStorage.getItem("refid") || "UNKNOWN";
const GAS_URL = "https://script.google.com/macros/s/PASTE_YOUR_SCRIPT_URL_HERE/exec";

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

// ------------------------------------------- STORAGE ---------------------------------------------

function saveOtEntries() {
    localStorage.setItem("otEntries", JSON.stringify(otEntries));
}

function loadOtEntries() {
    const saved = localStorage.getItem("otEntries");
    return saved ? JSON.parse(saved) : [];
}

// ------------------------------------------- AUTO SEND ---------------------------------------------

function sendOTDataAutoClose(prevDate, startISO) {
    const startTime = new Date(startISO);
    const autoEndTime = localStorage.getItem("otAutoEndTime") || "20:30";
    const endTime = new Date(`${prevDate}T${autoEndTime}:00`);
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const duration = `${hours} ชั่วโมง ${mins} นาที`;
    const now = new Date();
    const ref = generateReference(now);

    fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            staffName: localStorage.getItem("otStaffName") || "-",
            rate: localStorage.getItem("otRate") || "0",
            startTime: formatOtTime(startTime),
            endTime: autoEndTime + ":00",
            duration,
            stamp: now.getTime(),
            date: prevDate,
            autoClosed: true,
            reference: ref,
        }),
    })
    .then(() => {
        otEntries.push({
            stamp: now.getTime(),
            date: prevDate,
            start: formatOtTime(startTime),
            end: autoEndTime + ":00",
            duration,
            status: "สำเร็จ",
            note: "ส่งโดยระบบ (Auto)",
            reference: ref,
        });
        saveOtEntries();
        updateOtReport();

        Swal.fire({
            icon: "warning",
            title: "พบการทำงานค้างวัน",
            html: `ระบบได้ส่งข้อมูลของวันที่ <b>${prevDate}</b><br>โดยสิ้นสุดงานเวลา <b>${autoEndTime}:00</b>`,
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
        });
    })
    .catch((err) => {
        Swal.fire({
            title: "เกิดข้อผิดพลาดในการส่งข้อมูลอัตโนมัติ",
            text: err.message,
            icon: "error",
            allowOutsideClick: false,
        });
    });

    localStorage.removeItem("otStartData");
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

    function updateOtReport() {
        otReportBody.innerHTML = "";
        if (otEntries.length === 0) {
            otReportBody.innerHTML = '<tr><td colspan="9" class="text-center">ยังไม่มีข้อมูล</td></tr>';
            return;
        }
        otEntries.forEach((entry, i) => {
            let statusColor = entry.status === "สำเร็จ" ? "text-success" :
                              entry.status === "ผิดพลาด" ? "text-danger" : "text-secondary";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${entry.date}</td>
                <td>${entry.start}</td>
                <td>${entry.end}</td>
                <td>${entry.duration}</td>
                <td class="${statusColor}">${entry.status || "-"}</td>
                <td>${entry.note || "-"}</td>
                <td>${entry.reference || "-"}</td>
                <td>${entry.stamp ? new Date(entry.stamp).toLocaleString("th-TH") : "-"}</td>
            `;
            otReportBody.appendChild(row);
        });
    }

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
        otStaffNameInput.value = localStorage.getItem("otStaffName") || "";
        otAutoEndTimeInput.value = localStorage.getItem("otAutoEndTime") || "20:30";
        hourslimitInput.value = localStorage.getItem("hourslimit") || 4;
    });

    document.getElementById("otSaveConfigBtn").addEventListener("click", () => {
        const name = otStaffNameInput.value.trim();
        const rate = otRateInput.value.trim();
        const rateDay = otRateDayInput.value.trim();
        const autoEndTime = otAutoEndTimeInput.value.trim();
        const hourslimit = hourslimitInput.value.trim();

        if (!name)
            return Swal.fire({ title: "แจ้งเตือน", text: "กรุณากรอกชื่อ", icon: "warning", allowOutsideClick: false });
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
                    title: "บันทึกข้อมูลแล้ว",
                    icon: "success",
                    allowOutsideClick: false,
                });
            },
            { once: true }
        );
    });

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

    // ปุ่มเริ่มงาน
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

    // ปุ่มเลิกงาน
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

            // เช็ควันที่เลิกงานต้องตรงกับวันเริ่มงาน
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

            otEndTime = selectedEndTime;

            const hourslimit = Number(localStorage.getItem("hourslimit"));
            let durationMs = otEndTime - otStartTime;

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
                    text: `เวลาทำงาน ${durationHrs.toFixed(2)} ชั่วโมง ยังไม่ครบ ${hourslimit} ชั่วโมง`,
                    icon: "warning",
                    allowOutsideClick: false,
                });
            }

            otEndTimeText.textContent = formatOtTime(otEndTime);
            const totalMinutes = Math.floor(durationMs / 60000);
            const hours = Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            const duration = `${hours} ชั่วโมง ${mins} นาที`;

            otDurationText.textContent = duration;

            const now = new Date();
            const ref = generateReference(now);

            otEntries.push({
                stamp: now.getTime(),
                date: otStartTime.toISOString().slice(0, 10),
                start: formatOtTime(otStartTime),
                end: formatOtTime(otEndTime),
                duration,
                status: "กำลังส่งข้อมูล...",
                note: "ส่งโดยผู้ใช้",
                reference: ref,
            });
            saveOtEntries();
            updateOtReport();

            fetch(GAS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    staffName: localStorage.getItem("otStaffName") || "-",
                    rate: localStorage.getItem("otRate") || "0",
                    startTime: formatOtTime(otStartTime),
                    endTime: formatOtTime(otEndTime),
                    duration,
                    stamp: now.getTime(),
                    date: otStartTime.toISOString().slice(0, 10),
                    reference: ref,
                }),
            })
            .then(res => {
                if (!res.ok) throw new Error("ไม่สามารถส่งข้อมูลได้");
                otEntries[otEntries.length - 1].status = "สำเร็จ";
                saveOtEntries();
                updateOtReport();
            })
            .catch((err) => {
                otEntries[otEntries.length - 1].status = "ผิดพลาด";
                saveOtEntries();
                updateOtReport();
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: `ส่งข้อมูลไม่สำเร็จ: ${err.message}`,
                    icon: "error",
                    allowOutsideClick: false,
                });
            });

            localStorage.removeItem("otStartData");
            otStartTime = null;
            otEndTime = null;
            // otStartDateText.textContent = "-";
            // otStartTimeText.textContent = "-";
            // otEndTimeText.textContent = "-";
            // otDurationText.textContent = "-";
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

async function displayStaff() { 
    const staffSelect = document.getElementById("otStaffName");
    const savedStaff = localStorage.getItem("otStaffName"); // ชื่อผู้ควบคุมที่เคยเลือก
    const refid = localStorage.getItem("refid");
    const mainsub = localStorage.getItem("mainsub");

    // ถ้ามีค่าที่เคยเลือก ให้แสดงใน dropdown ก่อน (ป้องกันว่าง)
    if (savedStaff && staffSelect.options.length === 0) {
        const opt = document.createElement("option");
        opt.value = savedStaff;
        opt.textContent = savedStaff;
        opt.selected = true;
        staffSelect.appendChild(opt);
    }

    // ถ้ามี option มากกว่า 1 → แปลว่าโหลด API แล้ว → ไม่ต้องโหลดอีก
    if (staffSelect.options.length > 0) {
        console.log("Staff already loaded. Skip API.");
        return;
    }

    try {
        Swal.fire({
            title: 'กำลังโหลดข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbzlanx_NXl5qy1mlvQP6oMl6zElUxDJ9nLUiZEqIHO0RKP7OcxkHKo5n_XUb-5UEHRN/exec?xmain=${mainsub}&updateby=${localStorage.getItem("name")}`
        );

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        Swal.close();

        staffSelect.innerHTML = "";

        // option ว่าง
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "-- เลือกผู้ควบคุม --";
        staffSelect.appendChild(emptyOption);

        // เติมข้อมูลจาก API
        data.role.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = item.name;

            // ถ้ามีค่าที่เคยเลือก → เลือกค่านั้น
            if (savedStaff && savedStaff === item.name) {
                option.selected = true;
            }
            // ถ้ามี refid ให้เลือกตาม refid
            else if (item.id == refid) {
                option.selected = true;
            }

            staffSelect.appendChild(option);
        });

    } catch (error) {
        Swal.close();
        Swal.fire("Error", error.message, "error");
    }
}


function clearStaff() {
    // ลบค่าใน localStorage
    localStorage.removeItem("otStaffName");

    // ล้าง dropdown
    const staffSelect = document.getElementById("otStaffName");
    staffSelect.innerHTML = "";   // ล้างทั้งหมด

    // แจ้งเตือน
    Swal.fire({
        icon: "info",
        title: "เลือกใหม่",
        timer: 800,
        showConfirmButton: false,
        didClose: () => {
            // โหลดข้อมูลใหม่จาก API
            displayStaff();
        }
    });
}

