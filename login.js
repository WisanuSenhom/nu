async function getProfile() {
  const profile = await liff.getProfile();
  const displayName = profile.displayName + " LINE";
  const yourid = profile.userId;
  const yourpic = profile.pictureUrl;
  getmember(yourid, yourpic, displayName);
}

async function getmember(yourid, yourpic, profile) {
  // localStorage.clear();
  // console.log(profile);
  showLoading();
  let gas = `https://script.google.com/macros/s/AKfycbyY-5A1mpNjJjD9CjPEX4fSW5N6xB7PoMAODHgjMJuuLARrCjvm5csgFamB8MKbjUB9/exec?id=${yourid}&profile=${profile}`;
  const records = await fetch(gas);
  const data = await records.json();
  //  // console.log(data.user);
  if (data.user === null || data.user === undefined || data.user == 0) {
    Swal.fire({
      icon: "error",
      title: "ไม่พบข้อมูลของคุณในระบบ หรือไม่พบการเชื่อมต่อ Telegram",
      text: "หากคุณ Login ด้วย Telegram โปรด Login ด้วย Line ก่อน แล้วทำการ เชื่อมต่อ Telegram ที่เมนูหน้าลงเวลา",
      allowOutsideClick: false,
      confirmButtonText: "ลองอีกครั้ง", // กำหนดชื่อปุ่มยืนยัน
      showCancelButton: true, // แสดงปุ่มยกเลิก
      cancelButtonText: "ยกเลิก", // กำหนดชื่อปุ่มยกเลิก
      showDenyButton: true, // แสดงปุ่ม Deny
      denyButtonText: "สมัครสมาชิกใหม่", // กำหนดชื่อปุ่ม Deny
    }).then((result) => {
      // ตรวจสอบผลการตอบสนองจากผู้ใช้
      if (result.isConfirmed) {
        // หากกดปุ่มยืนยัน
        main();
      } else if (result.isDenied) {
        // หากกดปุ่ม Deny
        // console.log("Deny");
        window.location.href = "register.html"; // ไปยัง register.html
      }
      try {
        liff.closeWindow();
      } catch (error) {
        // console.error("Failed to close window, refreshing...");
        location.reload(); // รีเฟรชหน้า
      }

      // Use a timeout to refresh the page after trying to close the window
      setTimeout(() => {
        location.reload(); // Refresh if liff.closeWindow() does not work
      }, 500); // Adjust the delay time as needed (500ms in this case)
    });
  } else {
    localStorage.setItem("yourpic", yourpic);
    data.user.forEach(function (user) {
      localStorage.setItem("uuid", user.uuid);
      localStorage.setItem("cidhash", user.cidhash);
      localStorage.setItem("userid", user.userid);
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
      localStorage.setItem("docno", user.docno);
      localStorage.setItem("upic", user.upic);
      localStorage.setItem("refid", user.refid);
      localStorage.setItem("rank", user.rank);

      Swal.fire({
        confirmButtonColor: "#0ef",
        icon: "success",
        title: "ลงชื่อเข้าใช้สำเร็จแล้ว",
        allowOutsideClick: false,
      }).then((result) => {
        // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
        if (result.isConfirmed) {
          // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
          window.location.href = "index.html";
          // console.log("สำเร็จ");
        }
      });
    });
    hideLoading();
  }
}

function clearLocal() {
  // เรียกใช้ localStorage.clear() เพื่อลบข้อมูลทั้งหมดใน Local Storage
  localStorage.clear();

  Swal.fire({
    confirmButtonColor: "#0ef",
    icon: "success",
    title: "Local Storage has been cleared.",
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

// Line Login
async function main() {
  hideLoading();
   await liff.init({ liffId: "1654797991-pr0xKPxW" });
//  await liff.init({ liffId: "1654797991-Xmxp3Gpj" });
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login();
  }
}

// Telegram Login

const botUsername = "TimestampNotifybot"; // Bot username
const botId = "7733040493"; // Bot ID from @BotFather

function telegramLogin() {
  // const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&embed=1`;
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=https://wisanusenhom.github.io/nu/login.html&embed=1`;
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
      const { id, first_name, last_name, photo_url } = user;

      // console.log("Telegram User Data:", user);

      const result = await Swal.fire({
        title: `ยินดีต้อนรับคุณ : , ${first_name} ${last_name}`,
        text: `คุณต้องการดำเนินการต่อด้วยบัญชีนี้หรือไม่?`,
        imageUrl: photo_url,
        imageWidth: 100,
        imageHeight: 100,
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
        localStorage.setItem("chatId", id);
        await getmember(id, photo_url, `${first_name} ${last_name}`);
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

function showNoMessageAlert() {
  const telegramqr =
    "https://lh5.googleusercontent.com/d/1aC5SsCMqeGgYIBzwNRdXnrjTZCyANIg-";
  Swal.fire({
    title: "ไม่พบ message.chat.id",
    html: `
      <p>กรุณาตรวจสอบว่าคุณได้เพิ่มเพื่อน "<strong>ลงเวลา</strong>" แล้วหรือยัง</p>
      <p>หากยังไม่ได้เพิ่มเพื่อน กรุณาเพิ่มเพื่อนก่อนโดยคลิกที่ปุ่มด้านล่าง:</p>
    `,
    imageUrl: telegramqr,
    imageWidth: 200,
    imageHeight: 240,
    imageAlt: "QR Code",
    icon: "error",
    confirmButtonText: "เพิ่มเพื่อน",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#24A1DE",
    cancelButtonColor: "#6F7378",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("https://t.me/TimestampNotifyBot", "_blank");
    }
  });
}
