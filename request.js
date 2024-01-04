document.addEventListener("DOMContentLoaded", function () {
    const uuid = localStorage.getItem('uuid');
    const boss = localStorage.getItem('boss');

    if (uuid !== null && uuid !== undefined && uuid !== '') {
        // User is logged in
        console.log('User is logged in. Token:', uuid);
        // Perform actions for logged-in users (e.g., API calls or redirection)

    } else {
        // User is not logged in, redirect to the login page
        console.log('User is not logged in. Redirecting to login page.');
        window.location.href = 'https://liff.line.me/1654797991-pr0xKPxW'; // Replace with your login page URL
    }

    if (boss !== null && boss !== undefined && boss !== '') {
        // Boss is assigned
        displayBossAssignedError();

    } else {
        // Boss is not assigned
        displayBossNotAssignedError();
    }

    function displayBossAssignedError() {
        // Show SweetAlert error message for assigned boss
        Swal.fire({
            title: "Boss Assigned",
            text: "Boss is already assigned.",
            icon: "error",
            confirmButtonText: "OK"
        }).then((result) => {
            // Handle confirmation if needed
        });
    }

    function displayBossNotAssignedError() {
        // Show SweetAlert error message for unassigned boss
        Swal.fire({
            title: "Boss Not Assigned",
            text: "Boss is not assigned. Please set a boss and click 'Reset' on the time tracking page.",
            icon: "error",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "https://wisanusenhom.github.io/sekatime/user.html"; // Replace with your desired page URL
            }
        });
    }
});



function checkin() {
    // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        // ขอค่าพิกัด
        navigator.geolocation.getCurrentPosition(showPositionin, showError);
    } else {
        alert("เบราว์เซอร์ไม่รองรับ Geolocation");
    };
    // กำหนดตัวแปรที่จะใช้เก็บ elements
    const loadingModal = document.getElementById('loadingModal');

    // แสดง loading modal
    loadingModal.style.display = 'block';

    // เมื่อได้รับค่าพิกัด
    async function showPositionin(position) {

        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        const uuid = localStorage.getItem('uuid');
        const cidhash = localStorage.getItem("cidhash");
        const userid = localStorage.getItem("userid");
        const name = localStorage.getItem("name");
        //  const positionx = localStorage.getItem("positionx");
        const mainsub = localStorage.getItem("mainsub");
        const office = localStorage.getItem("office");
        const latx = localStorage.getItem("oflat");
        const longx = localStorage.getItem("oflong");
        const db1 = localStorage.getItem("db1");
        //    const token = localStorage.getItem("token");
        //   const status = localStorage.getItem("status");
        //   const role = localStorage.getItem("role");
        const boss = localStorage.getItem("boss");
        const ceo = localStorage.getItem("ceo");
        const refid = localStorage.getItem("refid");

        let typea = document.querySelector('#typea').value;
        let nte = document.querySelector('#nte').value;

        let todays = new Date();
        todays.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        let todayx = todays.toLocaleTimeString('th-TH');
        let dt = document.getElementById("daytime").value;
        if (nte === null || nte === 0 || nte.length < 2) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'โปรดระบุเหตุผล หรือคำชี้แจง!',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                // Reload the page
                location.reload();
            });
            return;
        }

        //   console.log(typea);
        let urlin = 'https://script.google.com/macros/s/AKfycbyziNGhQaE2jRgi8LZTDhqOWiWyOV0k9zP9kSK8ontoKM1_oSQZsUSlb9JZP7-cN0UdlA/exec';
        let prmin = `?ctype=In&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&dt=${dt}`;

        await fetch(urlin + prmin)
            .then(response => response.json())
            .then(data => {
                loadingModal.style.display = 'none';
                // เพิ่ม option สำหรับแต่ละ subcategory
                data.res.forEach(datas => {
                    let iconx = datas.icon;
                    let header = datas.header;
                    let text = datas.text;
                    Swal.fire({
                        confirmButtonColor: '#1e90ff',
                        icon: iconx,
                        title: header,
                        text: text
                    }).then((result) => {
                        // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
                        if (result.isConfirmed) {
                            // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
                            //   localStorage.clear(); // เคลียร์ข้อมูลเดิม เพื่อทำการปรับปรุง 3/11/2023
                            liff.closeWindow();
                        }
                    });

                    // ---
                });

            })
    }

    // กรณีเกิดข้อผิดพลาดในการรับค่าพิกัด
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("ผู้ใช้ปฏิเสธการให้สิทธิ์ในการรับค่าพิกัด");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("ข้อมูลตำแหน่งไม่พร้อมใช้งาน");
                break;
            case error.TIMEOUT:
                alert("การร้องขอค่าพิกัดใช้เวลานานเกินไป");
                break;
            case error.UNKNOWN_ERROR:
                alert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
                break;
        }
    }

}

