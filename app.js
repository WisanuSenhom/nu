document.addEventListener("DOMContentLoaded", function () {
  showLoading();

  // Check operating system
  const isWindows = /Windows/i.test(navigator.userAgent);
  const isMacOS = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent);

  if (isWindows || isMacOS) {
      Swal.fire({
          title: 'อุปกรณ์นี้ไม่ใช่สมาร์ทโฟน',
          text: 'กรุณาใช้สมาร์ทโฟน (Android หรือ iPhone) ในการลงเวลาปฏิบัติงาน เพื่อความแม่นยำของตำแหน่งพิกัด',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'ออกจากระบบ',
          cancelButtonText: 'ดำเนินการต่อ',
          confirmButtonColor: "#22BB33",
          cancelButtonColor: "#FF0505",
          allowOutsideClick: false,
      }).then((result) => {
          if (result.isConfirmed) {
            localStorage.clear();
              window.location.href = 'about:blank'; // Exit system
          } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire({
                  title: 'การใช้งานได้รับการอนุญาต',
                  text: 'คุณสามารถดำเนินการต่อบนอุปกรณ์นี้ได้',
                  icon: 'info',
                  confirmButtonColor: "#24A1DE",
              });
          }
      });
  }

  // Check for UUID in localStorage
  const uuid = localStorage.getItem("uuid");
  if (!uuid) {
      console.log("User is not logged in. Redirecting to login page.");
      window.location.href = "login.html";
      return;
  }

  // Update user information
  updateUser(uuid);

  // Geolocation logic
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const earthRadius = 6371; // Earth's radius in kilometers
      const radLat1 = (Math.PI * lat1) / 180;
      const radLon1 = (Math.PI * lon1) / 180;
      const radLat2 = (Math.PI * lat2) / 180;
      const radLon2 = (Math.PI * lon2) / 180;
      const latDiff = radLat2 - radLat1;
      const lonDiff = radLon2 - radLon1;
      const a = Math.sin(latDiff / 2) ** 2 +
                Math.cos(radLat1) * Math.cos(radLat2) *
                Math.sin(lonDiff / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return earthRadius * c; // Distance in kilometers
  };

  const displayDistance = (distance) => {
      let xdistance = distance.toFixed(2);
      let unit = 'กม.';
      if (xdistance < 1) {
          xdistance = (xdistance * 1000).toFixed(0);
          unit = 'ม.';
      }

      const dispDistanceElement = document.getElementById('dispDistance');
      dispDistanceElement.textContent = `${localStorage.getItem("office")} : ${xdistance} ${unit}`;

      dispDistanceElement.style.color = parseFloat(distance) > 30 ? 'red' : ''; // Highlight if distance > 30km
  };

  const dispDistanceElement = document.getElementById('dispDistance');
  const isTelegram = /Telegram/i.test(navigator.userAgent);

  if (!isTelegram) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const currentLat = position.coords.latitude;
              const currentLon = position.coords.longitude;
              const targetLat = parseFloat(localStorage.getItem('oflat'));
              const targetLon = parseFloat(localStorage.getItem('oflong'));

              if (isNaN(targetLat) || isNaN(targetLon)) {
                  console.error("Target coordinates are not set.");
                  dispDistanceElement.textContent = 'ข้อมูลพิกัดสำนักงานไม่ถูกต้อง';
                  dispDistanceElement.style.color = 'red';
                  return;
              }

              const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
              displayDistance(distance);
          },
          (error) => {
              console.error('Error getting geolocation:', error);
              dispDistanceElement.textContent = 'กรุณาเปิดตำแหน่งของอุปกรณ์';
              dispDistanceElement.style.color = 'red';
          }
      );
  } else {
      console.log('The application is running in Telegram, so the distance function will not be called.');
      dispDistanceElement.textContent = '';
      dispDistanceElement.style.color = '';
  }
});


