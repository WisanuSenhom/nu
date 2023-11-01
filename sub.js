document.addEventListener("DOMContentLoaded", function () {
  // เมื่อหน้าเว็บโหลดเสร็จ, ดึงข้อมูล category และใส่ใน dropdown
  fetch("https://script.google.com/macros/s/AKfycbxqDazVhojy3PDLD2asS6Dp2dh-5zqiE9SVJr15BBh2nddc00ehKQNTC7_H1KXM6EhJFA/exec")
    .then(response => response.json())
    .then(data => {
      const categoryDropdown = document.getElementById("category");

      // เพิ่ม option สำหรับแต่ละ category
      data.category.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categoryDropdown.add(option);
      });

      // โหลด subcategories สำหรับ category แรก
      loadSubcategories();
    })
    .catch(error => console.error("Error fetching categories:", error));
});

function loadSubcategories() {
  const categoryDropdown = document.getElementById("category");
  const subcategoryDropdown = document.getElementById("subcategory");

  // ดึงค่าที่ถูกเลือกใน dropdown ของ category
  const selectedCategoryId = categoryDropdown.value;

  // ดึงข้อมูล subcategories จาก API โดยใช้ selectedCategoryId
  fetch(`https://script.google.com/macros/s/AKfycbwYUMzfkbM_B2fdgoGaJ7QKx_ACzg7cr0jn8I_x9yJdqHyWLurD_4IE5uX9tu_DW98/exec?categories=${selectedCategoryId}`)
    .then(response => response.json())
    .then(data => {
      // ลบค่าเก่าใน dropdown ของ subcategory
      subcategoryDropdown.innerHTML = "";

      // เพิ่ม option สำหรับแต่ละ subcategory
      data.category.forEach(subcategory => {
        const option = document.createElement("option");
        option.value = subcategory.id;
        option.text = subcategory.name;
        subcategoryDropdown.add(option);
      });
      loadSubdatas();
    })
    .catch(error => console.error("Error fetching subcategories:", error));
}

function loadSubdatas() {
  const categoryDropdown = document.getElementById("category");
  const subcategoryDropdown = document.getElementById("subcategory");

  // ดึงค่าที่ถูกเลือกใน dropdown ของ category
  const selectedCategoryId = categoryDropdown.value;
  const selecteddatas = subcategoryDropdown.value;

  // ดึงข้อมูล subcategories จาก API โดยใช้ selectedCategoryId
  fetch(`https://script.google.com/macros/s/AKfycbxRMzDKnw3HwBzYZxxKUiRSQKYIUWhi6Le9-cY09zdgZ1uE1HUMkntKRkATNT8INBu3/exec?datas=${selecteddatas}`)
    .then(response => response.json())
    .then(data => {
      // ลบค่าเก่าใน dropdown ของ subcategory
console.log(data);
      // เพิ่ม option สำหรับแต่ละ subcategory
      data.datas.forEach(subdatas => {
    
        document.querySelector('#latitude').value = subdatas.lat;
        document.querySelector('#longitude').value = subdatas.long;
        document.querySelector('#db1').value = subdatas.db1;
        document.querySelector('#db2').value = subdatas.db2;
        document.querySelector('#db3').value = subdatas.db3;
        document.querySelector('#maincode').value = subdatas.maincode;
        document.querySelector('#subcode').value = subdatas.subcode;
      });
      main();
    })
   // .catch(error => console.error("Error fetching subcategories:", error));
}



async function getProfile() {
  const profile = await liff.getProfile();
  document.querySelector('#userid').value = profile.userId;
  document.querySelector('#userimg').value = profile.pictureUrl;
  document.querySelector('#username').value = profile.displayName;
  document.querySelector('#useros').value = liff.getOS();
  // document.querySelector('#useremail').value = liff.getDecodedIDToken().email;
  document.querySelector('#upic').src = profile.pictureUrl;

}

async function main() {
  await liff.init({ liffId: "1654797991-nkGwelwo" })
  if (liff.isLoggedIn()) {
    getProfile()
  } else {
    liff.login()
  }
}
main()

