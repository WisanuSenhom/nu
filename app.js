document.addEventListener("DOMContentLoaded", function () {
    // ตรวจสอบว่ามีค่า user ใน Local Storage หรือไม่
    const uuid = localStorage.getItem('uuid');

    if (uuid) {
        // หากมีค่า user ใน Local Storage ให้ทำตามการกระทำที่คุณต้องการ
        console.log('User is logged in. Token:', uuid);
        // ตัวอย่าง: สามารถเรียก API อื่น ๆ หรือนำผู้ใช้ไปยังหน้าที่ต้องการ
    } else {
        // หากไม่มีค่า user ใน Local Storage ให้กลับไปที่หน้า login
        console.log('User is not logged in. Redirecting to login page.');
       // window.location.href = 'login.html'; // แทน 'login.html' ด้วยหน้า login ของคุณ
    }
});


function checkin() {
    // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        // ขอค่าพิกัด
        navigator.geolocation.getCurrentPosition(showPositionin, showError);
    } else {
        alert("เบราว์เซอร์ไม่รองรับ Geolocation");
    }

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

        let typea = document.querySelector('#typea').value;
        let nte = document.querySelector('#nte').value;
     //   console.log(typea);

        await fetch(`https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec?ctype=In&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}`)
          
        .then(response => response.json())
            .then(data => {
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
                          //  window.location.href = 'https://www.example.com';
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
    }

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

        let typea = document.querySelector('#typea').value;
        let nte = document.querySelector('#nte').value;
  //      console.log(typea);
        await fetch(`https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec?ctype=Out&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}`)
          
        .then(response => response.json())
            .then(data => {
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
                          //  window.location.href = 'https://www.example.com';
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