function clearLocal() {
  // เรียกใช้ localStorage.clear() เพื่อลบข้อมูลทั้งหมดใน Local Storage
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'กด "ตกลง" เพื่อดำเนินการออกจากระบบ',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
cancelButtonColor: '#6F7378'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      Swal.fire({
        confirmButtonColor: "#0ef",
        icon: "success",
        title: "ออกจากระบบสำเร็จ",
        confirmButtonColor: "#008000"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "login.html";
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
    }
  });
}

function checktoken() {
  urlapi =
    "https://script.google.com/macros/s/AKfycbwSQn-VpYHC6lGntFx3eqZbeGW5_MJhOvT9bynDi7j6wlFpkJILoM1ADjhlz3AuoUVLWQ/exec";
  queryapi = `?id=${localStorage.getItem("uuid")}`;
  fetch(urlapi + queryapi)
    .then((response) => response.json())
    .then((data) => {
      data.user.forEach(function (user) {
        if (user.token && user.token.trim() !== "") {
          liff.closeWindow();
        } else {
          // If user.token is empty or undefined, call fn
          createtoken();
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function createtoken() {
  Swal.fire({
    title: "ไม่พบ LINE TOKEN ในระบบ",
    text: "กด ตกลง เพื่อออก Line Token หรือกดรับค่าใหม่ในกรณีออก Token แล้ว",
    icon: "warning",
    confirmButtonText: "ตกลง",
    cancelButtonText: "รับค่าใหม่",
    showCancelButton: true,
    confirmButtonColor: "#008000",
    cancelButtonColor: '#6F7378',
    imageUrl:
      "https://lh5.googleusercontent.com/d/1vCuMH9g4FDHdqoi3hOJi7YY005fBpx9a",
    imageWidth: 350,
    imageHeight: 550,
    imageAlt: "Custom image",
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirect to the specified URL
      window.location.href = "token.html";
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Clear local storage
      localStorage.clear();
    }
  });
}

function openWebAdmin() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'คลิก "ตกลง" เพื่อเข้าสู่ระบบการจัดการการลงเวลาปฏิบัติงาน',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
cancelButtonColor: '#6F7378'
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("https://wisanusenhom.github.io/sekatime/", "_blank");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
    }
  });
}

function openWeb5s() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'คลิก "ตกลง" เพื่อเข้าสู่ระบบการจัดการงาน 5 ส.',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
cancelButtonColor: '#6F7378'
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("https://wisanusenhom.github.io/5s/", "_blank");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
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
  //  checktoday();
}

async function checktoday() {
  // แสดงสถานะกำลังโหลดข้อมูล
  Swal.fire({
    title: "กำลังโหลดข้อมูล...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  var gas =
    "https://script.google.com/macros/s/AKfycby0bCwNY5tyoVzfb1aM_48Yvs0PInOqUEnb_Aw2Bdyt4t2dBQ-m3FBA4lkMtmgaYHC53w/exec";
  var qdata = `?id=${localStorage.getItem("refid")}&db=${localStorage.getItem(
    "db1"
  )}`;

  await fetch(gas + qdata)
    .then((response) => response.json())
    .then((data) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();

      if (data.cc && data.cc.length > 0) {
        // Assuming the server response has a property named 'cc' and 'intime'
        var timelineData = `วันนี้คุณลงเวลามาแล้ว : การปฏิบัติงาน ${data.cc[0].intype} \nลงเวลาเมื่อ ${data.cc[0].intime}  ระยะ ${data.cc[0].indistan} ${data.cc[0].inunit}`;
        const cktoday = new Date();
        const ckfd = cktoday.toLocaleDateString("th-TH"); 
        localStorage.setItem("datecheck", ckfd);
        localStorage.setItem("datetimecheck", data.cc[0].intime);
        // แสดงข้อมูลที่ดึงมาใน Swal
        Swal.fire({
          icon: "success",
          title: "ตรวจสอบการลงเวลา",
          text: timelineData,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#008000"
        });
      } else {
        var timelineData = `วันนี้คุณยังไม่ได้ลงเวลามาปฏิบัติงาน`;

        // แสดงข้อความเตือนใน Swal
        Swal.fire({
          icon: "warning",
          title: "ตรวจสอบการลงเวลา",
          text: timelineData,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#DBA800"
        });
      }
    })
    .catch((error) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();

      console.error("Error fetching data:", error);

      // แสดงข้อความผิดพลาดใน Swal
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#bb2124"
      });
    });
}


