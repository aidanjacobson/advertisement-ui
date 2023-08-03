function fileUploadChange() {
    uploadBtn.innerText = "Upload";
    if (fileUpload.files.length != 1) {
        uploadBtn.setAttribute("disabled", true);
    } else {
        uploadBtn.removeAttribute("disabled");
    }
}

async function uploadFile() {
    uploadBtn.innerText = "Uploading...";
    uploadBtn.setAttribute("disabled", true);
    await sendXHR();
    await refreshList();
    fileUpload.value = null;
    fileUploadChange();
}

function sendXHR() {
    return new Promise(function(resolve, reject) {
        var x = new XMLHttpRequest();
        x.open("POST", "https://aidanjacobson.duckdns.org:7777/upload");
        //x.setRequestHeader("Content-Type", "multipart/form-data;");
        var formData = new FormData();
        formData.append("advertisement", fileUpload.files[0]);
        x.onload = function() {
            resolve();
        }
        x.send(formData);
    })
}

async function getFileList() {
    return new Promise(function(resolve, reject) {
        var x = new XMLHttpRequest();
        x.open("GET", "https://aidanjacobson.duckdns.org:7777/listall");
        x.onload = function() {
            resolve(JSON.parse(x.responseText));
        }
        x.send();
    });
}

async function refreshList() {
    var table = document.getElementById("imageTableBody");
    table.innerHTML = "";
    var fileList = await getFileList();
    for (var i = 0; i < fileList.length; i++) {
        var row = document.createElement("tr");

        var imageTD = document.createElement("td");
        var anchor = document.createElement("a");
        var image = document.createElement("img");
        image.width = 83*2;
        image.height = 62.8*2;
        image.src = imageURL(fileList[i]);
        anchor.href = imageURL(fileList[i]);
        anchor.append(image);
        imageTD.append(anchor);
        anchor.target = "_blank";
        row.append(imageTD);

        var fNameTD = document.createElement("td");
        fNameTD.innerText = fileList[i];
        row.append(fNameTD);

        var deleteTD = document.createElement("td");
        var deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.setAttribute("x-filename", fileList[i]);
        deleteBtn.onclick = doDelete;
        deleteTD.append(deleteBtn);
        row.append(deleteTD);

        table.append(row);
    }
}

function imageURL(fileName) {
    return `https://aidanjacobson.duckdns.org:7777/advertisement/${fileName}`;
}

async function doDelete(event) {
    var fileName = event.target.getAttribute("x-filename");
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
    await deleteFile(fileName);
    await refreshList();
}

function deleteFile(fileName) {
    return new Promise(function(resolve, reject) {
        var x = new XMLHttpRequest();
        x.open("POST", `https://aidanjacobson.duckdns.org:7777/delete/${fileName}`);
        x.onload = function() {
            resolve();
        }
        x.send();
    })
}

window.onload = function() {
    refreshList();
}