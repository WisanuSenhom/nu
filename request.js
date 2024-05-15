document.addEventListener("DOMContentLoaded", function () {
// ตรวจระบบ
var isWindows = /Windows/i.test(navigator.userAgent);
var isMacOS = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent);
if (isWindows || isMacOS) {
 Swal.fire({
    title: 'อุปกรณ์เครื่องนี้ไม่ใช่สมาร์ทโฟน(Android,iPhone)',
    text: 'คลิก "ตกลง" เพื่อปิด หรือ "ยกเลิก" เพื่อดำเนินการ (แนะนำให้ใช้สมาร์ทโฟน ในการลงเวลาปฏิบัติงาน เพื่อความแม่นยำของพิกัด)',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก',
}).then((result) => {
    if (result.isConfirmed) {
        window.location.href = 'about:blank';
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('การดำเนินการถูกเปิดใช้งาน', '', 'info');
    }
});
}
    const uuid = localStorage.getItem('uuid');
    const boss = localStorage.getItem('boss');

    if (uuid !== null && uuid !== undefined && uuid !== '') {
        // User is logged in
        checktoday();
        // Perform actions for logged-in users (e.g., API calls or redirection)

    } else {
        // User is not logged in, redirect to the login page
        console.log('User is not logged in. Redirecting to login page.');
        window.location.href = 'login.html'; // Replace with your login page URL
    }

    if (boss !== null && boss !== undefined && boss !== '') {
        // Boss is assigned
      console.log('User is logged in. Boss :', boss);

    } else {
        // Boss is not assigned
        displayBossNotAssignedError();
    }

    function displayBossNotAssignedError() {
       localStorage.clear();
        // Show SweetAlert error message for unassigned boss
        Swal.fire({
            title: "ไม่พบการกำหนดหัวหน้า หรือ ผอ. ของท่าน",
            text: "โปรดกำหนดหรือแจ้งผู้แดระบบในหน่วยงานของท่านกำหนดให้ หากกำหนดแล้ว ให้กด Reset หน้าลงเวลา.",
            icon: "error",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "https://wisanusenhom.github.io/sekatime/user.html"; // Replace with your desired page URL
            }
        });
    }
});

// จากพี่ดำรงศักดิ์ สสจ.บึงกาฬ
// Function to calculate distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Earth's radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI * lat1) / 180;
    const radLon1 = (Math.PI * lon1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const radLon2 = (Math.PI * lon2) / 180;

    // Calculate the differences between the latitudes and longitudes
    const latDiff = radLat2 - radLat1;
    const lonDiff = radLon2 - radLon1;

    // Calculate the distance using the Haversine formula
    const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in kilometers

    return distance;
}

// Function to display distance on the HTML element
function displayDistance(distance) {
    let xdistance = distance.toFixed(2);
    let unit = 'กม.';
    
    if (xdistance < 1) {
        xdistance = (xdistance * 1000).toFixed(0);
        unit = 'ม.';
    }

    const dispDistanceElement = document.getElementById('dispDistance');
    
      dispDistanceElement.textContent = `${localStorage.getItem("office")} : ${xdistance} ${unit}`;

    // Check if xdistance is greater than 1
    if (parseFloat(distance) > 10) {
        // Set the text color to red
        dispDistanceElement.style.color = 'red';
    } else {
        // Reset the text color to its default
        dispDistanceElement.style.color = ''; // or you can use 'black' or any other color you prefer
    }
}