function openWebToken() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'คลิก "ตกลง" เพื่อออกไลน์โทเค็นสำหรับการแจ้งเตือนผ่านไลน์',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
cancelButtonColor: '#6F7378'
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("token.html", "_blank");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
    }
  });
}

function logupdate() {
  Swal.fire({
    title: "การปรับปรุงล่าสุด",
    html:
    "<strong>วันที่ 19 พฤศิจกายน 2567</strong><br>" +
    "1. เพิ่มการเชื่อมต่อและการแจ้งเตือนผ่าน Telegram เพื่อความสะดวกในการสื่อสาร<br><br>" +
      "<strong>วันที่ 1 พฤศิจกายน 2567</strong><br>" +
      "1. เพิ่มระบบรหัสยืนยันข้อมูลทั้งในหน้าบ้านและหลังบ้าน เพื่อเพิ่มความปลอดภัย<br>" +
      "2. เพิ่มฟังก์ชันยกเลิกการลงเวลา ช่วยเพิ่มความยืดหยุ่นในการใช้งาน<br>" +
      "3. เพิ่มการตรวจสอบตำแหน่งและระยะทางผ่าน Google Maps เพื่อความถูกต้องในการระบุตำแหน่ง<br>" +
      "4. ปรับปรุงเมนู ข้อความ และองค์ประกอบ UI เพื่อความสะดวกในการใช้งาน<br><br>" +
      "<strong>วันที่ 21 ตุลาคม 2567</strong><br>" +
      "1. ยกเลิกการตรวจสอบการลงเวลาที่ระบบหลังบ้าน เพื่อให้ใช้งานได้สะดวกยิ่งขึ้น<br>" +
      "2. เพิ่มฟังก์ชันตรวจสอบการลงเวลาผ่านระบบหน้าบ้าน ช่วยให้การใช้งานรวดเร็วและง่ายดาย<br>" +
      "3. ตั้งทริกเกอร์ตรวจสอบและลบข้อมูลซ้ำซ้อนโดยอัตโนมัติในช่วงเวลา 03:00 - 04:00 น.<br>",
    icon: "info",
    confirmButtonText: "ตกลง",
    showCloseButton: true,
    confirmButtonColor: "#008000",
  });
}

