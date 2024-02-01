// Your web app's Firebase configuration
var _0x401f24 = _0x13ad; function _0x13ad(_0x35c748, _0x1afe65) { var _0x29e451 = _0x29e4(); return _0x13ad = function (_0x13ad4b, _0x1a9411) { _0x13ad4b = _0x13ad4b - 0x188; var _0x27bd7b = _0x29e451[_0x13ad4b]; return _0x27bd7b; }, _0x13ad(_0x35c748, _0x1afe65); } function _0x29e4() { var _0x1839ae = ['143372YLWpOK', 'cyber-cloud-6caec.appspot.com', '15ogpdUk', '1:700790763944:web:51f3642ad467eb0789ed9d', '467768VrwgoC', '21920gEqwOp', '2298605KZflqx', '6YgnTNA', '399722FKODTM', '1896OiObII', '2493bekAwD', 'cyber-cloud-6caec.firebaseapp.com', 'cyber-cloud-6caec', '3241JkQXVu', 'AIzaSyBlfWBWbLPOYNJMTgdshpW5SOESpPZ7btM', '8856738jVorPf', '700790763944']; _0x29e4 = function () { return _0x1839ae; }; return _0x29e4(); } (function (_0x2fa6b8, _0x518f4f) { var _0x63c0ba = _0x13ad, _0x50d80f = _0x2fa6b8(); while (!![]) { try { var _0x461444 = parseInt(_0x63c0ba(0x189)) / 0x1 + parseInt(_0x63c0ba(0x196)) / 0x2 + parseInt(_0x63c0ba(0x194)) / 0x3 * (parseInt(_0x63c0ba(0x192)) / 0x4) + parseInt(_0x63c0ba(0x198)) / 0x5 * (-parseInt(_0x63c0ba(0x188)) / 0x6) + -parseInt(_0x63c0ba(0x18e)) / 0x7 * (parseInt(_0x63c0ba(0x18a)) / 0x8) + -parseInt(_0x63c0ba(0x18b)) / 0x9 * (parseInt(_0x63c0ba(0x197)) / 0xa) + parseInt(_0x63c0ba(0x190)) / 0xb; if (_0x461444 === _0x518f4f) break; else _0x50d80f['push'](_0x50d80f['shift']()); } catch (_0x48fd6c) { _0x50d80f['push'](_0x50d80f['shift']()); } } }(_0x29e4, 0x6bbff)); var firebaseConfig = { 'apiKey': _0x401f24(0x18f), 'authDomain': _0x401f24(0x18c), 'projectId': _0x401f24(0x18d), 'storageBucket': _0x401f24(0x193), 'messagingSenderId': _0x401f24(0x191), 'appId': _0x401f24(0x195) };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const firestore = firebase.firestore();
var storageRef = storage.ref('files/');
var isLock = false;
var buttons = document.querySelectorAll(".buttons, .upload-btn");


async function uploadFile() {
  var file = document.getElementById('fileInput').files[0];
  if (!file) {
    console.log('No file selected');
    return;
  }

  if (isLock == false) {
    try {
      const fileList = await storageRef.listAll();
      const filesCount = fileList.items.length;

      let index = filesCount + 1;

      const fileExtension = file.name.split('.').pop();
      const newFileName = index < 10 ? `CF0${index}.${fileExtension}` : `CF${index}.${fileExtension}`;

      var newFileRef = storageRef.child(newFileName);

      console.log('Uploading file with name:', newFileName);
      await newFileRef.put(file);
      console.log('File Uploaded successfully as:', newFileName);
      document.getElementById('fileInput').value = ''
      listFiles();
    } catch (error) {
      console.error('Error in uploadFile:', error);
    }
  }
}
//             <p><strong>${formattedDate}</strong> - ${fileRef.name}</p>

// function listFiles() {
//   updateElementDisplay();

//   var fileList = document.getElementById('fileList');
//   fileList.innerHTML = '';

//   var filesRef = storage.ref('files');
//   filesRef.listAll().then(function (result) {
//     result.items.forEach(function (fileRef) {
//         fileRef.getMetadata().then((metadata) => {
//           var date = new Date(metadata.timeCreated);
//           var formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
//           var formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

//           fileList.innerHTML += `
//           <div>
//             <strong>${fileRef.name}</strong>
//             <div class="buttons">
//               <a href="javascript:void(0)" onclick="downloadFile('${url}', '${fileRef.name}')" class="download-btn">Download</a>
//               <p> ${date}</p>
//               <button class="file-delete-btn" onclick="deleteFile('${fileRef.name}')">Delete</button>
//             </div>
//           </div>
//           <hr>
//         `;  
//         }).catch((error) => {
//           console.error('Error fetching metadata:', error);
//         });
//       });
//     });
//   updateElementDisplay();
// }
function listFiles() {
  updateElementDisplay();

  var fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  var filesRef = storage.ref('files');
  filesRef.listAll().then(function (result) {
    result.items.forEach(function (fileRef) {
      fileRef.getDownloadURL().then(function (url) {
        fileRef.getMetadata().then((metadata) => {
          var date = new Date(metadata.timeCreated);
          var formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          var formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          fileList.innerHTML += `
            <div>
              <p><strong>${formattedDate}</strong> - ${fileRef.name}</p>
              <div class="buttons">
                <a href="javascript:void(0)" onclick="downloadFile('${url}', '${fileRef.name}')" class="download-btn">Download</a>
                <button class="file-delete-btn" onclick="deleteFile('${fileRef.name}')">Delete</button>
              </div>
            </div>
            <hr>
          `;
        }).catch((error) => {
          console.error('Error fetching metadata:', error);
        });
      });
    });
  });
  updateElementDisplay();
}


function downloadFile(url, fileName) {
  if (isLock == false) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || 'download';

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}

function deleteFile(fileName) {
  if (!isLock) {
    var fileRef = storage.ref('files/' + fileName);

    fileRef.delete().then(function () {
      console.log('File Deleted');
      listFiles();
    });
  }
}

function listenToIsLock() {
  firestore.collection("settings").doc("security").onSnapshot((doc) => {
    if (doc.exists) {
      isLock = doc.data().isLock;

      updateElementDisplay();
    } else {
      console.log("No such document!");
    }
  }, (error) => {
    console.log("Error listening to document:", error);
  });
  updateElementDisplay();
}

function updateElementDisplay() {
  var elements = document.querySelectorAll(".upload-btn, #fileInput");
  var title = document.querySelectorAll("h1")[0];

  elements.forEach(element => {
    element.style.display = isLock ? 'none' : 'block';
  });

  title.style.width = isLock ? "81%" : "100%";
  title.style.textAlign = isLock ? "left" : "center";
}

window.onload = listFiles;
listenToIsLock();

document.addEventListener('contextmenu', event => {
  event.preventDefault();
});

document.onkeydown = function (e) {
  return false;
}