function checkout() {
    // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        // ขอค่าพิกัด
        navigator.geolocation.getCurrentPosition(showPositionin, showError);
    } else {
        alert("เบราว์เซอร์ไม่รองรับ Geolocation");
    };
    // กำหนดตัวแปรที่จะใช้เก็บ elements
    const loadingModal = document.getElementById('loadingModal');

    // แสดง loading modal
    loadingModal.style.display = 'block';

    // เมื่อได้รับค่าพิกัด
    async function showPositionin(position) {

        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        const uuid = localStorage.getItem('uuid');
        const cidhash = localStorage.getItem("cidhash");
        const userid = localStorage.getItem("userid");
        const name = localStorage.getItem("name");
        //  const positionx = localStorage.getItem("positionx");
        const mainsub = localStorage.getItem("mainsub");
        const office = localStorage.getItem("office");
        const latx = localStorage.getItem("oflat");
        const longx = localStorage.getItem("oflong");
        const db1 = localStorage.getItem("db1");
        //    const token = localStorage.getItem("token");
        //   const status = localStorage.getItem("status");
        //   const role = localStorage.getItem("role");
        const boss = localStorage.getItem("boss");
        const ceo = localStorage.getItem("ceo");
        const refid = localStorage.getItem("refid");

        let typea = document.querySelector('#typea').value;
        let nte = document.querySelector('#nte').value;
        let todays = new Date();
        todays.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        let todayx = todays.toLocaleTimeString('th-TH');

        let dt = document.getElementById("daytime").value;
        let dateTime = new Date().toISOString();
        dateTime = dateTime.split(".")[0];
        dateTime = dateTime.slice(0, -8);

        let dtt = dt.substring(dt.length - 5);
        if (dt == dateTime + "08:30" || dt <= dateTime + "16:30") {
            swal.fire({
                position: 'center',
                icon: 'warning',
                confirmButtonColor: '#1450A3',
                confirmButtonText: 'ตกลง',
                html: 'ไม่สามารถลงเวลากลับได้ ในเวลา ' + dtt + ' น.',
            }).then(() => {
                // Reload the page
                location.reload();
            });
        } else {
            if (nte === null || nte === 0 || nte.length < 2) {
                Swal.fire({
                    title: 'ผิดพลาด!',
                    text: 'โปรดระบุเหตุผล หรือคำชี้แจง!',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    // Reload the page
                    location.reload();
                });

                return;
            }

            console.log(dt);
            let urlout = 'https://script.google.com/macros/s/AKfycbyziNGhQaE2jRgi8LZTDhqOWiWyOV0k9zP9kSK8ontoKM1_oSQZsUSlb9JZP7-cN0UdlA/exec';
            let prmout = `?ctype=Out&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&dt=${dt}`;
            console.log(urlout + prmout);
            await fetch(urlout + prmout)
                .then(response => response.json())
                .then(data => {
                    loadingModal.style.display = 'none';
                    // เพิ่ม option สำหรับแต่ละ subcategory
                    data.res.forEach(datas => {
                        let iconx = datas.icon;
                        let header = datas.header;
                        let text = datas.text;
                        Swal.fire({
                            confirmButtonColor: '#1e90ff',
                            icon: iconx,
                            title: header,
                            text: text
                        }).then((result) => {
                            // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
                            if (result.isConfirmed) {
                                // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
                                //   localStorage.clear(); // เคลียร์ข้อมูลเดิม เพื่อทำการปรับปรุง 3/11/2023
                                //  window.location.href = 'https://www.example.com';
                                liff.closeWindow();
                            }
                        });

                        // ---
                    });

                })
        }
    }

    // กรณีเกิดข้อผิดพลาดในการรับค่าพิกัด
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("ผู้ใช้ปฏิเสธการให้สิทธิ์ในการรับค่าพิกัด");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("ข้อมูลตำแหน่งไม่พร้อมใช้งาน");
                break;
            case error.TIMEOUT:
                alert("การร้องขอค่าพิกัดใช้เวลานานเกินไป");
                break;
            case error.UNKNOWN_ERROR:
                alert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
                break;
        }
    }

}
