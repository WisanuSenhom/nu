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
        "<strong>5 ก.พ. 2568</strong><br>" +
        "เพิ่มระบบลงเวลาด้วย QR-code<br><br>" +
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
  const currentTheme = document.body.getAttribute("data-theme"); // ดึงธีมปัจจุบัน

  // หากมีค่า storedImage ใช้ภาพนั้น
  if (storedImage) {
    document.body.style.backgroundImage = `url('${storedImage}')`;
  } else {
    // กำหนดภาพพื้นหลังเริ่มต้นตามธีม
    const defaultBackgrounds = {
      light: "url('https://cdn.pixabay.com/photo/2017/07/31/18/17/calendar-2559708_1280.jpg')",
      dark: "url('https://cdn.pixabay.com/photo/2021/09/10/14/24/sky-6613380_1280.jpg')",
      pink: "url('https://cdn.pixabay.com/photo/2024/03/15/18/53/magnolia-flower-8635583_1280.jpg')",
      green: "url('https://cdn.pixabay.com/photo/2020/01/08/19/53/chamomile-4751118_1280.jpg')",
      blue: "url('https://cdn.pixabay.com/photo/2023/04/04/22/06/cherry-blossoms-7900305_1280.jpg')",
      purple: "url('https://cdn.pixabay.com/photo/2015/01/14/17/29/flowers-599344_1280.jpg')",
      yellow: "url('https://cdn.pixabay.com/photo/2020/04/17/23/41/macro-5057196_1280.jpg')",
      gray: "url('https://cdn.pixabay.com/photo/2023/05/29/00/24/blue-tit-8024809_1280.jpg')",
      red: "url('https://cdn.pixabay.com/photo/2019/09/17/05/42/red-rose-4482541_1280.jpg')",
    };

    document.body.style.backgroundImage = defaultBackgrounds[currentTheme] || "none";
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
    text: "กรุณาเลือกภาพที่มีขนาดพอดีกับหน้าจอ",
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



// ตรวจสอบขนาดไฟล์
// function calculateLocalStorageSize(key) {
//   const storedData = localStorage.getItem(key);
//   if (storedData) {
//     const sizeInBytes = new Blob([storedData]).size;
//     console.log(`ขนาดของ "${key}": ${sizeInBytes} bytes (${(sizeInBytes / 1024).toFixed(2)} KB)`);
//   } else {
//     console.log(`ไม่พบข้อมูลในคีย์ "${key}"`);
//   }
// }

// // ใช้งานฟังก์ชัน
// calculateLocalStorageSize("backgroundImage");

const menuToggle = document.getElementById("menu-toggle");
    const themeToggle = document.getElementById("theme-toggle");
    const menu = document.getElementById("menu");
    const body = document.body;

    // Apply theme from localStorage on page load
    // const savedTheme = localStorage.getItem("theme") || "light";
    // applyTheme(savedTheme);

    // Menu Toggle
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("show");
      document.body.classList.toggle('menu-open');

      // Toggle the icon between hamburger and "X"
      const icon = menuToggle.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-x");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      // Check if the click is outside the menu or the menu toggle button
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove("show");
        document.body.classList.remove('menu-open');

        // Reset the icon to hamburger
        const icon = menuToggle.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-x");
      }
    });

// รายการธีมที่รองรับ
const themes = ["light", "dark", "yellow", "green", "pink", "blue", "purple", "gray", "red"];
let currentThemeIndex = themes.indexOf(localStorage.getItem("theme")) || 0;

// ฟังก์ชันสำหรับตรวจสอบธีมระบบ
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return "light";
  } else {
    return "light"; // ค่าเริ่มต้นหากไม่สามารถตรวจสอบธีมระบบได้
  }
}

