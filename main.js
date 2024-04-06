const CHAT_ANONYMOUS = 26011; //anonymous
const CHAT_UNCENSORED = 26012; //uncensored
//const BING_ID = 26012; //Bing
var conversationId;
let isGettingMessages = false;
let ActiveMessageID = null;
let activeID = null;
var baseURL = "http://localhost:9898/api/v1";
var outgoingMsg = [];
var incomingMsg = [];
var anonymousCount = 0;
var gptCount = 0;
var bingCount = 0;
var id;
var counter = 0;
window.addEventListener("load", function () {
  //pollAndShowBadge();
  loadBalance();
  //getLocalMessages();
  poll();
  document.getElementById("message").focus();
});

document.addEventListener("DOMContentLoaded", function () {
  var anchorElement = document.getElementById("myAnchor");
  var anchorElement1 = document.getElementById("myAnchor1");
  var anchorElement2 = document.getElementById("myAnchor2");
  var anchorElement3 = document.getElementById("myAnchor3");
  // Detect the user's operating system
  var isMac = window.navigator.userAgent.indexOf("Mac") !== -1;

  // Remove the target attribute if the user is on a Mac
  if (isMac) {
    anchorElement.removeAttribute("target");
    anchorElement1.removeAttribute("target");
    anchorElement2.removeAttribute("target");
    anchorElement3.removeAttribute("target");
  }
});

// window.addEventListener("unload", function () {
//   clearInterval(intervalId);
// });
async function loadBalance() {
  try {
    const response = await fetch(`${baseURL}/wallets`);
    var data = await response.json();
    bal = data.payload[0].balance;
    // var str = bal.toString().split(".");

    // if (str[0].length >= 5) {
    //   str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    // }

    // console.log(str[0]);
    // if (str[1] && str[1].length > 3) {
    //   str[1] = str[1].slice(0, 2) + " " + str[1].slice(2);
    // }
    // if (str[1] && str[1].length > 6) {
    //   str[1] = str[1].slice(0, 6) + " " + str[1].slice(6);
    // }
    // console.log(str[1]);
    // if (bal == 0 || bal == "undefined") {
    //   const div = document.createElement("div");
    //   div.setAttribute("class", "balance1");
    //   const base = document.createTextNode("0");
    //   div.appendChild(base);
    //   document.getElementById("left-panel").appendChild(div);
    // } else {
    //   const div = document.createElement("div");
    //   div.setAttribute("class", "balance1");

    //   const base = document.createTextNode(str[0]);

    //   const sup = document.createElement("sup");
    //   sup.setAttribute("class", "superscript1");
    //   const exponent = document.createTextNode(str[1]);
    //   sup.appendChild(exponent);

    //   div.appendChild(base);
    //   div.appendChild(sup);
    //   document.getElementById("left-panel").appendChild(div);
    // }
    if (bal == 0 || bal == "undefined") {
      // const div = document.createElement("div");
      // div.setAttribute("class", "balance1");
      // const base = document.createTextNode("0");
      // div.appendChild(base);
      document.getElementById("bal-div").innerHTML = "Balance: 0 ";
    } else {
      // const div = document.createElement("div");
      // div.setAttribute("class", "balance1");
      // const base = document.createTextNode(bal);
      // div.appendChild(base);
      // document.getElementById("bal-div").appendChild(div);
      document.getElementById("bal-div").innerHTML = "Balance: " + bal;
    }
  } catch (error) {
    console.log(error);
  }
}
async function loadMainBalance() {
  try {
    const response = await fetch(`${baseURL}/wallets`);
    var data = await response.json();
    bal = data.payload[0].balance;
    // var str = bal.toString().split(".");

    // if (str[0].length >= 5) {
    //   str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    // }

    // console.log(str[0]);
    // if (str[1] && str[1].length > 3) {
    //   str[1] = str[1].slice(0, 2) + " " + str[1].slice(2);
    // }
    // if (str[1] && str[1].length > 6) {
    //   str[1] = str[1].slice(0, 6) + " " + str[1].slice(6);
    // }
    // console.log(str[1]);
    // if (bal == 0 || bal == "undefined") {
    //   const div = document.createElement("div");
    //   div.setAttribute("class", "balance");
    //   const base = document.createTextNode("0");
    //   div.appendChild(base);
    //   document.getElementById("balance-div").appendChild(div);
    // } else {
    //   const div = document.createElement("div");
    //   div.setAttribute("class", "balance");

    //   const base = document.createTextNode(str[0]);

    //   const sup = document.createElement("sup");
    //   sup.setAttribute("class", "superscript");
    //   const exponent = document.createTextNode(str[1]);
    //   sup.appendChild(exponent);

    //   div.appendChild(base);
    //   div.appendChild(sup);
    //   document.getElementById("balance-div").appendChild(div);
    // }
    if (bal == 0 || bal == "undefined") {
      const div = document.createElement("div");
      div.setAttribute("class", "balance");
      const base = document.createTextNode("0");
      div.appendChild(base);
      document.getElementById("balance-div").appendChild(div);
    } else {
      const div = document.createElement("div");
      div.setAttribute("class", "balance");
      const base = document.createTextNode(bal);
      div.appendChild(base);
      document.getElementById("balance-div").appendChild(div);
    }
  } catch (error) {
    console.log(error);
  }
}
//export coins with predefined code
function validate() {
  event.preventDefault();
  var amount = document.getElementById("amount");
  if (amount.value == 0) {
    Swal.fire({
      icon: "error",
      title: '<span style="color: #DBD9DC"> The amount cannot be zero</span> ',
      confirmButtonText: "Okay",
      confirmButtonColor: "rgb(136, 156, 231)",
    }).then((result) => {
      if (result.value) {
        amount.focus();
      }
    });
    $(".swal2-modal").css(
      "background",
      "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
    );
  } else if (!/^\d*(\.\d{1,8})?$/.test(amount.value)) {
    Swal.fire({
      icon: "error",
      title:
        '<span style="color: #DBD9DC"> Only numbers are allowed and the amount must not exceed 8 decimal places!',
      confirmButtonText: "Okay",
      confirmButtonColor: "rgb(136, 156, 231)",
    }).then((result) => {
      if (result.value) {
        amount.focus();
      }
      amount.value = "";
      return false;
    });
    $(".swal2-modal").css(
      "background",
      "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
    );
  } else {
    removeCoins();
  }
}

