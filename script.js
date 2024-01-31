// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBlfWBWbLPOYNJMTgdshpW5SOESpPZ7btM",
  authDomain: "cyber-cloud-6caec.firebaseapp.com",
  projectId: "cyber-cloud-6caec",
  storageBucket: "cyber-cloud-6caec.appspot.com",
  messagingSenderId: "700790763944",
  appId: "1:700790763944:web:51f3642ad467eb0789ed9d"
};
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

function listFiles() {
  updateElementDisplay();

  var fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  var filesRef = storage.ref('files');
  filesRef.listAll().then(function (result) {
    result.items.forEach(function (fileRef) {
      fileRef.getDownloadURL().then(function (url) {
        // Updated here: Added 'download' attribute to the <a> tag
        fileList.innerHTML += `
        <div>
          <strong>${fileRef.name}</strong>
          <div class="buttons">
            <a href="javascript:void(0)" onclick="downloadFile('${url}', '${fileRef.name}')" class="download-btn">Download</a>
            <button class="file-delete-btn" onclick="deleteFile('${fileRef.name}')">Delete</button>
          </div>
        </div>
        <hr>
      `;

    });
    });
  });
  updateElementDisplay();
}

function downloadFile(url, fileName) {
  if (!isLock) {
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
  // Re-query the buttons as they might have changed
  var elements = document.querySelectorAll(".upload-btn, #fileInput");
  var title = document.querySelectorAll("h1")[0];

  elements.forEach(element => {
    element.style.display = isLock ? 'none' : 'block';
  });

  title.style.width = isLock ? "81%" : "100%";
  title.style.textAlign = isLock ? "left" : "center";
  // title.style.marginRight = isLock ? "auto" : "0";
  // title.style.marginLeft = isLock ? "140px" : "0";

}

// List files on page load
window.onload = listFiles;
listenToIsLock();