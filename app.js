document.addEventListener("DOMContentLoaded", function () {

    // Check operating system
    // const isWindows = /Windows/i.test(navigator.userAgent);
    // const isMacOS = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent);
  
    // if (isWindows || isMacOS) {
    //     Swal.fire({
    //         title: 'อุปกรณ์นี้ไม่ใช่สมาร์ทโฟน',
    //         text: 'กรุณาใช้สมาร์ทโฟน (Android หรือ iPhone) ในการลงเวลาปฏิบัติงาน เพื่อความแม่นยำของตำแหน่งพิกัด',
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'ออกจากระบบ',
    //         cancelButtonText: 'ดำเนินการต่อ',
    //         confirmButtonColor: "#22BB33",
    //         cancelButtonColor: "#FF0505",
    //         allowOutsideClick: false,
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //           localStorage.clear();
    //             window.location.href = 'about:blank'; // Exit system
    //         } else if (result.dismiss === Swal.DismissReason.cancel) {
    //             Swal.fire({
    //                 title: 'การใช้งานได้รับการอนุญาต',
    //                 text: 'คุณสามารถดำเนินการต่อบนอุปกรณ์นี้ได้',
    //                 icon: 'info',
    //                 confirmButtonColor: "#24A1DE",
    //             });
    //         }
    //     });
    // }

    // Swal.fire({
    //   title: "กรุณารอสักครู่...",
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
  
    // Check for UUID in localStorage
    const uuid = localStorage.getItem("uuid");
    if (!uuid) {
        console.log("User is not logged in. Redirecting to login page.");
        window.location.href = "login.html";
        return;
    }
    // Update user information
    // Swal.close();
    alertUpdate();
    updateUser(uuid);
  
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
  
  async function updateUser(uuid) {
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
      // icon: "info",
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
    if (!yourpic || yourpic.trim() === "" || yourpic === 'undefined') {
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
          // icon: "info",
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
  
 
    function logupdate() {
      Swal.fire({
        title: "การปรับปรุงล่าสุด",
        html: 
        "<strong>10 ม.ค. 2568</strong><br>" +
          "ออกแบบหน้าลงเวลาใหม่<br><br>" +
          "<strong>19 พ.ย. 2567</strong><br>" +
          "เพิ่มการแจ้งเตือนผ่าน Telegram<br><br>" +
          "<strong>1 พ.ย. 2567</strong><br>" +
          "1. เพิ่มระบบรหัสยืนยันข้อมูล<br>" +
          "2. เพิ่มฟังก์ชันยกเลิกการลงเวลา<br>" +
          "3. ปรับปรุง UI ให้ใช้งานสะดวกยิ่งขึ้น<br><br>" +
          "<strong>21 ต.ค. 2567</strong><br>" +
          "1. ยกเลิกการตรวจสอบการลงเวลามาที่ระบบหลังบ้าน<br>" +
          "2. เพิ่มฟังก์ชันตรวจสอบผ่านระบบหน้าบ้าน<br>" +
          "3. ตั้งทริกเกอร์ลบข้อมูลซ้ำซ้อนอัตโนมัติ",
        icon: "info",
        confirmButtonText: "ตกลง",
        showCloseButton: true,
        confirmButtonColor: "#008000",
      });
    }


        // ฟังก์ชันสำหรับตั้งค่าภาพพื้นหลังจาก LocalStorage
function applyBackgroundImage() {
  const storedImage = localStorage.getItem("backgroundImage");
  if (storedImage) {
    document.body.style.backgroundImage = `url('${storedImage}')`;
  } else {
    document.body.style.backgroundImage = "none";
  }
}

// ฟังก์ชันลดขนาดภาพ
function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // คำนวณขนาดใหม่เพื่อรักษาสัดส่วนของภาพ
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // ตั้งค่าขนาด canvas
      canvas.width = width;
      canvas.height = height;

      // วาดภาพลงใน canvas
      ctx.drawImage(img, 0, 0, width, height);

      // แปลง canvas เป็น Data URL
      const resizedImage = canvas.toDataURL("image/jpeg", 0.8); // ลดคุณภาพเล็กน้อย (0.8)
      callback(resizedImage);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ฟังก์ชันสำหรับอัปโหลดภาพด้วย SweetAlert
async function uploadImage() {
  const { value: file } = await Swal.fire({
    title: "เลือกภาพเพื่อเปลี่ยนพื้นหลัง",
    text: "กรุณาเลือกภาพที่มีขนาดพอดีกับหน้าจอ หรือแก้ไขรูปให้พอดีกับหน้าจอ",
    input: "file",
    inputAttributes: {
      accept: "image/*",
      "aria-label": "บันทึกภาพพื้นหลัง"
    },
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "ตั้งเป็นพื้นหลัง",
    denyButtonText: "ลบพื้นหลัง",
    cancelButtonText: "ยกเลิก"
  });

  if (file) {
    resizeImage(file, 1920, 1080, (resizedImage) => {
      Swal.fire({
        title: "ดูตัวอย่างภาพที่คุณเลือก",
        imageUrl: resizedImage,
        imageAlt: "ภาพที่จะบันทึก",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "ตั้งเป็นพื้นหลัง",
        denyButtonText: "ลบพื้นหลัง",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("backgroundImage", resizedImage);
          applyBackgroundImage();
          Swal.fire("สำเร็จ", "พื้นหลังได้ถูกเปลี่ยนแล้ว!", "success");
        } else if (result.isDenied) {
          localStorage.removeItem("backgroundImage");
          applyBackgroundImage();
          Swal.fire("ลบสำเร็จ", "พื้นหลังได้ถูกลบแล้ว!", "info");
        }
      });
    });
  } else if (!file && localStorage.getItem("backgroundImage")) {
    const clearResult = await Swal.fire({
      title: "ลบพื้นหลัง?",
      text: "คุณต้องการลบพื้นหลังปัจจุบันหรือไม่?",
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "ไม่ลบ",
      denyButtonText: "ลบพื้นหลัง",
      cancelButtonText: "ยกเลิก"
    });

    if (clearResult.isDenied) {
      localStorage.removeItem("backgroundImage");
      applyBackgroundImage();
      Swal.fire("ลบสำเร็จ", "พื้นหลังได้ถูกลบแล้ว!", "info");
    }
  }
}

applyBackgroundImage();     

// Check localStorage for the saved state and apply it
document.addEventListener('DOMContentLoaded', function () {
  const mainContent = document.getElementById('mainContent');
  const showHideButton = document.getElementById('showHide');

  // Retrieve the stored state from localStorage
  const isCollapsed = localStorage.getItem('containerCollapsed') === 'true';

  // Apply the collapsed state to the container
  if (isCollapsed) {
      mainContent.classList.add('collapsed');
      showHideButton.textContent = 'แสดง'; // Change button text to 'Show'
  } else {
      showHideButton.textContent = 'ซ่อน'; // Change button text to 'Hide'
  }

  // Add event listener for button click
  showHideButton.addEventListener('click', function () {
      // Toggle the collapsed state
      mainContent.classList.toggle('collapsed');

      // Update localStorage with the new state
      const isCollapsed = mainContent.classList.contains('collapsed');
      localStorage.setItem('containerCollapsed', isCollapsed);

      // Change the button text based on the new state
      showHideButton.textContent = isCollapsed ? 'แสดง' : 'ซ่อน';
  });
});

function alertUpdate() {
  // ตรวจสอบค่าใน local storage
  const logUpdate = localStorage.getItem('logUpdate');
  console.log("logUpdate from localStorage:", logUpdate); // ตรวจสอบค่าใน console

  // หากค่า logUpdate ไม่เท่ากับ 1 หรือไม่มี logUpdate
  if (logUpdate !== '1' || !logUpdate) {
    console.log('ข้อมูลยังไม่ได้รับการอัปเดต'); // ตรวจสอบว่าผ่านเงื่อนไขนี้หรือไม่

    // แสดง Swal.fire
    Swal.fire({
      title: 'แจ้งเตือนการปรับปรุง',
      html: `<div style="text-align: left;">
      <ol style="padding-left: 20px; line-height: 1.8;">
        <li>สามารถเปลี่ยนสีธีมได้ โดยกดปุ่ม <i class="fa-solid fa-sun"></i> ข้างปุ่ม <i class="fa-solid fa-bars"></i></li>
        <li>กำหนดภาพพื้นหลังได้ โดยกดปุ่ม <i class="fa-solid fa-bars"></i> เลือกเมนู <i class="fa-solid fa-gear"></i> ตั้งค่าภาพพื้นหลัง</li>
        <li>สามารถซ่อนหรือแสดงส่วนแสดงแผนที่ได้</li>
      </ol>
    </div>`,
      input: 'checkbox', // ตัวเลือกแสดง checkbox
      inputPlaceholder: 'ไม่ต้องแสดงอีก', // ข้อความใน input
      confirmButtonText: 'รับทราบ',
    }).then((result) => {
      if (result.isConfirmed) {
        // เมื่อผู้ใช้กดรับทราบ ให้บันทึกค่า logUpdate = 1
        if (result.value) {
          // ถ้าเลือกไม่ให้แสดงอีก
          localStorage.setItem('logUpdate', '1');
          console.log('logUpdate set to 1'); // ตรวจสอบว่าได้ตั้งค่าแล้ว
        }
      }
    });
  }
}