// ฟังก์ชันสำหรับเปลี่ยนธีม
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);

  // ไอคอนที่สอดคล้องกับแต่ละธีม
  const themeIcons = {
    light: '<i class="fa-solid fa-sun"></i>',
    dark: '<i class="fa-solid fa-moon"></i>',
    pink: '<i class="fa-solid fa-heart"></i>',
    green: '<i class="fa-solid fa-leaf"></i>',
    purple: '<i class="fa-solid fa-gem"></i>',
    yellow: '<i class="fa-solid fa-star"></i>',
    blue: '<i class="fa-solid fa-water"></i>',
    gray: '<i class="fa-solid fa-palette"></i>',
    red: '<i class="fa-solid fa-fire"></i>',
  };

  // ตั้งค่าไอคอนในปุ่ม
  themeToggle.innerHTML = themeIcons[theme] || '<i class="fa-solid fa-circle"></i>';

  // บันทึกธีมใน Local Storage
  localStorage.setItem("theme", theme);

  // อัปเดตค่า meta tags
  updateMetaTags(theme);

  // เรียกฟังก์ชันที่เกี่ยวข้องอื่น ๆ 
  applyBackgroundImage();
}

// ฟังก์ชันสำหรับอัปเดต meta tags ตามธีม
function updateMetaTags(theme) {
  let themeColor = "#ffffff"; // ค่า default
  let msNavButtonColor = "#ffffff"; // ค่า default
  let appleStatusBarStyle = "default"; // ค่า default

  switch (theme) {
    case "light":
      themeColor = "#ffffff";
      msNavButtonColor = "#ffffff";
      appleStatusBarStyle = "default";
      break;
    case "dark":
      themeColor = "#444";
      msNavButtonColor = "#444";
      appleStatusBarStyle = "black-translucent";
      break;
    case "pink":
      themeColor = "#ffebf0";
      msNavButtonColor = "#ffebf0";
      appleStatusBarStyle = "default";
      break;
    case "green":
      themeColor = "#e6f7e6";
      msNavButtonColor = "#e6f7e6";
      appleStatusBarStyle = "default";
      break;
    case "blue":
      themeColor = "#bbdefb";
      msNavButtonColor = "#bbdefb";
      appleStatusBarStyle = "default";
      break;
    case "purple":
      themeColor = "#f4ecff";
      msNavButtonColor = "#f4ecff";
      appleStatusBarStyle = "default";
      break;
    case "yellow":
      themeColor = "#fff9e6";
      msNavButtonColor = "#fff9e6";
      appleStatusBarStyle = "default";
      break;
    case "gray":
      themeColor = "#cfd8dc";
      msNavButtonColor = "#cfd8dc";
      appleStatusBarStyle = "black-translucent";
      break;
    case "red":
      themeColor = "#ffcdd2";
      msNavButtonColor = "#ffcdd2";
      appleStatusBarStyle = "default";
      break;
    // เพิ่มกรณีธีมใหม่ๆ ที่ต้องการ
  }

  // อัปเดตค่าใน meta tags
  document.querySelector('meta[name="theme-color"]').setAttribute("content", themeColor);
  document.querySelector('meta[name="msapplication-navbutton-color"]').setAttribute("content", msNavButtonColor);
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute("content", appleStatusBarStyle);
}

// ตัวจัดการเหตุการณ์สำหรับปุ่มเปลี่ยนธีม
themeToggle.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length; // วนลูปกลับไปที่ธีมแรกเมื่อถึงธีมสุดท้าย
  const newTheme = themes[currentThemeIndex];
  applyTheme(newTheme);
});

// โหลดธีมจาก Local Storage เมื่อเริ่มต้น
document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = localStorage.getItem("theme");

  // หากไม่มีธีมที่บันทึกไว้ ให้ตรวจสอบธีมระบบ
  if (!savedTheme) {
    savedTheme = getSystemTheme();
  }

  currentThemeIndex = themes.indexOf(savedTheme);
  applyTheme(savedTheme);
});

