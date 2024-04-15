// (PART A) CAPTURE WRAPPER > CANVAS > BLOB > FILE > FETCH UPLOAD
function capture () {
  html2canvas(document.getElementById("wrap"))
  .then(canvas => canvas.toBlob(blob => {
    // (A1) BLOB TO FORM DATA FILE
    let data = new FormData();
    data.append("file", new File([blob], param.img, { type: "image/webp" }));
    data.append("mod", "F1");
    if (+param.thumb != 0) { data.append("thumb", param.thumb); }

    // (A2) SEND TO SERVER
    fetch(param.process, { method: "POST", body: data})
    .then(res => res.text())
    .then(txt => window.dispatchEvent(new CustomEvent("ok", { detail : txt })))
    .catch(err => window.dispatchEvent(new CustomEvent("ok", { detail : err.message })));
  }, "image/webp"));
}