async function insertdata() {
  let ucid = document.querySelector('#cid').value;
  // ตรวจสอบความยาวของรหัส PIN
  if (ucid.length !== 13) {
    Swal.fire(
      "ผิดพลาด!",
      "เลขบัตรประจำตัวประชาชน ต้องยาว 13 หลัก!",
      "error"
    );
    return;
  }

  // ตรวจสอบว่ารหัส PIN ประกอบด้วยตัวเลขเท่านั้น
  for (const char of ucid) {
    if (!/[0-9]/.test(char)) {
      Swal.fire(
        "ผิดพลาด!",
        "เลขบัตรประจำตัวประชาชน ต้องเป็นตัวเลขเท่านั้น!",
        "error"
      );

      return;
    }
  }
  let hash_cid = md5(document.querySelector('#cid').value);
  let pname = document.querySelector('#pname').value;
  if (pname.length < 1) {
    Swal.fire(
      "ผิดพลาด!",
      "โปรดกรอกคำนำหน้าชื่อ!",
      "error"
    );
    return;
  }
  let fname = document.querySelector('#fname').value;
  if (fname.length < 2) {
    Swal.fire(
      "ผิดพลาด!",
      "โปรดกรอกชื่อ!",
      "error"
    );
    return;
  }
  let lname = document.querySelector('#lname').value;
  if (lname.length < 2) {
    Swal.fire(
      "ผิดพลาด!",
      "โปรดกรอกนามสกุล!",
      "error"
    );
    return;
  }
  let job = document.querySelector('#job').value;
  if (job.length < 2) {
    Swal.fire(
      "ผิดพลาด!",
      "โปรดกรอกตำแหน่ง!",
      "error"
    );
    return;
  }
  let category = document.querySelector('#category').value;

  let subcategory = document.querySelector('#subcategory').value;
  let username = document.querySelector('#username').value;
  let userid = document.querySelector('#userid').value;
  let userimg = document.querySelector('#userimg').value;
  let useros = document.querySelector('#useros').value;
  let latitude = document.querySelector('#latitude').value;
  let longitude = document.querySelector('#longitude').value;
  let db1 = document.querySelector('#db1').value;
  let db2 = document.querySelector('#db2').value;
  let db3 = document.querySelector('#db3').value;
  let maincode = document.querySelector('#maincode').value;
  let subcode = document.querySelector('#subcode').value;


  // ส่งค่า พร้อมดึงข้อมูล
  await fetch(`https://script.google.com/macros/s/AKfycbzsWNRX6L0lfXRqmFeehqrmuNsPTUMBBa9IDSnU6tJEKLs0Q7qlRmClbqNkHmUOqX19uA/exec?hash_cid=${hash_cid}&pname=${pname}&fname=${fname}&lname=${lname}&job=${job}&category=${category}&subcategory=${subcategory}&username=${username}&userid=${userid}&userimg=${userimg}&useros=${useros}&latitude=${latitude}&longitude=${longitude}&db1=${db1}&db2=${db2}&db3=${db3}&maincode=${maincode}&subcode=${subcode}`)
    .then(response => response.json())
    .then(data => {
      // เพิ่ม option สำหรับแต่ละ subcategory
      data.data.forEach(datas => {
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
             window.location.href = 'login.html'; //https://liff.line.me/1654797991-pr0xKPxW
          }
      });

        // ---
      });

    })
  .catch(error => console.error("Error fetching subcategories:", error));


}


jQuery(document).ready(function ($) {
  $('#cid').on('keyup', function () {
    if ($.trim($(this).val()) != '' && $(this).val().length == 13) {
      id = $(this).val().replace(/-/g, "");
      let result = Script_checkID(id);
      if (result === false) {
        $('span.error').removeClass('true').text('ผิด โปรดตรวจสอบ');
      } else {
        $('span.error').addClass('true').text('ถูกต้อง');

      }
    } else {
      $('span.error').removeClass('true').text('');
    }
  })
});

function Script_checkID(id) {
  if (id.substring(0, 1) == 0) return false;
  if (id.length != 13) return false;
  for (i = 0, sum = 0; i < 12; i++)
    sum += parseFloat(id.charAt(i)) * (13 - i);
  if ((11 - sum % 11) % 10 != parseFloat(id.charAt(12))) return false;
  return true;
}