// ยืนยันคำขอกู้บัญชี
async function requestReceive(){
  const refid = localStorage.getItem('refid');
  const byName = localStorage.getItem('name');
   const role = localStorage.getItem('role');
if (role !== 'ceo' && role !== 'boss') {
  Swal.fire("ผิดพลาด!", "ท่านไม่มีสิทธิ์ในการเข้าถึงเมนูนี้!", "error");
  return;
}

   // แสดงสถานะกำลังโหลดข้อมูล
   Swal.fire({
    title: "กำลังโหลดข้อมูล...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  var gas =
    "https://script.google.com/macros/s/AKfycbxdv6lUeT9rWLcZtnZ6hMQTdEwiy-mK7sOJhT_eDl2ZflzhIjSkNUc4Nz0l4HweMTyl/exec";
  var qdata = `?id=${refid}`;

  await fetch(gas + qdata)
    .then((response) => response.json())
    .then((user) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();
      if (user.user && user.user.length > 0) {
        var timelineData = `
        <div style="text-align: left;">
        <ol style="padding-left: 20px; line-height: 1.8;">
          วันที่ : ${user.user[0].regdate} <br>
          ชื่อ : ${user.user[0].name} <br>
          ตำแหน่ง : ${user.user[0].job}      
        </ol>
      </div>
        `;
        // แสดงข้อมูลที่ดึงมาใน Swal
        Swal.fire({
          title: "คำขอกู้คืนบัญชี",
          html: timelineData,
          allowOutsideClick: false,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ปฏิเสธ`
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          uu_id = user.user[0].uuid;
          newline = user.user[0].newline;
          if (result.isConfirmed) {
            requestReceiveYesNo(uu_id,newline,byName,'confirm');
            // Swal.fire("Saved!", "", "success");
          } else if (result.isDenied) {
            requestReceiveYesNo(uu_id,newline,byName,'deny');
            // Swal.fire("Changes are not saved", "", "info");
          }
        });
      } else {
        // แสดงข้อความเตือนใน Swal
        Swal.fire({
          icon: "warning",
          title: "ไม่พบคำขอกู้คืนบัญชี",
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

async function requestReceiveYesNo(uu_id,newline,byName,status){

   Swal.fire({
    title: "กำลังดำเนินการ...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  var gas =
    "https://script.google.com/macros/s/AKfycbyLabkeVyABhdGszcYjIwqOuooTLr-y68YkMhTMEKetyF2B29nAwj03InJDZ1p4v0SkBA/exec";
  var qdata = `?uuid=${uu_id}&newline=${newline}&byName=${byName}&status=${status}`;
console.log(gas + qdata);
  await fetch(gas + qdata)
    .then((response) => response.json())
    .then((sts) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();
      if (sts.sts[0].sts === 'ok') {
        var timelineData = '';
        if (status === 'confirm'){
          timelineData = 'การยืนยันกู้คืนบัญชีสำเร็จ';
        } else if (status === 'deny'){
          timelineData = 'การปฏิบัติเสธกู้คืนบัญชีสำเร็จ';
        }        
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          html: timelineData,
          confirmButtonText: "ตกลง",
        });
      } else {
        // แสดงข้อความเตือนใน Swal
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถดำเนินการได้",
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

function reportdata(){
  // เรียกรายงานลงเวลาประจำเดือน
// รับวันที่ปัจจุบัน
var currentDate = new Date();

// ดึงปีและเดือน
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1; // เดือนเริ่มต้นที่ 0 (มกราคม) ดังนั้นต้องเพิ่ม 1

// รูปแบบ yyyymm
var formattedDate = year.toString() + (month < 10 ? '0' : '') + month.toString();

//console.log(formattedDate); // ผลลัพธ์เช่น "202402" (สำหรับเดือนกุมภาพันธ์ 2024)
fetchData(formattedDate);
}

async function fetchData(formattedDate) {
  const cid = localStorage.getItem("cidhash");
  const db1 = localStorage.getItem("db1");
  var apiUrl = 'https://script.google.com/macros/s/AKfycbwjLcT7GFTETdwRt_GfU6j-8poTK6_t400RPLa4cMY72Ih3EYAWQIDyFQV0et7lMQG2LQ/exec';

  var queryParams = `?startdate=${formattedDate}&cid=${cid}&db=${db1}`;

  // Show the spinner
  document.getElementById("loadingSpinner").style.display = "block";

  // Make a GET request using Fetch API
  await fetch(apiUrl + queryParams)
      .then(response => response.json())
      .then(data => {
          const reporttb = document.getElementById("reportdata");
          reporttb.innerHTML = "";
          let datartb = '';
          data.tst.forEach(function (tst) {
              datartb += `<tr>
              <td>${tst.day}</td>
              <td>${tst.datein}</td>
              <td>${tst.timein}</td>
              <td>${tst.name}</td>
              <td>${tst.subname}</td>
              <td>${tst.typein}</td>
            
              <td>${tst.disin}</td>
              <td>${tst.timeout}</td>
              <td>${tst.disout}</td>
              <td>${tst.notein}</td>
              <td>${tst.request}</td>
              <td>${tst.reqdate}</td>
              <td>${tst.reqtime}</td>
              <td>${tst.permitdate}</td>
              <td>${tst.permittime}</td>
              <td>${tst.permitname}</td>
              <td>${tst.permit_note}</td>
              <td>${tst.verified}</td>
              <td>${tst.verifiedname}</td>
              <td>${tst.verified_note}</td>
              <td>${tst.verifieddate}</td>
              <td>${tst.verifiedtime}</td>
              <td>${tst.ref}</td>
          </tr>`;
          });

          reporttb.innerHTML = datartb;

          if ($.fn.dataTable.isDataTable('#dreportdata')) {
            $('#dreportdata').DataTable().clear().destroy();
        }

          $('#dreportdata').DataTable({
              "data": data.tst,
              "columns": [
                  { "data": 'day' },
                  { "data": 'datein' },
                  { "data": 'timein' },
                  { "data": 'name' },
                  { "data": 'subname' },
                  { "data": 'typein' },
            
                  { "data": 'disin' },
                  { "data": 'timeout' },
                  { "data": 'disout' },
                  { "data": 'notein' },
                  { "data": 'request' },
                  { "data": 'reqdate' },
                  { "data": 'reqtime' },
                  { "data": 'permitdate' },
                  { "data": 'permittime' },
                  { "data": 'permitname' },
                  { "data": 'permit_note' },
                  { "data": 'verified' },
                  { "data": 'verifiedname' },
                  { "data": 'verified_note' },
                  { "data": 'verifieddate' },
                  { "data": 'verifiedtime' },
                  { "data": 'ref' }
              ],
              "language": {
                  "url": 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json',
              },
              "processing": true,
              "responsive": true,
              "autoFill": true,
              "order": [[22, 'asc'], [5, 'asc']],
              "colReorder": true,
              "fixedHeader": true,
              "select": true,
              "keys": true,
              "dom": 'lBfrtip',
              "lengthMenu": [ [10, 30, 50, 100, 150, -1], [10, 30, 50, 100, 150, "ทั้งหมด"] ],
              "buttons": ['copy', 'csv', 'excel', 'print', 'colvis' ],
              "pageLength": 30,
            
        });

          // Hide the spinner after data is loaded
          document.getElementById("loadingSpinner").style.display = "none";
      })
      .catch(error => {
          // Hide the spinner in case of an error
          document.getElementById("loadingSpinner").style.display = "none";
          console.error("Error fetching data:", error);
      });
}

function clearTableData() {
  const reporttb = document.getElementById("reportdata");
  reporttb.innerHTML = ""; // ล้างข้อมูลใน tbody
}
