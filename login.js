document.addEventListener("DOMContentLoaded", function () {
  const uuid = localStorage.getItem("uuid");
  if (uuid) {
    window.location.href = "index.html"; 
  }
});

function clearLocal() {
  // แสดงข้อความยืนยันก่อนลบข้อมูลใน Local Storage
  Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: "การดำเนินการนี้จะลบข้อมูลทั้งหมดใน Local Storage อย่างถาวร",
    icon: "warning",
    showCancelButton: true, // แสดงปุ่มยกเลิก
    confirmButtonColor: "#d33", // สีปุ่มยืนยัน
    cancelButtonColor: "#3085d6", // สีปุ่มยกเลิก
    confirmButtonText: "ใช่, ลบข้อมูล!", // ข้อความบนปุ่มยืนยัน
    cancelButtonText: "ยกเลิก", // ข้อความบนปุ่มยกเลิก
  }).then((result) => {
    if (result.isConfirmed) {
      // หากผู้ใช้กดปุ่มยืนยัน ให้ลบข้อมูลใน Local Storage
      localStorage.clear();

      // แสดงข้อความแจ้งเตือนเมื่อการลบเสร็จสิ้น
      Swal.fire({
        confirmButtonColor: "#0ef",
        icon: "success",
        title: "ข้อมูลใน Local Storage ถูกลบเรียบร้อยแล้ว",
      });
    }
  });
}


function showLoading() {
  var overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "flex";
}

function hideLoading() {
  var overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "none";
}


async function getProfile() {
  try {
    const profile = await liff.getProfile();
    const displayName = profile.displayName;
    const yourid = profile.userId;
    const yourpic = profile.pictureUrl;
    const yourstatus = profile.statusMessage;

    Swal.fire({
      title: `ยินดีต้อนรับคุณ\n${displayName}`,
      html: `สถานะ : ${yourstatus}<br><br><strong>คุณต้องการเข้าสู่ระบบด้วยบัญชีไลน์นี้หรือไม่?</strong>`,
      imageUrl: yourpic,
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "User Photo",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#00B900",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        getmember(yourid, yourpic, displayName, "line");
      } else {
        Swal.fire({
          icon: "info",
          title: "คุณเลือกยกเลิกการเข้าสู่ระบบ",
          confirmButtonColor: "#00B900",
        });
      }
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้",
      confirmButtonColor: "#d33",
    });
  }
}


// Line Login
async function main() {
  hideLoading();
  await liff.init({ liffId: "1654797991-pr0xKPxW" }); 
 //  await liff.init({ liffId: "1654797991-Xmxp3Gpj" }); // ทดสอบ
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login();
  }
}


// Telegram Login 
const botUsername = "TimestampNotifybot"; // Bot username
const botId = "7733040493"; // Bot ID from @BotFather

// Telegram Login Test
// const botUsername = "wisanusenhombot"; // Bot username
// const botId = "7781010431"; // Bot ID from @BotFather 

