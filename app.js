document.addEventListener("DOMContentLoaded", function () {
    showLoading();
    // แจ้งการปรับปรุง
    //   Swal.fire({
    //   icon: 'warning',
    //   title: 'แจ้งการปรับปรุง!',
    //   html: 'ในวันเสาร์ ที่ 4 พ.ย. 2566 เวลา 20.00 - 23.00 น. <br>1. ปรับปรุงเลขที่สมาชิกสำหรับจัดทำรหัสอ้างอิง<br>2. ปรับปรุงเงื่อนไงสำหรับแต่ละฟังก์ชั่น ระบบหลังบ้านทั้งหมด <br>3. ปรับปรุงเงื่อนไงสำหรับแต่ละฟังก์ชั่น ระบบหน้าบ้านทั้งหมด <br>4. หากหลังปรังปรุงแล้วใช้งานไม่ได้ โปรด Clear Local Storage ในหน้า Login! ให้ทำการลงเวลาใหม่อีกครั้ง',
    //   // footer: '<a href="">Why do I have this issue?</a>'
    // })    
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
    // ตรวจสอบว่ามีค่า user ใน Local Storage หรือไม่
    const token = localStorage.getItem('token');
    if (!token) {
        createtoken();
    }

    const uuid = localStorage.getItem('uuid');
    if (uuid) {
        // หากมีค่า user ใน Local Storage ให้ทำตามการกระทำที่คุณต้องการ
        updateUser(uuid);
        // ตัวอย่าง: สามารถเรียก API อื่น ๆ หรือนำผู้ใช้ไปยังหน้าที่ต้องการ
    } else if (!uuid) {
        // หากไม่มีค่า user ใน Local Storage ให้กลับไปที่หน้า login
        console.log('User is not logged in. Redirecting to login page.');
        window.location.href = 'login.html'; // แทน 'login.html' ด้วยหน้า login ของคุณ
    } else {
        // หากไม่มีค่า user ใน Local Storage ให้กลับไปที่หน้า login
        console.log('User is not logged in. Redirecting to login page.');
        window.location.href = 'login.html'; // แทน 'login.html' ด้วยหน้า login ของคุณ
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
    Swal.fire({
        title: 'คุณต้องการลงเวลาปฏิบัติงานหรือไม่?',
        text: 'กรุณากด "ยืนยัน" เพื่อดำเนินการลงเวลามาปฏิบัติงาน',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            // เริ่มต้น ลงเวลา

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
        const token = localStorage.getItem("token");
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

        //   console.log(typea);
        // เลือก id "latlong"
        var latlongElement = document.getElementById('latlong');

        // แสดงค่าใน element
        latlongElement.innerHTML = 'พิกัดปัจจุบันของคุณ:<br>ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่ ระบบกำลังประมวลผลข้อมูล...';

        await fetch(`https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec?ctype=In&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&token=${token}`)

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
                            if (iconx === 'success') {
                                const cktoday = new Date();
                                const ckfd = cktoday.toLocaleDateString('th-TH'); // รูปแบบวันที่แบบไทย
                                localStorage.setItem("datecheck", ckfd);
                            }
                    
                            try {
                                liff.closeWindow();
                            } catch (error) {
                                console.error("Failed to close window, refreshing...");
                                location.reload(); // รีเฟรชหน้า
                            }
                    
                            // Use a timeout to refresh the page after trying to close the window
                            setTimeout(() => {
                                location.reload();  // Refresh if liff.closeWindow() does not work
                            }, 500);  // Adjust the delay time as needed (500ms in this case)
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
          // ฟังก์ชั่นลงเวลา
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การลงเวลาถูกยกเลิก', '', 'info');
        }
    });  

}

function checkout() {
    Swal.fire({
        title: 'คุณต้องการลงเวลากลับหรือไม่?',
        text: 'กรุณากด "ยืนยัน" เพื่อดำเนินการลงเวลากลับ',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
           allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            // เริ่มต้น ลงเวลา

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
        const token = localStorage.getItem("token");
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
        //      console.log(typea);
        // เลือก id "latlong"
        var latlongElement = document.getElementById('latlong');

        // แสดงค่าใน element
        latlongElement.innerHTML = 'พิกัดปัจจุบันของคุณ:<br>ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่ ระบบกำลังประมวลผลข้อมูล...';

        await fetch(`https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec?ctype=Out&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&token=${token}`)

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

            // ฟังก์ชั่นลงเวลา
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การลงเวลาถูกยกเลิก', '', 'info');
        }
    });

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


function checktoken() {
    urlapi = 'https://script.google.com/macros/s/AKfycbwSQn-VpYHC6lGntFx3eqZbeGW5_MJhOvT9bynDi7j6wlFpkJILoM1ADjhlz3AuoUVLWQ/exec';
    queryapi = `?id=${localStorage.getItem('uuid')}`;
    fetch(urlapi + queryapi)
        .then(response => response.json())
        .then(data => {
            data.user.forEach(function (user) {
                if (user.token && user.token.trim() !== '') {
                    liff.closeWindow();
                } else {
                    // If user.token is empty or undefined, call fn
                    createtoken();
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function createtoken() {
    Swal.fire({
        title: 'ไม่พบ LINE TOKEN ในระบบ',
        text: 'กด ตกลง เพื่อออก Line Token หรือกดรับค่าใหม่ในกรณีออก Token แล้ว',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'รับค่าใหม่',
        showCancelButton: true,
        imageUrl: "https://lh5.googleusercontent.com/d/1vCuMH9g4FDHdqoi3hOJi7YY005fBpx9a",
        imageWidth: 350,
        imageHeight: 550,
        imageAlt: "Custom image"
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to the specified URL
            window.location.href = 'token.html';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Clear local storage
            localStorage.clear();
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

function openWeb5s() {
    Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: 'คลิก "ตกลง" เพื่อเข้าสู่ระบบการจัดการงาน 5 ส.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('https://wisanusenhom.github.io/5s/', '_blank');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
        }
    });
}
// function checknotify() {
//     urlapi = 'https://script.google.com/macros/s/AKfycbwSQn-VpYHC6lGntFx3eqZbeGW5_MJhOvT9bynDi7j6wlFpkJILoM1ADjhlz3AuoUVLWQ/exec';
//     queryapi = `?id=${localStorage.getItem('uuid')}`;
//     fetch(urlapi + queryapi)
//         .then(response => response.json())
//         .then(data => {
//             data.user.forEach(function (user) {
//                 if (user.token && user.token.trim() !== '') {
//                 } else {
//                 // If user.token is empty or undefined, call fn
//                 createtoken();
//                 }
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
// }


async function updateUser(uuid) {
    hideLoading();  
    let gas = `https://script.google.com/macros/s/AKfycbziO9f62v0bfAz2bmPFQzuYibCxyamxDLOE08TZBcXx_UxzEqWvtGRIkSQQvYeV23Ko/exec?id=${uuid}`;
    const records = await fetch(gas);
    const data = await records.json();
    data.user.forEach(function (user) {
        localStorage.setItem("name", user.name);
        localStorage.setItem("job", user.job);
        localStorage.setItem("mainsub", user.mainsub);
        localStorage.setItem("office", user.office);
        localStorage.setItem("oflat", user.oflat);
        localStorage.setItem("oflong", user.oflong);
        localStorage.setItem("db1", user.db1);
        localStorage.setItem("token", user.token);
        localStorage.setItem("status", user.status);
        localStorage.setItem("role", user.role);
        localStorage.setItem("boss", user.boss);
        localStorage.setItem("ceo", user.ceo);
        localStorage.setItem("upic", user.upic);
        localStorage.setItem("refid", user.refid);
        localStorage.setItem("docno", user.docno);
            
    });
    checktoday();
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
      //  hideLoading();  
}

function showLoading() {
    var overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
}

function hideLoading() {
    var overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
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

function logupdate() {
    Swal.fire({
        title: 'การปรับปรุงล่าสุด',
        html: '<strong>วันที่ 21 ตุลาคม 2567</strong><br>' +
              '1. ยกเลิกการตรวจสอบการลงเวลาที่ระบบหลังบ้านเพื่อเพิ่มความสะดวกในการใช้งาน<br>' +
              '2. เพิ่มฟังก์ชันการตรวจสอบการลงเวลาผ่านระบบหน้าบ้านเพื่อความรวดเร็ว<br>' +
              '3. ตั้งทริกเกอร์ให้ตรวจสอบและลบข้อมูลซ้ำซ้อนในช่วงเวลา 03:00 - 04:00 น.',
        icon: 'info',
        confirmButtonText: 'ยืนยัน',
        showCloseButton: true,
        customClass: {
            title: 'text-success',  // Adding a success color to the title
            content: 'text-dark'  // Darker text for better readability
        }
    });
}




function checkinfo() {
    Swal.fire({
        title: 'การลงเวลา',
        html: 'คุณได้ทำการลงเวลาในการปฏิบัติงานในวันที่ <strong>' + localStorage.getItem("datecheck") + '</strong> เรียบร้อยแล้ว',
        icon: 'info',
        confirmButtonText: 'ยืนยัน',
        showCloseButton: true,
        customClass: {
            title: 'text-primary',  // Adds a primary color to the title
            content: 'text-muted'  // Makes the content a bit more subtle
        }
    });
}

function aboutme() {
    var yourpic = localStorage.getItem("upic");
    Swal.fire({
        imageUrl: yourpic,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",
        title: 'ข้อมูลของฉัน',
        html: 
            'ชื่อ : <strong>' + localStorage.getItem("name") + '</strong><br>' +
            'ตำแหน่ง : <strong>' + localStorage.getItem("job") + '</strong><br>' +
            'หน่วยงาน : <strong>' + localStorage.getItem("office") + '</strong><br>' +
            'สังกัด : <strong>' + localStorage.getItem("mainsub") + '</strong><br>',
        icon: 'info',
        confirmButtonText: 'ยืนยัน',
        showCloseButton: true,
        customClass: {
            title: 'text-primary',  // Adds a primary color to the title
            content: 'text-dark'   // Makes the content more prominent
        }
    });
}

function editpic() {
    var yourpic = localStorage.getItem("yourpic");
    if (!yourpic || yourpic.trim() === '') {
        // Show a warning message using SweetAlert
        Swal.fire({
            title: 'ไม่พบรูปโปรไฟล์ LINE ของคุณ',
            text: 'ระบบจะลงชื่อออกและนำคุณเข้าสู่ระบบใหม่อีกครั้ง เมื่อคุณกด "ยืนยัน" เพื่อแก้ไขปัญหานี้',
            icon: 'error',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // เคลียร์ localStorage
                localStorage.clear();
                // รีโหลดหน้าเว็บ
                location.reload();
            }
        });
        
        return; // Exit the function to prevent further execution
    }    
    Swal.fire({
        title: 'ยืนยันการแก้ไข.!',

        imageUrl: yourpic,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",

        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            var urlperson = `https://script.google.com/macros/s/AKfycbyJkVKoVcJV28-1NitWY-WwST5AWHguNDO1aB-l-4ZCCYyNDuBRznMvCbyLxjLi2EJU5Q/exec`;
            var dataperson = `?id=${localStorage.getItem('uuid')}&pic=${yourpic}`;
            fetch(urlperson + dataperson)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle the data returned from the server
                    console.log(data);

                    // Show a success message using SweetAlert
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'การแก้ไขข้อมูลเสร็จสิ้น',
                        icon: 'success'
                    }).then(() => {
                           localStorage.clear();
                           location.reload();
                    });
                })
                .catch(error => {
                    // Handle any errors that occurred during the fetch
                    console.error('Fetch error:', error);

                    // Show an error message using SweetAlert
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถแก้ไขข้อมูลได้',
                        icon: 'error'
                    });
                });
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