function checkinfo() {
  let today = new Date();
  let formattedToday = today.toLocaleDateString("th-TH");

  let dateCheck = localStorage.getItem("datecheck");
  let timeCheck = localStorage.getItem("datetimecheck");
  let dateCheckout = localStorage.getItem("datecheckout");
  let timeCheckout = localStorage.getItem("datetimecheckout");

  if (
    (formattedToday === dateCheck && !dateCheckout) ||
    (formattedToday === dateCheck && formattedToday !== dateCheckout)
  ) {
    // Case: User has checked in but not yet checked out
    Swal.fire({
      title: "การลงเวลามาปฏิบัติงาน",
      html:
        "ท่านได้ลงเวลาปฏิบัติงานในวันที่ <strong>" +
        dateCheck +
        "</strong> เวลา <strong>" +
        timeCheck +
        " น.</strong> เรียบร้อยแล้ว",
      icon: "info",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      confirmButtonColor: "#1919FF",
      customClass: {
        title: "text-primary",
        content: "text-muted",
      },
    });
  } else if (formattedToday === dateCheck && formattedToday === dateCheckout) {
    // Case: User has checked in and out
    Swal.fire({
      title: "การลงเวลาปฏิบัติงาน",
      html:
        "ท่านได้ลงเวลาปฏิบัติงานในวันที่ <strong>" +
        dateCheck +
        "</strong> เวลา <strong>" +
        timeCheck +
        " น.</strong> และได้ลงเวลาสิ้นสุดการปฏิบัติงานในเวลา <strong>" +
        timeCheckout +
        " น.</strong> เรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      confirmButtonColor: "#008000",
      customClass: {
        title: "text-success",
        content: "text-muted",
      },
    });
  } else if (
    (formattedToday != dateCheck && formattedToday === dateCheckout) ||
    (!dateCheck && formattedToday === dateCheckout)
  ) {
    // Case: User has checked in and out
    Swal.fire({
      title: "การลงเวลาปฏิบัติงาน",
      html:
        "ท่านไม่ได้ลงบันทึกเวลาเข้ามาทำงานในวันที่ <strong>" +
        dateCheckout +
        "</strong> ระบบได้ส่งคำขอการบันทึกเวลาเข้ามาทำงานให้ท่านแล้ว โดยท่านได้ลงบันทึกเวลาเลิกงานเรียบร้อยแล้วในเวลา <strong>" +
        timeCheckout +
        " น.</strong>",
      icon: "warning",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      confirmButtonColor: "#DBA800",
      customClass: {
        title: "text-warning",
        content: "text-muted",
      },
    });
  }
}

function aboutme() {
  var yourpic = localStorage.getItem("upic");
  Swal.fire({
    imageUrl: yourpic,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: "Custom image",
    title: "ข้อมูลของฉัน",
    html:
      "รหัส : <strong>" +
      localStorage.getItem("refid") +
      "</strong><br>" +
      "ชื่อ : <strong>" +
      localStorage.getItem("name") +
      "</strong><br>" +
      "ตำแหน่ง : <strong>" +
      localStorage.getItem("job") +
      "</strong><br>" +
      "ประเภท : <strong>" +
      localStorage.getItem("rank") +
      "</strong><br>" +
      "หน่วยงาน : <strong>" +
      localStorage.getItem("office") +
      "</strong><br>" +
      "สังกัด : <strong>" +
      localStorage.getItem("mainsub") +
      "</strong><br>",
    icon: "info",
    confirmButtonText: "ตกลง",
    showCloseButton: true,
    confirmButtonColor: "#008000",
    customClass: {
      title: "text-primary", // Adds a primary color to the title
      content: "text-dark", // Makes the content more prominent
    },
    showDenyButton: true,
    denyButtonText: "แก้ไข",
    denyButtonColor: "#007bff",
  }).then((result) => {
    if (result.isDenied) {
      window.location.href = "https://wisanusenhom.github.io/sekatime/setting.html";
    }
  });
}

function editpic() {
  var yourpic = localStorage.getItem("yourpic");
  if (!yourpic || yourpic.trim() === "") {
    // Show a warning message using SweetAlert
    Swal.fire({
      title: "ไม่พบรูปโปรไฟล์ LINE ของคุณ",
      text: 'ระบบจะลงชื่อออกและนำคุณเข้าสู่ระบบใหม่อีกครั้ง เมื่อคุณกด "ยืนยัน" เพื่อแก้ไขปัญหานี้',
      icon: "error",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#008000",
cancelButtonColor: '#6F7378',
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
    title: "แก้ไขรูปภาพประจำตัวของคุณ.!",

    imageUrl: yourpic,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: "Custom image",

    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: "#008000",
    cancelButtonColor: '#6F7378',
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      // Show loading status
      Swal.fire({
        title: "กำลังปรับปรุงรูปโปรไฟล์...",
        text: "โปรดรอสักครู่",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false, // Hide confirm button
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });

      var urlperson = `https://script.google.com/macros/s/AKfycbyJkVKoVcJV28-1NitWY-WwST5AWHguNDO1aB-l-4ZCCYyNDuBRznMvCbyLxjLi2EJU5Q/exec`;
      var dataperson = `?id=${localStorage.getItem("uuid")}&pic=${yourpic}`;
      fetch(urlperson + dataperson)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Show a success message using SweetAlert
          Swal.fire({
            title: "สำเร็จ!",
            text: "การแก้ไขข้อมูลเสร็จสิ้น ระบบจะทำการรีเซ็ตอัตโนมัติ",
            icon: "success",
            confirmButtonColor: "#008000",
            allowOutsideClick: false,
          }).then(() => {
            localStorage.clear();
            location.reload();
          });
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch
          console.error("Fetch error:", error);

          // Show an error message using SweetAlert
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถแก้ไขข้อมูลได้",
            icon: "error",
            confirmButtonColor: "#bb2124",
          });
        });
    }
  });
}

