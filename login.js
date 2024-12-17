document.addEventListener("DOMContentLoaded", function () {
  const uuid = localStorage.getItem("uuid");
  if (uuid) {
    window.location.href = "index.html"; 
  }
});

function clearLocal() {
  Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: "การดำเนินการนี้จะลบข้อมูลทั้งหมดใน Local Storage อย่างถาวร",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "ใช่, ลบข้อมูล!",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      Swal.fire({
        confirmButtonColor: "#0ef",
        icon: "success",
        title: "ข้อมูลใน Local Storage ถูกลบเรียบร้อยแล้ว",
      });
    }
  });
}

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}

async function getProfile() {
  try {
    const profile = await liff.getProfile();
    const { displayName, userId, pictureUrl, statusMessage } = profile;

    Swal.fire({
      title: `ยินดีต้อนรับคุณ\n${displayName}`,
      html: `สถานะ : ${statusMessage}<br><br><strong>คุณต้องการเข้าสู่ระบบด้วยบัญชีไลน์นี้หรือไม่?</strong>`,
      imageUrl: pictureUrl,
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
        getMember(userId, pictureUrl, displayName, "line");
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

async function main() {
  hideLoading();
 await liff.init({ liffId: "1654797991-pr0xKPxW" });
//  await liff.init({ liffId: "1654797991-Xmxp3Gpj" }); // ทดสอบ
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login({ redirectUri: window.location.href });
  }
}

const botUsername = "TimestampNotifybot";
const botId = "7733040493";

// const botUsername = "wisanusenhombot";
// const botId = "7781010431";

function telegramLogin() {
  const originUrl = "https://wisanusenhom.github.io/nu/login.html";
  // const originUrl = "https://1a52-125-24-90-98.ngrok-free.app/login.html"; // test telegram login
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${originUrl}&embed=1`;
  window.open(authUrl, "_self");
}

window.addEventListener("load", handleTelegramCallback);

async function handleTelegramCallback() {
  const urlHash = window.location.hash;
  const telegramDataBase64 = urlHash.replace("#tgAuthResult=", "");

  if (telegramDataBase64) {
    try {
      const telegramData = atob(telegramDataBase64);
      const user = JSON.parse(telegramData);
      const { id, first_name, last_name, photo_url, username } = user;

      const result = await Swal.fire({
        title: `ยินดีต้อนรับคุณ\n${first_name} ${last_name}`,
        html: `คุณต้องการเข้าสู่ระบบด้วยเทเลแกรม<br>ไอดี : ${id} <br> บัญชี : ${username} หรือไม่?`,
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
        await getMember(id, photo_url, username, "telegram");
      } else {
        Swal.fire({
          icon: "info",
          title: "คุณเลือกยกเลิกการเข้าสู่ระบบ",
          confirmButtonColor: "#0ef",
        });
      }
      window.location.hash = "";
    } catch (error) {
      main();
      // Swal.fire({
      //   icon: "error",
      //   title: "Error parsing Telegram data.",
      //   text: error.message,
      //   confirmButtonColor: "#0ef",
      // });
    }
  }
}

// login
async function getMember(yourId, yourPic, profile, useApp) {
  showLoading();

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

  function saveUserToLocalStorage(user) {
    for (let key in user) {
      localStorage.setItem(key, user[key]);
    }
  }

  try {
    const gas = `https://script.google.com/macros/s/AKfycbyY-5A1mpNjJjD9CjPEX4fSW5N6xB7PoMAODHgjMJuuLARrCjvm5csgFamB8MKbjUB9/exec?id=${yourId}&profile=${profile}`;
    const records = await fetch(gas);
    const data = await records.json();

    if (data.user.length === 0) {
      let headerText, bodyText;
      if (useApp === "line") {
        headerText = "ไม่พบข้อมูลของคุณในระบบ";
        bodyText = "กรุณาสมัครสมาชิกก่อนใช้งาน";
      } else if (useApp === "telegram") {
        headerText = "ไม่พบการเชื่อมต่อ Telegram";
        bodyText = "โปรด Login ด้วย Line ก่อน แล้วทำการ เชื่อมต่อ Telegram ที่เมนูหน้าลงเวลา";
      }

      const result = await displaySwal(
        "error",
        headerText,
        bodyText,
        "ลองอีกครั้ง",
        "ยกเลิก",
        "สมัครสมาชิกใหม่"
      );

      if (result.isConfirmed) {
        main();
      }
      if (result.isDenied) {
        window.location.href = "register.html";
      }

      try {
        liff.closeWindow();
      } catch (error) {
        setTimeout(() => location.reload(), 500);
      }
    } else {
      localStorage.setItem("yourpic", yourPic);
      data.user.forEach(saveUserToLocalStorage);

      Swal.fire({
        icon: "success",
        title: "ลงชื่อเข้าใช้สำเร็จแล้ว",
        confirmButtonColor: "#0ef",
        allowOutsideClick: false,
      }).then(() => {
        window.location.href = "index.html";
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ข้อผิดพลาด",
      text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
    });
  } finally {
    hideLoading();
  }
}
