document.addEventListener("DOMContentLoaded", function () {
// แจ้งการปรับปรุง
        Swal.fire({
        icon: 'warning',
        title: 'แจ้งการปรับปรุง!',
        html: 'ในวันเสาร์ ที่ 4 พ.ย. 2566 เวลา 20.00 - 23.00 น. <br>1. ปรับปรุงเลขที่สมาชิกสำหรับจัดทำรหัสอ้างอิง<br>2. ปรับปรุงเงื่อนไงสำหรับแต่ละฟังก์ชั่น ระบบหลังบ้านทั้งหมด <br>3. ปรับปรุงเงื่อนไงสำหรับแต่ละฟังก์ชั่น ระบบหน้าบ้านทั้งหมด <br>4. หากหลังปรังปรุงแล้วใช้งานไม่ได้ โปรด Clear Local Storage ในหน้า Login! ให้ทำการลงเวลาใหม่อีกครั้ง',
        // footer: '<a href="">Why do I have this issue?</a>'
      })    
    // ตรวจสอบว่ามีค่า user ใน Local Storage หรือไม่
    const uuid = localStorage.getItem('uuid');

    if (uuid) {
        // หากมีค่า user ใน Local Storage ให้ทำตามการกระทำที่คุณต้องการ
        console.log('User is logged in. Token:', uuid);
        // ตัวอย่าง: สามารถเรียก API อื่น ๆ หรือนำผู้ใช้ไปยังหน้าที่ต้องการ
    } else if (!uuid) {
        // หากไม่มีค่า user ใน Local Storage ให้กลับไปที่หน้า login
        console.log('User is not logged in. Redirecting to login page.');
       window.location.href = 'https://liff.line.me/1654797991-pr0xKPxW'; // แทน 'login.html' ด้วยหน้า login ของคุณ
    }else {
        // หากไม่มีค่า user ใน Local Storage ให้กลับไปที่หน้า login
        console.log('User is not logged in. Redirecting to login page.');
       window.location.href = 'https://liff.line.me/1654797991-pr0xKPxW'; // แทน 'login.html' ด้วยหน้า login ของคุณ
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
  async  function showPositionin(position) {
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
   
     //   console.log(typea);

        await fetch(`https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec?ctype=In&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}`)
          
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
                            localStorage.clear(); // เคลียร์ข้อมูลเดิม เพื่อทำการปรับปรุง 3/11/2023
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
  async  function showPositionin(position) {
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
  //      console.log(typea);
        await fetch(`https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec?ctype=Out&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}`)
          
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
                            localStorage.clear(); // เคลียร์ข้อมูลเดิม เพื่อทำการปรับปรุง 3/11/2023
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

}