function checkMap() {
  // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
  if (navigator.geolocation) {
    // แสดงสถานะกำลังประมวลผล
    Swal.fire({
      title: "กำลังประมวลผล...",
      text: "กำลังตรวจสอบตำแหน่งของคุณ กรุณารอสักครู่",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // ขอค่าพิกัด
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("เบราว์เซอร์ไม่รองรับ Geolocation");
  }
}

// เมื่อได้รับค่าพิกัด
async function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const destination = `${localStorage.getItem("oflat")},${localStorage.getItem(
    "oflong"
  )}`;
  const googleMapUrl = `https://www.google.co.th/maps/dir/${destination}/${latitude},${longitude}`;

  // ปิดสถานะกำลังประมวลผลเมื่อได้รับข้อมูล
  Swal.close();

  // แสดงโมดัลเพื่อยืนยันการเปิด Google Maps
  Swal.fire({
    title: "เปิด Google Maps หรือไม่?",
    text: "คุณต้องการเปิด Google Maps เพื่อดูระยะห่างระหว่างหน่วยงานกับตำแหน่งปัจจุบันของคุณหรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่",
    cancelButtonText: "ไม่",
    confirmButtonColor: "#008000",
cancelButtonColor: '#6F7378'
  }).then((result) => {
    if (result.isConfirmed) {
      // Open the Google Maps link if the user confirms
      window.open(googleMapUrl, "_blank");
    }
  });
}

// ฟังก์ชันจัดการข้อผิดพลาด
function handleError(error) {
  Swal.close(); // ปิดสถานะกำลังประมวลผลในกรณีเกิดข้อผิดพลาด
  switch (error.code) {
    case error.PERMISSION_DENIED:
      Swal.fire({
        title: "การเข้าถึงถูกปฏิเสธ",
        text: "ผู้ใช้ปฏิเสธการเข้าถึงตำแหน่งของคุณ",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      break;
    case error.POSITION_UNAVAILABLE:
      Swal.fire({
        title: "ตำแหน่งไม่พร้อมใช้งาน",
        text: "ไม่สามารถรับตำแหน่งได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      break;
    case error.TIMEOUT:
      Swal.fire({
        title: "หมดเวลา",
        text: "การขอข้อมูลใช้เวลานานเกินไป",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      break;
    case error.UNKNOWN_ERROR:
      Swal.fire({
        title: "ข้อผิดพลาดที่ไม่รู้จัก",
        text: "เกิดข้อผิดพลาดที่ไม่รู้จัก",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      break;
  }
}

// ยกเลิกการลงเวลาวันนี้
async function canceltoday() {
    const { value: accept } = await Swal.fire({
      title: "หากยกเลิกข้อมูลแล้วไม่สามารถเรียกคืนข้อมูลได้",
      input: "checkbox",
      showCancelButton: true,
      inputValue: 0,
      confirmButtonColor: "#bb2124",
      cancelButtonColor: '#6F7378',
      inputPlaceholder: `ข้าพเจ้ายอมรับและดำเนินการ ยกเลิกการลงเวลาปฏิบัติงานในวันนี้`,
      confirmButtonText: `Continue&nbsp;<i class="fa fa-arrow-right"></i>`,
      inputValidator: (result) => {
        return !result && "กรุณา ติ๊ก ยอมรับหากต้องการดำเนินการ";
      },
    });
  
    if (accept) {
      const captchaResult = await handleCaptchaVerification();
  
      if (captchaResult.isConfirmed && captchaResult.value === captchaText) {
        // แสดงสถานะกำลังดำเนินการ
        Swal.fire({
          title: "กำลังดำเนินการ...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        const gasUrl = "https://script.google.com/macros/s/AKfycbyq0lc6EUpmCWS5LB30Yv2M7exyHR6IEf7PeerHLPApFtIPQiRCep9XtDSX4yHAjYvB-w/exec";
        const qdata = `?refid=${localStorage.getItem("refid")}&db1=${localStorage.getItem("db1")}&name=${localStorage.getItem("name")}&token=${localStorage.getItem("token")}&userid=${localStorage.getItem("userid")}`;
  
        try {
          const response = await fetch(gasUrl + qdata);
  
          if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error fetching data:", errorResponse);
  
            Swal.fire({
              icon: "error",
              title: "ข้อผิดพลาด",
              text: errorResponse.message || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
              confirmButtonText: "ตกลง",
              showCloseButton: true,
              confirmButtonColor: "#bb2124",
              customClass: {
                title: "text-error",
                content: "text-muted",
              },
            });
            return;
          }
  
          const data = await response.json();
          Swal.close();
  
          const status = data.status;
          const message = data.message;
  
          if (status === "success") {
            Swal.fire({
              icon: "success",
              title: "สำเร็จ! ยกเลิกลงเวลาในวันนี้แล้ว",
              text: message,
              confirmButtonText: "ตกลง",
              showCloseButton: true,
              allowOutsideClick: false,
              confirmButtonColor: "#008000",
              customClass: {
                title: "text-success",
                content: "text-muted",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem("datecheckout", "");
                localStorage.setItem("datecheck", "");
                try {
                  liff.closeWindow();
                } catch (error) {
                  console.error("Failed to close window, refreshing...");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
                }
              }
            });
          } else if (status === "warning") {
            Swal.fire({
              icon: "warning",
              title: "การดำเนินการยกเลิกลงเวลาในวันนี้",
              text: message,
              confirmButtonText: "ตกลง",
              showCloseButton: true,
              confirmButtonColor: "#DBA800",
              customClass: {
                title: "text-warning",
                content: "text-muted",
              },
            });
          } else if (status === "error") {
            Swal.fire({
              icon: "error",
              title: "ผิดพลาด",
              text: message,
              confirmButtonText: "ตกลง",
              showCloseButton: true,
              confirmButtonColor: "#bb2124",
              customClass: {
                title: "text-error",
                content: "text-muted",
              },
            });
          }
        } catch (error) {
          Swal.close();
          console.error("Error fetching data:", error);
          Swal.fire({
            icon: "error",
            title: "ข้อผิดพลาด",
            text: "ไม่สามารถยกเลิกการลงเวลาในวันนี้ได้ กรุณาลองใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#BB2124", 
            showCloseButton: true,
            customClass: {
              title: "text-error",
              content: "text-muted",
            },
          });
        }
      }
    }
  }
  
  // Function to handle CAPTCHA verification
  async function handleCaptchaVerification() {
    generateCaptcha();
    let captchaResult;

    do {
        captchaResult = await Swal.fire({
            title: `กรอกรหัสยืนยันในการยกเลิกการลงเวลาของท่าน`,
            showCancelButton: true,
            confirmButtonText: `ยืนยัน&nbsp;<i class="fa-solid fa-trash"></i>`,
            html: `<canvas id="captchaPopupCanvas" width="200" height="50"></canvas><br>
                              <input type="text" id="captchaInput" class="swal2-input" placeholder="Enter the code here">`,
            confirmButtonColor: "#bb2124",
            didOpen: () => {
                drawCaptcha("captchaPopupCanvas");
            },
            preConfirm: () => {
                const userInput = document.getElementById("captchaInput").value.toUpperCase();
                if (!userInput) {
                    Swal.showValidationMessage("กรุณากรอกรหัสยืนยัน");
                    return false;
                } else if (userInput !== captchaText) {
                    Swal.showValidationMessage("รหัสยืนยันไม่ถูกต้อง กรุณาลองอีกครั้ง");
                    generateCaptcha();
                    drawCaptcha("captchaPopupCanvas");
                    return false;
                }
                return userInput;
            },
            showDenyButton: true,
            denyButtonText: `ขอรหัสใหม่`,
            denyButtonColor: "#039be5",
        });

        // Check if the deny button was clicked
        if (captchaResult.isDenied) {
            generateCaptcha();
        } 
        // Check if the cancel button was clicked
        else if (captchaResult.isDismissed) {
            location.reload(); // Refresh the page if the cancel button is pressed
        }
    } while (!captchaResult.isConfirmed);

    return captchaResult;
}

  
  // Captcha
  
  let captchaText = "";
  
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function generateCaptcha() {
    captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  function drawCaptcha(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.font = "30px Arial";
    for (let i = 0; i < captchaText.length; i++) {
      ctx.fillStyle = getRandomColor();
      ctx.fillText(captchaText[i], 30 * i + 10, 35);
    }
  }
  

// รับอ้างอิงถึงเมนูที่ต้องควบคุม
var collapsibleMenu = document.getElementById("collapsibleNavbar");
var avatarMenu = document.getElementById("avatarMenu");
var allMenus = [collapsibleMenu, avatarMenu]; // เพิ่มเมนูที่คุณต้องการจัดการ
var menuButton = document.querySelector(".navbar-toggler");
var avatarButton = document.getElementById("avatar");

// ฟังก์ชันซ่อนเมนูทั้งหมด
function hideAllMenus() {
  allMenus.forEach(function (menu) {
    $(menu).collapse("hide");
  });
}

// ฟังก์ชันแสดงเมนูปัจจุบัน
function showMenu(menu) {
  hideAllMenus(); // ซ่อนเมนูก่อนหน้า
  $(menu).collapse("show"); // แสดงเมนูที่เลือก
}

// จัดการการคลิกที่แต่ละปุ่ม
menuButton.onclick = function () {
  if ($(collapsibleMenu).hasClass("show")) {
    hideAllMenus(); // ซ่อนถ้าเมนูกำลังแสดงอยู่
  } else {
    showMenu(collapsibleMenu); // แสดงเมนู collapsibleNavbar
  }
};

avatarButton.onclick = function () {
  if ($(avatarMenu).hasClass("show")) {
    hideAllMenus(); // ซ่อนถ้าเมนูกำลังแสดงอยู่
  } else {
    showMenu(avatarMenu); // แสดงเมนู avatarMenu
  }
};

// ซ่อนเมนูเมื่อคลิกนอกเมนู
window.onclick = function (event) {
  if (
    !menuButton.contains(event.target) &&
    !collapsibleMenu.contains(event.target) &&
    !avatarButton.contains(event.target) &&
    !avatarMenu.contains(event.target)
  ) {
    hideAllMenus();
  }
};

// ตั้งค่าตัวจับเวลาซ่อนเมนูหลังจาก 20 วินาที
var menuTimeout;
function resetMenuTimeout() {
  clearTimeout(menuTimeout);
  menuTimeout = setTimeout(hideAllMenus, 20000); // ซ่อนเมนูทั้งหมดหลัง 20 วินาที
}

// รีเซ็ตตัวจับเวลาเมื่อมีการคลิกที่ปุ่มหรือตัวเมนู
collapsibleMenu.onclick = function () {
  resetMenuTimeout();
};

avatarMenu.onclick = function () {
  resetMenuTimeout();
};
