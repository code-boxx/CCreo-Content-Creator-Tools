var resize = {
  // (PART A) PRESET IMAGE DIMENSIONS
  preset : sel => { if (sel!="") {
    // (A1) COMMON DIMENSIONS
    let dim = {
      1080 : [1920, 1080],
      720 : [1280, 720],
      480 : [640, 480],
      360 : [480, 360]
    };

    // (A2) ORIENTATION + SELECTED PRESET
    let o = sel[0], p = sel.substring(1);

    // (A3) SET SELECTED PRESET
    if (o=="l") {
      document.getElementById("width").value = dim[p][0];
      document.getElementById("height").value = dim[p][1];
    } else {
      document.getElementById("width").value = dim[p][1];
      document.getElementById("height").value = dim[p][0]
    }
  }},

  // (PART B) QUEUE FILES TO CONVERT
  upqueue : [], // process queue
  uplock : false, // in progress
  allowed : ["jpg", "jpeg", "png", "webp"], // allowed file types
  queue : files => { if (!resize.uplock) {
    // (B1) LOCK PROCESS QUEUE
    resize.uplock = true;

    // (B2) QUEUE SELECTED FILES
    for (let f of files) { if (resize.allowed.includes(f.name.split(".").pop().toLowerCase())) {
      resize.upqueue.push(f);
    }}

    // (B3) START PROCESSING
    if (resize.upqueue.length!=0) {
      common.conmsg(); common.conmsg("Process started.");
      common.conlock(1); common.contog(1);
      resize.go();
    } else { resize.uplock = false; }
  }},

  // (PART C) PROCESS RESIZE/CONVERT
  go : () => {
    // (C1) PLUCK OUT FIRST FILE IN QUEUE
    let file = resize.upqueue[0];
    resize.upqueue.shift();

    // (C2) FORM DATA
    let data = common.collect(["width", "height", "format", "quality"]);
    data.append("file", file);

    // (C3) FETCH
    common.fetch(data,
      txt => common.conmsg(`${file["name"]} - ${txt}`),
      err => common.conmsg(`${file["name"]} - ${err.message}`),
      () => {
        if (resize.upqueue.length==0) {
          resize.uplock = false;
          common.conmsg("Process completed.");
          common.conlock();
        } else { resize.go(); }
      }
    );
  }
};

// (PART D) INIT IMAGE DROP ZONE
window.addEventListener("load", () => common.dropper("drop", resize.queue));