function telegramLogin() {
  const originUrl = "https://wisanusenhom.github.io/nu/login.html"
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${originUrl}&embed=1`;
  window.open(authUrl, "_self"); // Open Telegram login page
}

window.addEventListener("load", handleTelegramCallback);

async function handleTelegramCallback() {
  const urlHash = window.location.hash; // ดึงข้อมูลจาก fragment (หลัง #)
  // console.log("URL Hash:", urlHash); // พิมพ์ข้อมูลที่ดึงจาก fragment

  const telegramDataBase64 = urlHash.replace("#tgAuthResult=", ""); // ลบ '#tgAuthResult=' ออก
  // console.log("Telegram Data (Base64):", telegramDataBase64); // ตรวจสอบข้อมูลที่ได้เป็น Base64

  if (telegramDataBase64) {
    try {
      // ถอดรหัส Base64
      const telegramData = atob(telegramDataBase64);
     // console.log("Decoded Telegram Data:", telegramData); // ตรวจสอบข้อมูลที่ถอดรหัส
      // แปลงข้อมูลเป็น JSON
      const user = JSON.parse(telegramData);
      const { id, first_name, last_name, photo_url,username } = user;

      // console.log("Telegram User Data:", user);

      const result = await Swal.fire({
        title: `ยินดีต้อนรับคุณ\n${first_name} ${last_name}`,
        html: `คุณต้องการเข้าสู่ระบบด้วยเทเลแกรม<br>ไอดี : ${id} <br> บัญชี : ${username} หรือไม่? `,
        imageUrl: photo_url,
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "User Photo",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#24A1DE",
        cancelButtonColor: "#d33",
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        // หากผู้ใช้กดยืนยัน ให้ดำเนินการกับข้อมูล user
        // localStorage.setItem("chatId", id);
        await getmember(id, photo_url,username,"telegram");        
      } else {
        Swal.fire({
          icon: "info",
          title: "คุณเลือกยกเลิกการเข้าสู่ระบบ",
          confirmButtonColor: "#0ef",
        });
      }
      window.location.hash = "";
    } catch (error) {
      //  showNoMessageAlert();
      Swal.fire({
        icon: "error",
        title: "Error parsing Telegram data.",
        text: error.message,
        confirmButtonColor: "#0ef",
      });
    }
  } else {
    // Swal.fire({
    //     icon: "error",
    //     title: "Failed to log in via Telegram.",
    //     confirmButtonColor: "#0ef",
    // });
  }
}
async function getmember(yourid, yourpic, profile, useapp) {
   showLoading();

  // ฟังก์ชันแสดง Swal
  function displaySwal(icon, title, text, confirmButtonText, cancelButtonText, denyButtonText) {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      allowOutsideClick: false,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      denyButtonText: denyButtonText,
      showCancelButton: !!cancelButtonText,
      showDenyButton: !!denyButtonText,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#0073E6",
    });
  }

  // ฟังก์ชันบันทึกข้อมูลผู้ใช้ลงใน Local Storage
  function saveUserToLocalStorage(user) {
    for (let key in user) {
      localStorage.setItem(key, user[key]);
    }
  }

  try {
    let gas = `https://script.google.com/macros/s/AKfycbyY-5A1mpNjJjD9CjPEX4fSW5N6xB7PoMAODHgjMJuuLARrCjvm5csgFamB8MKbjUB9/exec?id=${yourid}&profile=${profile}`;
    const records = await fetch(gas);
    const data = await records.json();

  if (data.user.length === 0)  {
      // กรณีไม่พบข้อมูลผู้ใช้
      // localStorage.removeItem("chatId");
      let headertext, bodytext;
      if (useapp === "line") {
        headertext = "ไม่พบข้อมูลของคุณในระบบ";
        bodytext = "กรุณาสมัครสมาชิกก่อนใช้งาน";
      } else if (useapp === "telegram") {
        headertext = "ไม่พบการเชื่อมต่อ Telegram";
        bodytext = "โปรด Login ด้วย Line ก่อน แล้วทำการ เชื่อมต่อ Telegram ที่เมนูหน้าลงเวลา";
      }

      const result = await displaySwal(
        "error",
        headertext,
        bodytext,
        "ลองอีกครั้ง",
        "ยกเลิก",
        "สมัครสมาชิกใหม่"
      );

      if (result.isConfirmed) {
        main();
      }
      if (result.isDenied) {
        window.location.href = "register.html"; // ไปยังหน้าสมัครสมาชิก
      }

      try {
        liff.closeWindow();
      } catch (error) {
        setTimeout(() => location.reload(), 500); // รีเฟรชหน้าในกรณีปิดหน้าต่างไม่สำเร็จ
      }
    } else {
      // กรณีพบข้อมูลผู้ใช้
      localStorage.setItem("yourpic", yourpic);
      data.user.forEach(saveUserToLocalStorage);

      Swal.fire({
        icon: "success",
        title: "ลงชื่อเข้าใช้สำเร็จแล้ว",
        confirmButtonColor: "#0ef",
        allowOutsideClick: false,
      }).then(() => {
        window.location.href = "index.html"; // ไปยังหน้าแรก
      });
    }
  } catch (error) {
    // กรณีเกิดข้อผิดพลาดระหว่างการเรียก API
    Swal.fire({
      icon: "error",
      title: "ข้อผิดพลาด",
      text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
    });
  } finally {
    hideLoading(); // ซ่อนหน้าจอโหลด
  }
}