async function removeCoins() {
  event.preventDefault();
  var loadingDiv = document.getElementById("loading-div");
  var cancelBtn = document.getElementById("cancel-btn");
  var memo = document.getElementById("memo").value;
  loadingDiv.style.display = "block";
  cancelBtn.style.display = "none";
  // document.querySelector("#export").disabled = true;
  // document.getElementById("export").style.backgroundColor = "grey";
  var amount = document.getElementById("amount").value;
  document.querySelector("#export").disabled = true;
  document.getElementById("export").style.backgroundColor = "grey";
  const walletData = {
    name: "Default",
    amount: Number(amount),
    tag: memo,
  };
  const response = await fetch(`${baseURL}/wallets`);
  var data = await response.json();
  bal = data.payload[0].balance;
  if (amount <= bal) {
    try {
      const response = await fetch(`${baseURL}/locker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(walletData),
      });
      var data = await response.json();
      if (data.status == "success") {
        taskId = data.payload.id;
        console.log(data);
        console.log(taskId);
        doCheck1(taskId);
      } else {
        console.log(data.payload.message);
        Swal.fire({
          icon: "error",
          title: data.payload.message,
          //'<span style="color: #DBD9DC"> The amount cannot be zero</span> ',
          confirmButtonText: "Okay",
          confirmButtonColor: "rgb(136, 156, 231)",
        }).then((result) => {
          if (result.value) {
            window.location.href = "./export.html";
          }
        });
        $(".swal2-modal").css(
          "background",
          "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
        );
        return;
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    window.location.href = "./export-insufficient-funds.html";
  }
}

async function doCheck1(taskID) {
  const response = await fetch(`${baseURL}/tasks/${taskId}`);
  if (response) {
    const data = await response.json();
    console.log(data);
    if (data.payload.status == "error" || data.payload.status == "completed") {
      if (data.payload.status == "completed") {
        var transmitCode = data.payload.data.transmit_code;
        console.log(transmitCode);
        document.querySelector("#export").disabled = false;
        document.getElementById("export").style.backgroundColor = "#39D02B";
        window.location.href = "./export-success.html?data=" + transmitCode;
        loadBalance();
        return;
      } else {
        console.log(data.payload.data.message);
        Swal.fire({
          icon: "error",
          title: data.payload.data.message,
          //'<span style="color: #DBD9DC"> The amount cannot be zero</span> ',
          confirmButtonText: "Okay",
          confirmButtonColor: "rgb(136, 156, 231)",
        }).then((result) => {
          if (result.value) {
            window.location.href = "./export.html";
          }
        });
        $(".swal2-modal").css(
          "background",
          "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
        );

        return;
      }
    }
  }
  setTimeout(() => {
    doCheck1(taskID);
  }, 500);
}

function validateImport() {
  event.preventDefault();
  var code = document.getElementById("locker-code");
  if (code.value == 0) {
    Swal.fire({
      icon: "error",
      title:
        '<span style="color: #DBD9DC"> This field cannot be empty!</span> ',
      confirmButtonText: "Okay",
      confirmButtonColor: "rgb(136, 156, 231)",
    }).then((result) => {
      if (result.value) {
        code.focus();
      }
    });
    $(".swal2-modal").css(
      "background",
      "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
    );
  } else {
    downloadCoins();
  }
}

//import.html

// Get coins from the locker
async function downloadCoins() {
  // event.preventDefault();
  var loadingDiv = document.getElementById("loading-div");
  var cancelBtn = document.getElementById("cancel-btn");
  var memo = document.getElementById("memo").value;
  loadingDiv.style.display = "block";
  cancelBtn.style.display = "none";
  document.querySelector("#import").disabled = true;
  document.getElementById("import").style.backgroundColor = "grey";

  const walletName = {
    name: "Default",
    tag: memo,
  };

  const code = document.getElementById("locker-code").value;
  var lockerCode = code;
  console.log(lockerCode);
  try {
    const response = await fetch(`${baseURL}/locker/${lockerCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(walletName),
    });
    var data = await response.json();
    if (data.status == "success") {
      taskId = data.payload.id;
      console.log(taskId);
      doCheck(taskId);
    } else {
      console.log(data.payload.message);
      Swal.fire({
        icon: "error",
        title: data.payload.message,
        //'<span style="color: #DBD9DC"> The amount cannot be zero</span> ',
        confirmButtonText: "Okay",
        confirmButtonColor: "rgb(136, 156, 231)",
      }).then((result) => {
        if (result.value) {
          window.location.href = "./import.html";
        }
      });
      $(".swal2-modal").css(
        "background",
        "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
      );
      return;
    }
  } catch (error) {
    console.error(error);
  }
}
async function doCheck(taskID) {
  const response = await fetch(`${baseURL}/tasks/${taskId}`);
  if (response) {
    const data = await response.json();
    console.log(data);
    if (data.payload.status == "completed") {
      document.querySelector("#import").disabled = false;
      document.getElementById("import").style.backgroundColor = "#39D02B";
      console.log("success!!!!");
      // var result = data.payload.data.total;
      if (Number.isInteger(result)) {
        var result = data.payload.data.total;
        //window.location.href = "import-success.html?data=" + result;
        return;
      } else {
        var decimal = data.payload.data.total;
        result1 = decimal.toFixed(8);
        result2 = result1.replace(/\.?0+$/, "");
        // result1 = parseFloat(decimal);
        // result2 =
        // result1 = decimal/ 100000000;
        // alert(result1)
        // result2 = Math.round(result1 * 100000000) / 100000000;
        // finalResult = result2.toFixed(8).replace(/\.?0+$/, "");
        alert(result2);
        //window.location.href = "import-success.html?data=" + result2;
        return;
      }
    } else if (data.payload.status == "error" || data.payload.code == 4121) {
      //window.location.href = "import-fail.html";
      return;
    }
  }
  setTimeout(() => {
    doCheck(taskID);
  }, 500);
}

// Posts a new message

// function newConversation() {
//   let id = Math.floor(Math.random() * 65000 + 1);

//   return id;
// }

document
  .getElementById("message")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      postMessage(); // Call the postMessage() function
    }
  });

