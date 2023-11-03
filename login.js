async function getProfile() {
    const profile = await liff.getProfile();
    const yourid = profile.userId ;
    getmember(yourid);
    }

async function getmember(yourid){
    // console.log(yourid);
    let gas = `https://script.google.com/macros/s/AKfycbyY-5A1mpNjJjD9CjPEX4fSW5N6xB7PoMAODHgjMJuuLARrCjvm5csgFamB8MKbjUB9/exec?id=${yourid}`;
    const records = await fetch(gas);
    const data = await records.json();
  
  //  console.log(data.user);
    if (data.user === null || data.user === undefined ||data.user == 0 ){
        Swal.fire({
            confirmButtonColor: '#0ef',
            icon: 'error',
            title: 'ไม่พบข้อมูลของคุณในระบบ',
        }).then((result) => {
            // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
            if (result.isConfirmed) {
                // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
                window.location.href = 'https://liff.line.me/1654797991-nkGwelwo';
            }
        });
    }else{ 
    localStorage.clear();
    data.user.forEach(function(user){
            // let uuid = user.uuid;
            // console.log(uuid);
  
            localStorage.setItem("uuid", user.uuid);
           // console.log(localStorage.getItem("uuid"));

            localStorage.setItem("cidhash", user.cidhash);
           // console.log(localStorage.getItem("cidhash"));

            localStorage.setItem("userid", user.userid);
           // console.log(localStorage.getItem("userid"));

            localStorage.setItem("name", user.name);
           // console.log(localStorage.getItem("name"));

            localStorage.setItem("position", user.position);
          //  console.log(localStorage.getItem("position"));

            localStorage.setItem("mainsub", user.mainsub);
          //  console.log(localStorage.getItem("mainsub"));

            localStorage.setItem("office", user.office);
         //   console.log(localStorage.getItem("office"));

            localStorage.setItem("oflat", user.oflat);
          //  console.log(localStorage.getItem("oflat"));

            localStorage.setItem("oflong", user.oflong);
          //  console.log(localStorage.getItem("oflong"));

            localStorage.setItem("db1", user.db1);
          //  console.log(localStorage.getItem("db1"));

            localStorage.setItem("token", user.token);
          //  console.log(localStorage.getItem("token"));

            localStorage.setItem("status", user.status);
          //  console.log(localStorage.getItem("status"));

            
            localStorage.setItem("role", user.role);
         //   console.log(localStorage.getItem("role"));

            localStorage.setItem("boss", user.boss);
         //   console.log(localStorage.getItem("boss"));

            localStorage.setItem("ceo", user.ceo);
         //   console.log(localStorage.getItem("ceo"));
        
        localStorage.setItem("refid", user.refid);
        
            Swal.fire({
                confirmButtonColor: '#0ef',
                icon: 'success',
                title: 'ลงชื่อเข้าใช้สำเร็จแล้ว',
          
            }).then((result) => {
                // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
                if (result.isConfirmed) {
                    // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
                    window.location.href = 'https://liff.line.me/1654797991-WVJ2e129';
                }
            });
    
    });
}}

function clearLocal() {
    // เรียกใช้ localStorage.clear() เพื่อลบข้อมูลทั้งหมดใน Local Storage
    localStorage.clear();
  
    Swal.fire({
        confirmButtonColor: '#0ef',
        icon: 'success',
        title: 'Local Storage has been cleared.'
})
}

async function main() {
    await liff.init({ liffId: "1654797991-pr0xKPxW" })
      if (liff.isLoggedIn()) {
        getProfile() 
      } else {
        liff.login()
      }
  }
  main()
