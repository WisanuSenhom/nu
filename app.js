document.addEventListener("DOMContentLoaded", function () {
// แจ้งการปรับปรุง
      //   Swal.fire({
      //   icon: 'warning',
      //   title: 'แจ้งการปรับปรุง!',
      //   html: 'ในวันเสาร์ ที่ 4 พ.ย. 2566 เวลา 20.00 - 23.00 น. <br>1. ปรับปรุงเลขที่สมาชิกสำหรับจัดทำรหัสอ้างอิง<br>2. ปรับปรุงเงื่อนไงสำหรับแต่ละฟังก์ชั่น ระบบหลังบ้านทั้งหมด <br>3. ปรับปรุงเงื่อนไงสำหรับแต่ละฟังก์ชั่น ระบบหน้าบ้านทั้งหมด <br>4. หากหลังปรังปรุงแล้วใช้งานไม่ได้ โปรด Clear Local Storage ในหน้า Login! ให้ทำการลงเวลาใหม่อีกครั้ง',
      //   // footer: '<a href="">Why do I have this issue?</a>'
      // })    
    // ตรวจสอบว่ามีค่า user ใน Local Storage หรือไม่
    const uuid = localStorage.getItem('uuid');
    const refid = localStorage.getItem('mainsub');
      const office = localStorage.getItem('office');

    if (uuid) {
        // หากมีค่า user ใน Local Storage ให้ทำตามการกระทำที่คุณต้องการ
        checknotify();
        // ตัวอย่าง: สามารถเรียก API อื่น ๆ หรือนำผู้ใช้ไปยังหน้าที่ต้องการ
    } else if (!uuid) {
        // หากไม่มีค่า user ใน Local Storage ให้กลับไปที่หน้า login
        console.log('User is not logged in. Redirecting to login page.');
       window.location.href = 'https://liff.line.me/1654797991-pr0xKPxW'; // แทน 'login.html' ด้วยหน้า login ของคุณ
    }else if (uuid == '6e584e97-d60c-4573-941a-505d7a60937a' && refid == 'สสจ.บึงกาฬ' || uuid == '403260de-8016-4823-8d53-e18b1a629dc1' && office == 'สสอ.เซกา' || uuid == '19f58bf0-543a-4407-a0ce-f057b75918d7' && office == 'สสอ.เซกา' || uuid == 'f2581181-f6f3-4008-bc8d-026e2f1ef629' && office == 'สสอ.เซกา' || uuid == '6d15be30-6e53-4eca-8ea0-e60df84a8321' && office == 'สสอ.เซกา' ) {
        localStorage.clear();  
          // สำหรับเคลียร์ผิดพลาด
    }else {
        // หากไม่มีค่า user ใน Local Storage ให้กลับไปที่หน้า login
        console.log('User is not logged in. Redirecting to login page.');
       window.location.href = 'https://liff.line.me/1654797991-pr0xKPxW'; // แทน 'login.html' ด้วยหน้า login ของคุณ
    }
});

// Function to display distance on the HTML element
function displayDistance(distance) {
    let xdistance = distance.toFixed(3);
    let unit = 'กม.';
    
    if (xdistance < 1) {
        xdistance = (xdistance * 1000).toFixed(0);
        unit = 'ม.';
    }

    const dispDistanceElement = document.getElementById('dispDistance');
    
    dispDistanceElement.textContent = `ระยะห่าง : ${xdistance} ${unit}`;

    // Check if xdistance is greater than 1
    if (parseFloat(xdistance) > 10) {
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
  async  function showPositionin(position) {
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
        latlongElement.innerHTML = 'ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่...<br>ระบบกำลังรับส่งข้อมูลเพื่อประมวลผล';

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
                         //   localStorage.clear(); // เคลียร์ข้อมูลเดิม เพื่อทำการปรับปรุง 3/11/2023
                        //  liff.closeWindow(); 
                               checktoken();
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
  async  function showPositionin(position) {
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
         latlongElement.innerHTML = 'ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่...<br>ระบบกำลังรับส่งข้อมูลเพื่อประมวลผล';
        
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
                          //  liff.closeWindow(); 
                               checktoken();
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
                    window.location.href = 'https://liff.line.me/1654797991-pr0xKPxW';
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

function createtoken(){
    Swal.fire({
        title: 'แจ้งเตือนทางไลน์ไม่สำเร็จ - ไม่พบ LINE TOKEN ในระบบ',
        text: 'กด ตกลง เพื่อออก Line Token ',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
    }).then((result) => {
        // Check if the user clicked ok
        if (result.isConfirmed) {
            // Redirect to the specified URL
            window.location.href = 'https://wisanusenhom.github.io/nu/token.html';
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

function checknotify() {
    urlapi = 'https://script.google.com/macros/s/AKfycbwSQn-VpYHC6lGntFx3eqZbeGW5_MJhOvT9bynDi7j6wlFpkJILoM1ADjhlz3AuoUVLWQ/exec';
    queryapi = `?id=${localStorage.getItem('uuid')}`;
    fetch(urlapi + queryapi)
        .then(response => response.json())
        .then(data => {
            data.user.forEach(function (user) {
                if (user.token && user.token.trim() !== '') {
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