async function postMessage() {
  try {
    var mybutton = document.getElementById("send-btn");
    mybutton.style.backgroundColor = "rgb(186, 218, 85)";
    if (window.location.pathname.endsWith("/home.html")) {
      id = CHAT_ANONYMOUS;
      conversationId = localStorage.getItem("homeId");
    } else if (window.location.pathname.endsWith("/uncensored.html")) {
      id = CHAT_UNCENSORED;
      conversationId = localStorage.getItem("uncensoredId");
    }
    //  else if (window.location.pathname == "/bing.html"){
    //   id = BING_ID;
    // }
    var message = document.getElementById("message").value;
    alert(message.length);

    if (message.length == 0) {
      tempmessage = localStorage.getItem("message");
      message = tempmessage;
      alert(message);
    }
    inputData = {
      message: message,
      to: id,
      conversation_id: Number(conversationId),
    };
    const response = await fetch(`${baseURL}/chat/ai/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    let data = await response.json();
    if (data.status != "success") {
      console.log("failure!");
      document.getElementById("send-btn").style.display = "block";
      Swal.fire({
        icon: "error",
        title: data.payload.message,
        confirmButtonText: "Okay",
        confirmButtonColor: "rgb(136, 156, 231)",
      }).then((result) => {
        if (result.value) {
          document.getElementById("message").value = "";
        }
        return;
      });
      $(".swal2-modal").css(
        "background",
        "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
      );
      $(".swal2-container").css("z-index", "99999");
      $(".swal2-title").css("color", "white");
    } else {
      localStorage.setItem("message", message);
      document.getElementById("send-btn").style.display = "none";
      document.getElementById("message").disabled = true;
      document.getElementById("message").blur();
      console.log("success!");
      const messageTbody = document
        .getElementById("messageTable")
        .getElementsByTagName("tbody")[0];
      var newRow = messageTbody.insertRow(-1);
      var newCell = newRow.insertCell(0);
      // newCell.style.backgroundImage =
      //   "linear-gradient(180deg, rgba(172, 170, 170, 1) 0%, rgba(80, 80, 82, 1) 100%)";
      newCell.style.backgroundColor = "transparent";
      newCell.style.color = "grey";
      newCell.style.padding = "10px";
      newCell.style.float = "right";
      newCell.style.borderRadius = "5px";

      var fontSize = localStorage.getItem("fontSize");
      var fontStyle = localStorage.getItem("fontStyle");

      // console.log("fontsize:" + fontSize);
      // console.log("font style:" + fontStyle);
      if (fontSize) {
        newCell.style.fontSize = fontSize + "px";
      }

      if (fontStyle) {
        newCell.style.fontFamily = fontStyle;
      }
      newCell.innerHTML = message;
      document.getElementById("messageTable").scrollTop =
        document.getElementById("messageTable").scrollHeight;
      document.getElementById("message").value = "";
      var newRowRes = messageTbody.insertRow(-1);
      var newCellRes = newRowRes.insertCell(0);
      setTimeout(() => {
        newCellRes.innerHTML =
          '<div id="typing-animation"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
      }, 2000);

      newCellRes.style.marginTop = "-30px";
      newCellRes.style.color = "#ccc";
      newCellRes.style.float = "left";
      // newCellRes.style.backgroundColor = "rgb(27 , 28 , 30)";
      newCellRes.style.borderRadius = "5px";
      newCellRes.style.padding = "10px";
      //poll();
    }
  } catch (error) {
    console.log(error);
  }
}

// Polls for new messages
async function pollAndShowBadge() {
  if (isGettingMessages) {
    return; // Exit the function if already in progress
  }

  isGettingMessages = true;
  let data;
  try {
    const response = await fetch(`${baseURL}/chat/ai/poll`);
    data = await response.json();
    if (data.status == "success") {
      console.log(data);

      var arrItems = data.payload;
      if (arrItems.length > 0) {
        isEmpty = false;
        var filteredItems = arrItems.filter((item) => item.length > 0);
        console.log(filteredItems, "arr");
        if (filteredItems.length > 0) {
          // alert("poll");
          let bingCount = 0;
          let gptCount = 0;
          for (let i = 0; i < filteredItems.length; i++) {
            if (filteredItems[i].from == CHAT_ANONYMOUS) {
              bingCount = bingCount + 1;
            }
            if (filteredItems[i].from == CHAT_UNCENSORED) {
              gptCount = gptCount + 1;
            }
            // if (data.payload[i].from == BING_ID) {
            //   bingCount = bingCount + 1;
            // }
          }
          //console.log("anonymouscount: " + anonymousCount);
          console.log("gptCount: " + gptCount);
          console.log("bingCount: " + bingCount);
          localStorage.setItem("bingCount", bingCount);
          localStorage.setItem("gptCount", gptCount);
          //localStorage.setItem("bingCount", bingCount);
          // clearInterval(intervalId);
          showBadge();

          await getNewMessages(filteredItems, activeID);
        }
      } else {
        isEmpty = true;
      }
    } else {
      console.log("failed to get data from poll");
    }
  } catch (error) {
    console.log(error);
  } finally {
    isGettingMessages = false; // Reset the flag variable
    if (ActiveMessageID && !hasMatchingMessage(data.payload, ActiveMessageID)) {
      removeLoader();
      document.getElementById("send-btn").style.display = "block";
      document.getElementById("send-btn").style.backgroundColor = "#3f3f3f";
      document.getElementById("message").disabled = false;
      ActiveMessageID = null;
    }
  }
}

function showBadge() {
  var uCount = localStorage.getItem("gptCount");
  var bCount = localStorage.getItem("bingCount");
  console.log("ucount:" + uCount);
  console.log("bcount:" + bCount);
  if (uCount > 0) {
    if (!window.location.pathname.endsWith("/uncensored.html")) {
      document.getElementById("gptCount").style.display = "block";
      document.getElementById("gptCount").innerHTML = uCount;
    }
  } else if (bCount > 0) {
    if (!window.location.pathname.endsWith("/home.html")) {
      document.getElementById("bingCount").style.display = "block";
      document.getElementById("bingCount").innerHTML = bCount;
    }
  }

  localStorage.removeItem("bingCount");
  localStorage.removeItem("gptCount");
}

function poll() {
  intervalId = setInterval(pollAndShowBadge, 100000000); // Poll every 1 second
}
async function getNewMessages(inputData, activeID) {
  try {
    const modifiedInputData = {
      headers: inputData.map((obj) => ({
        id: obj.id,
        length: obj.length,
        from: obj.from,
        conversation_id: obj.conversation_id,
        raida_idx: obj.raida_idx,
      })),
    };

    var sn = modifiedInputData.headers[0].from;
    console.log(sn);
    console.log(modifiedInputData);
    const response = await fetch(`${baseURL}/chat/ai/messages/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedInputData),
    });
    let data = await response.json();
    console.log(data);
    if (data.status == "success") {
      const activeMessageID = data.payload[0].conversation_id;
      // if (activeMessageID !== activeID) {
      //   // The response is for a different conversation ID, ignore it
      //   return;
      // }
      if (window.location.pathname.endsWith("/home.html")) {
        // conversationId = localStorage.getItem("homeId");
        var cId = CHAT_ANONYMOUS;
      } else if (window.location.pathname.endsWith("/uncensored.html")) {
        //conversationId = localStorage.getItem("uncensoredId");
        cId = CHAT_UNCENSORED;
      }

      ActiveMessageID = activeMessageID;

      if (sn == cId) {
        const messageTbody = document
          .getElementById("messageTable")
          .getElementsByTagName("tbody")[0];
        var lastRowIndex = messageTbody.rows.length - 1;
        messageTbody.deleteRow(lastRowIndex);
        var newRow = messageTbody.insertRow(-1);
        var newCell = newRow.insertCell(0);
        newCell.style.backgroundColor = "rgb(27 , 28 , 30)";
        newCell.style.borderRadius = "5px";
        newCell.style.padding = "10px";
        newCell.style.float = "left";
        newCell.style.color = "#ccc";
        newCell.style.textAlign = "left";
        var fontSize = localStorage.getItem("fontSize");
        var fontStyle = localStorage.getItem("fontStyle");

        if (fontSize) {
          newCell.style.fontSize = fontSize + "px";
        }

        if (fontStyle) {
          newCell.style.fontFamily = fontStyle;
        }

        var text = data.payload[0].message;
        errortext =
          "I'm unable to go on with current chat. Please make another try or choose another chatmate";
        errortext1 =
          "Error: Bella is seriously broken and trying to recover. Please choose another chatmate";
        if (text === errortext || text == errortext1) {
          counter = counter + 1;
          if (counter == 1) {
            alert(counter);
            Swal.fire({
              icon: "error",
              title: "some error occured shall we start a new conversation?",
              confirmButtonText: "Okay",
              confirmButtonColor: "rgb(136, 156, 231)",
            }).then((result) => {
              if (result.value) {
                conversation();
              }
            });
            $(".swal2-modal").css(
              "background",
              "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
            );
            $(".swal2-container").css("z-index", "99999");
            $(".swal2-title").css("color", "white");
          }
        }
        if (window.location.pathname.endsWith("uncensored.html")) {
          newCell.innerHTML = text;
          document.getElementById("send-btn").style.display = "block";
          document.getElementById("message").disabled = false;
        } else {
          newCell.innerHTML =
            "<pre>" +
            text +
            "</pre>" +
            '<div id="typing-animation">&nbsp<span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
          newCell.style.whiteSpace = "pre-wrap";
          newCell.innerHTML =
            text.replace(/\n\n/g, "<br><br>") +
            '<div id="typing-animation">&nbsp<span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';

          const typingAnimationElement =
            document.getElementById("typing-animation");
          if (typingAnimationElement) {
            typingAnimationElement.innerHTML =
              '<div id="typing-animation">&nbsp<span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
          }
        }

        document.getElementById("messageTable").scrollTop =
          document.getElementById("messageTable").scrollHeight;
      }
    } else {
      console.log("error");
      Swal.fire({
        icon: "error",
        title: data.payload.message,
        confirmButtonText: "Okay",
        confirmButtonColor: "rgb(136, 156, 231)",
      }).then((result) => {
        if (result.value) {
          window.location.href = "home.html";
        }
      });
      $(".swal2-modal").css(
        "background",
        "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
      );
      $(".swal2-container").css("z-index", "99999");
      $(".swal2-title").css("color", "white");
    }
  } catch (error) {
    console.log(error);
  }
}