// Get the user's current geolocation
navigator.geolocation.getCurrentPosition((position) => {
    const currentLat = position.coords.latitude;
    const currentLon = position.coords.longitude;

    // Replace these with the latitude and longitude of your target location
    const targetLat = localStorage.getItem('oflat');
    const targetLon = localStorage.getItem('oflong');

    // const targetLat = 18.3747422;
    // const targetLon = 103.6442384;

    const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
    displayDistance(distance);
}, (error) => {
    console.error('Error getting geolocation:', error);
});
// สิ้นสุด


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
        const job = localStorage.getItem("job");
        const mainsub = localStorage.getItem("mainsub");
        const office = localStorage.getItem("office");
        const latx = localStorage.getItem("oflat");
        const longx = localStorage.getItem("oflong");
        const db1 = localStorage.getItem("db1");
        const token = localStorage.getItem("token");
        //   const status = localStorage.getItem("status");
        const docno = localStorage.getItem("docno");
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
        // เลือก id "latlong"
             var latlongElement = document.getElementById('latlong');

             // แสดงค่าใน element
        latlongElement.innerHTML = 'ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่...<br>ระบบกำลังรับส่งข้อมูลเพื่อประมวลผล';

        //   console.log(typea);
        let urlin = 'https://script.google.com/macros/s/AKfycbyziNGhQaE2jRgi8LZTDhqOWiWyOV0k9zP9kSK8ontoKM1_oSQZsUSlb9JZP7-cN0UdlA/exec';
        let prmin = `?ctype=In&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&dt=${dt}&token=${token}&job=${job}&docno=${docno}`;

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
        const job = localStorage.getItem("job");
        const mainsub = localStorage.getItem("mainsub");
        const office = localStorage.getItem("office");
        const latx = localStorage.getItem("oflat");
        const longx = localStorage.getItem("oflong");
        const db1 = localStorage.getItem("db1");
            const token = localStorage.getItem("token");
      const docno = localStorage.getItem("docno");
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
        if (dt == dateTime + "08:30" || dt <= dateTime + "11:59") {
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
                         // เลือก id "latlong"
             var latlongElement = document.getElementById('latlong');

             // แสดงค่าใน element
             latlongElement.innerHTML = 'ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่...<br>ระบบกำลังรับส่งข้อมูลเพื่อประมวลผล';

       //     console.log(dt);
            let urlout = 'https://script.google.com/macros/s/AKfycbyziNGhQaE2jRgi8LZTDhqOWiWyOV0k9zP9kSK8ontoKM1_oSQZsUSlb9JZP7-cN0UdlA/exec';
            let prmout = `?ctype=Out&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&dt=${dt}&token=${token}&job=${job}&docno=${docno}`;
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


function clearLocal() {
    // เรียกใช้ localStorage.clear() เพื่อลบข้อมูลทั้งหมดใน Local Storage
    Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: 'กด "ตกลง" เพื่อดำเนินการ รีเช็ต เพื่อรับค่าใหม่',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            Swal.fire({
                confirmButtonColor: '#0ef',
                icon: 'success',
                title: 'รีเซ็ตข้อมูลสำเร็จ'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
        }
    });
}

function openWebAdmin() {
    Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: 'คลิก "ตกลง" เพื่อเข้าสู่ระบบการจัดการการลงเวลาปฏิบัติงาน',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('https://wisanusenhom.github.io/sekatime/', '_blank');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
        }
    });
}


async function checktoday(){
    // Select the element with id "utimeline"
    var utimelineElement = document.getElementById("utimeline");

    // Fetch data from the server (replace 'your_api_endpoint' with the actual API endpoint)
    var gas = 'https://script.google.com/macros/s/AKfycby0bCwNY5tyoVzfb1aM_48Yvs0PInOqUEnb_Aw2Bdyt4t2dBQ-m3FBA4lkMtmgaYHC53w/exec';
    var qdata = `?id=${localStorage.getItem("refid")}&db=${localStorage.getItem("db1")}`;

  await  fetch(gas + qdata)
        .then(response => response.json())
        .then(data => {
            if (data.cc && data.cc.length > 0) {
                // Assuming the server response has a property named 'cc' and 'intime'
                var timelineData = `วันนี้คุณลงเวลามาแล้ว : การปฏิบัติงาน ${data.cc[0].intype} \n ลงเวลาเมื่อ ${data.cc[0].intime}  ระยะ ${data.cc[0].indistan} ${data.cc[0].inunit}`; // Assuming you want the first 'intime' value

                // Set the text content of the element with the fetched data
                utimelineElement.innerText = timelineData;
            } else {
                var timelineData = `วันนี้คุณยังไม่ได้ลงเวลามาปฏิบัติงาน`;
                utimelineElement.innerText = timelineData;
              //  console.error('Invalid or empty server response:', data);
           
                // Handle errors or empty responses here
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle fetch errors here
        });
        hideLoading();  
}


function openWebToken() {
    Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: 'คลิก "ตกลง" เพื่อออกไลน์โทเค็นสำหรับการแจ้งเตือนผ่านไลน์',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('token.html', '_blank');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
        }
    });
}

// รับอ้างอิงถึง Collapsible menu
var collapsibleMenu = document.getElementById('collapsibleNavbar');

// เพิ่ม Event Listener ให้กับเอกสาร
document.addEventListener('click', function(event) {
    // ตรวจสอบว่าคลิกไปที่ Collapsible menu หรือไม่
    var isClickInsideMenu = collapsibleMenu.contains(event.target);

    // หากไม่ได้คลิกที่ Collapsible menu ให้ซ่อนมัน
    if (!isClickInsideMenu) {
        collapsibleMenu.classList.remove('show'); // ซ่อน Collapsible menu
    }
});