// Gets Local Messages for the conversation
async function getLocalMessages() {
  try {
    //alert(conversationId);
    if (window.location.pathname.endsWith("/home.html")) {
      id = CHAT_ANONYMOUS;
      conversationId = localStorage.getItem("homeId");
    } else if (window.location.pathname.endsWith("/uncensored.html")) {
      id = CHAT_UNCENSORED;
      conversationId = localStorage.getItem("uncensoredId");
    }
    //  else if (window.location.pathname == "/bing.html") {
    //   id = BING_ID;
    // }
    inputData = {
      to: id,
      conversation_id: Number(conversationId),
    };

    const response = await fetch(`${baseURL}/chat/messages/download/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    let data = await response.json();
    if (data.status != "success") {
      console.log(error);
      return;
    } else {
      const chatBody = document.getElementById("chat-body");

      const messageTable = document.getElementById("messageTable");

      const messageTbody = messageTable.getElementsByTagName("tbody")[0];

      for (i = 0; i < data.payload.length; i++) {
        if (data.payload[i].is_outgoing == true) {
          outgoingMsg[i] = data.payload[i].message;
        } else {
          incomingMsg[i] = data.payload[i].message;
        }

        // loop through each message for user1 and user2 and add it to the table
        const row1 = messageTbody.insertRow();
        const user1Cell = row1.insertCell();
        const row2 = messageTbody.insertRow();
        const user2Cell = row2.insertCell();

        if (i < outgoingMsg.length && outgoingMsg[i]) {
          user1Cell.innerText = outgoingMsg[i];
          // user1Cell.style.backgroundImage =
          //   "linear-gradient(180deg, rgba(172, 170, 170, 1) 0%, rgba(80, 80, 82, 1) 100%)";
          user1Cell.style.backgroundColor = "transparent";
          user1Cell.style.color = "grey";
          user1Cell.style.borderRadius = "5px ";
          user1Cell.style.padding = "10px";
          user1Cell.style.float = "right";
          var fontSize = localStorage.getItem("fontSize");
          var fontStyle = localStorage.getItem("fontStyle");

          // console.log("fontsize:" + fontSize);
          // console.log("font style:" + fontStyle);
          if (fontSize) {
            user1Cell.style.fontSize = fontSize + "px";
          }

          if (fontStyle) {
            user1Cell.style.fontFamily = fontStyle;
          }
        } else {
          row1.remove();
        }

        if (i < incomingMsg.length && incomingMsg[i]) {
          user2Cell.innerText = incomingMsg[i];
          user2Cell.style.float = "left";
          user2Cell.style.backgroundColor = "rgb(27 , 28 , 30)";
          user2Cell.style.color = "#ccc";
          user2Cell.style.borderRadius = "5px  ";
          user2Cell.style.padding = "10px";
          user2Cell.style.textAlign = "left";
          var fontSize = localStorage.getItem("fontSize");
          var fontStyle = localStorage.getItem("fontStyle");

          // console.log("fontsize:" + fontSize);
          // console.log("font style:" + fontStyle);
          if (fontSize) {
            user2Cell.style.fontSize = fontSize + "px";
          }
          if (fontStyle) {
            user2Cell.style.fontFamily = fontStyle;
          }
        } else {
          row2.remove();
        }

        chatBody.appendChild(messageTable);
        document.getElementById("messageTable").scrollTop =
          document.getElementById("messageTable").scrollHeight;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function openModel() {
  document.getElementById("modal").style.display = "block";
}
function closeModel() {
  document.getElementById("modal").style.display = "none";
}

async function checkVersion() {
  try {
    const response = await fetch(`${baseURL}/info`);
    let data = await response.json();
    if (data.status == "success") {
      console.log(data);
      var isAvailable = data.payload.upgrade_available;
      if (isAvailable == true) {
        Swal.fire({
          //   icon: "info",
          title:
            "A newer version is available. <br /> You can click on the link below to upgrade to the latest version",
          html: ' <a id="myLink1" style="text-decoration-color : silver" href="https://www.gptanonymous.com/copy-of-buy-tokens" target="_blank"><span style="color: silver;" >https://www.gptanonymous.com/copy-of-buy-tokens</span></a>',
          confirmButtonText: "Okay",
          confirmButtonColor: "rgb(136, 156, 231)",
          onOpen: function () {
            // Check if the operating system is Mac
            var isMac = navigator.userAgent.indexOf("Mac") !== -1;

            // Remove target attribute from the link tag for Mac
            if (isMac) {
              $("#myLink1").removeAttr("target");
            }
          },
        }).then((result) => {
          if (result.value) {
            amount.focus();
          }
        });
        $(".swal2-modal").css(
          "background",
          "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
        );
        $(".swal2-title").css("color", "white");
      }
      console.log(isAvailable, "version");
      var fatalError = data.payload.fatal_error;
      if (fatalError != "") {
        window.location.href = "fatal-error.html?data=" + fatalError;
      }
    } else {
      console.log("failure");
    }
  } catch (error) {
    console.log(error);
  }
}

function openInNewWindow(event) {
  event.preventDefault();

  var url = event.currentTarget.getAttribute("href");
  window.open(url, "_blank");
}
function validateFonts() {
  event.preventDefault();
  var fontSize = document.getElementById("fontSize").value;
  var secretVal = document.getElementById("secret-value");

  console.log("font style:" + secretVal.innerHTML);
  console.log("fontsize:" + typeof Number(fontSize));

  var regex = /^(1[2-9]|2[0-9]|3[0-5])$/;
  var isValid = regex.test(fontSize);

  if (isValid == false) {
    Swal.fire({
      icon: "error",
      title:
        '<span style="color: #DBD9DC"> Please select the font between 12 and 35</span> ',
      confirmButtonText: "Okay",
      confirmButtonColor: "rgb(136, 156, 231)",
    }).then((result) => {
      if (result.value) {
      }
    });
    $(".swal2-modal").css(
      "background",
      "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
    );
  } else if (secretVal.innerHTML == "Value") {
    Swal.fire({
      icon: "error",
      title:
        '<span style="color: #DBD9DC"> Please select the font style from dropdown</span> ',
      confirmButtonText: "Okay",
      confirmButtonColor: "rgb(136, 156, 231)",
    }).then((result) => {
      if (result.value) {
      }
    });
    $(".swal2-modal").css(
      "background",
      "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
    );
  } else {
    fontSetting();
  }
}
function fontSetting() {
  var fontSize = document.getElementById("fontSize").value;
  var secretVal = document.getElementById("secret-value");

  localStorage.setItem("fontSize", fontSize);
  localStorage.setItem("fontStyle", secretVal.innerHTML);
  Swal.fire({
    title: "Changes saved successfully",
    confirmButtonText: "Okay",
    confirmButtonColor: "rgb(136, 156, 231)",
  }).then((result) => {
    if (result.value) {
    }
    return;
  });
  $(".swal2-modal").css(
    "background",
    "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
  );
  $(".swal2-container").css("z-index", "99999");
  $(".swal2-title").css("color", "white");
}
function hasMatchingMessage(messages, conversationID) {
  return messages.some((message) => message.conversation_id === conversationID);
}
function removeLoader() {
  // Remove the loader element from the DOM or hide it based on your implementation
  const loaderElement = document.getElementById("typing-animation");
  if (loaderElement) {
    loaderElement.remove(); // Remove the loader element from the DOM
  }
}

function openModel() {
  Swal.fire({
    //   icon: "info",
    title: "Click on the link below to buy tokens",
    html: ' <a id="myLink" style="text-decoration-color: silver " href="http://www.gptanonymous.com/services-4" target="_blank"><span style="color: #DBD9DC;" >http://www.gptanonymous.com/services-4</span></a>',
    confirmButtonText: "Okay",
    confirmButtonColor: "rgb(136, 156, 231)",
    onOpen: function () {
      // Check if the operating system is Mac
      var isMac = navigator.userAgent.indexOf("Mac") !== -1;

      // Remove target attribute from the link tag for Mac
      if (isMac) {
        $("#myLink").removeAttr("target");
      }
    },
  }).then((result) => {
    if (result.value) {
      amount.focus();
    }
  });
  $(".swal2-modal").css(
    "background",
    "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
  );
  $(".swal2-title").css("color", "white");
}

// async function getPay() {
//   // alert("cloudcoincount");
//   const response = await fetch(`${baseURL}/chat/migration`);
//   var data = await response.json();
//   var cloudcoincount = data.payload.cloudcoin_count;
//   var supercoincount = data.payload.supercoin_count;
//   var lockercoincount = data.payload.locker_coin_count;

//   console.log("cloudcoin count:" + cloudcoincount);
//   console.log("supercoin count:" + supercoincount);
//   console.log("lockercoin count:" + lockercoincount);

//   if (cloudcoincount > 0) {
//     // alert(cloudcoincount);
//     Swal.fire({
//       icon: "info",
//       title:
//         "You have cloudcoins in your computer. Do you want to convert your cloudcoins to prompts ?",
//       confirmButtonText: "Okay",
//       showCancelButton: true,
//       cancelButtonText: "Cancel",
//       cancelButtonColor: "rgb(136, 156, 231)",
//       confirmButtonColor: "rgb(136, 156, 231)",
//     }).then((result) => {
//       if (result.value) {
//         window.location.href = "pay.html?data=" + cloudcoincount;
//       }
//     });
//     $(".swal2-modal").css(
//       "background",
//       "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
//     );
//     $(".swal2-title").css("color", "white");
//   }
// }

// async function cloudcoinPay() {
//   event.preventDefault();
//   var coins = document.getElementById("coins").value;

//   if (coins == 0) {
//     Swal.fire({
//       icon: "error",
//       title: '<span style="color: #DBD9DC"> The amount cannot be zero</span> ',
//       confirmButtonText: "Okay",
//       confirmButtonColor: "rgb(136, 156, 231)",
//     }).then((result) => {
//       if (result.value) {
//       }
//     });
//     $(".swal2-modal").css(
//       "background",
//       "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
//     );
//   } else {
//     const coinData = {
//       cloudcoin_count: Number(coins),
//     };
//     const response = await fetch(`${baseURL}/chat/migration`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(coinData),
//     });
//     var data = await response.json();
//     if (data.status == "success") {
//       //alert("success from cloudcoin pay");
//       Swal.fire({
//         icon: "info",
//         title: "You have successfully converted cloudcoins to prompts ",
//         confirmButtonText: "Okay",
//         confirmButtonColor: "rgb(136, 156, 231)",
//       }).then((result) => {
//         if (result.value) {
//         }
//       });
//       $(".swal2-modal").css(
//         "background",
//         "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
//       );
//       $(".swal2-title").css("color", "white");
//     } else {
//       //alert("error from cloudcoin pay");
//       Swal.fire({
//         icon: "error",
//         title: data.payload.message,
//         confirmButtonText: "Okay",
//         confirmButtonColor: "rgb(136, 156, 231)",
//       }).then((result) => {
//         if (result.value) {
//         }
//       });
//       $(".swal2-modal").css(
//         "background",
//         "linear-gradient( 167.95deg,  rgba(86, 86, 86, 0.86) 4.27%,#000 54.51%,#5f5f5f 91.21%)"
//       );
//       $(".swal2-title").css("color", "white");
//     }
//   }
// }
function conversation() {
  let conversationId = Math.floor(Math.random() * 65000 + 1);
  localStorage.setItem("uncensoredId", conversationId);
  alert("conversation");
  // postMessage();
  document.location.reload();
  postMessage();
}
