var collage = {
  // (PART A) HELPER - CREATE AN IMAGE ROW
  row : (i, name) => {
    let row = document.createElement("div");
    row.innerHTML = `${name} <i class="d-none">${i}</i>`;
    row.className = "p-2 mb-2 bg-light";
    document.getElementById("images").appendChild(row);
  },

  // (PART B) ENQUEUE IMAGE
  images : [], // images to create collage with
  allowed : ["jpg", "jpeg", "png", "webp"], // allowed file types
  dragged : null, // current image being dragged
  queue : files => {
    // (B1) ADD HTML ROWS
    for (let f of files) { if (collage.allowed.includes(f.name.split(".").pop().toLowerCase())) {
      collage.row(collage.images.length, f.name);
      collage.images.push(f);
    }}

    // (B2) SORTABLE
    for (let i of document.querySelectorAll("#images div:not([draggable])")) {
      // (B2-1) SET DRAGGABLE
      i.draggable = true;

      // (B2-2) ON DRAG START
      i.ondragstart = e => {
        collage.dragged = i;
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", i.innerHTML);
      };

      // (B2-3) ON DRAG OVER - NECESSARY PREVENT DEFAULT FOR DROP TO WORK
      i.ondragover = e => e.preventDefault();

      // (B2-4) ON DROP - "SWAP POSITION"
      i.ondrop = e => {
        e.preventDefault();
        if (collage.dragged != i) {
          collage.dragged.innerHTML = i.innerHTML;
          i.innerHTML = e.dataTransfer.getData("text/html");
        }
      };

      // (B2-5) HIGHLIGHT ON DRAG OVER
      i.ondragenter = () => i.classList.add("dragover");
      i.ondragleave = () => i.classList.remove("dragover");
      i.ondragend = () => {
        for (let it of document.querySelectorAll("#images div[draggable]")) {
          it.classList.remove("dragover");
        }
      };
    }
  },

  // (PART C) GO!
  locked : false, // processing in progress
  go : () => {
    // (C1) LOCK
    collage.locked = true;
    common.conmsg(); common.conmsg("Process started.");
    common.conlock(1); common.contog(1);

    // (C2) CHECK - NO IMAGES
    if (collage.images.length==0) {
      collage.locked = false;
      common.conmsg("Error - No images selected.");
      common.conlock();
      return false;
    }

    // (C3) TRANSFER IMAGES ONTO "GENERATE COLLAGE PAGE"
    let now = 0,
        caption = document.getElementById("caption").checked,
        order = document.querySelectorAll("#images i.d-none"),
    transfer = () => {
      let file = collage.images[order[now].innerHTML],
          reader = new FileReader();
      reader.onload = () => {
        // (C3-1) CREATE CELL
        let cell = win.document.createElement("div"), img = new Image();
        cell.className = "cell";
        img.src = reader.result;
        cell.appendChild(img);

        // (C3-2) ADD CAPTION
        if (caption) {
          let name = file.name.split("."),
              cap = win.document.createElement("div");
          name.pop();
          cap.className = "caption";
          cap.innerHTML = name.join(".");
          cell.appendChild(cap);
        }

        // (C3-3) APPEND CELL
        win.document.getElementById("grid").appendChild(cell);

        // (C3-4) NEXT IMAGE
        now++;
        if (now < collage.images.length) { transfer(); }

        // (C3-5) TAKE SCREENSHOT
        else {
          common.conmsg("Saving screenshot.");
          html2canvas(win.document.getElementById("grid")).then(canvas => canvas.toBlob(blob => {
            let data = new FormData();
            data.append("file", new File([blob], "collage.webp", { type: "image/webp" }));
            common.fetch(data,
              txt => common.conmsg(txt),
              err => common.conmsg(err.message),
              () => {
                win.close();
                collage.locked = false;
                common.conmsg("Process completed.");
                common.conlock();
              }
            );
          }, "image/webp"));
        }
      };
      common.conmsg("Add - " + file.name);
      reader.readAsDataURL(file);
    };

    // (C4) OPEN "GENERATE COLLAGE PAGE"
    let win = window.open(host.base + "E2");
    win.onload = () => {
      // (C4-1) PARAMETERS
      let row = document.getElementById("row").value,
          width = document.getElementById("width").value,
          height = document.getElementById("height").value,
          gwidth = +row * +width;

      // (C4-2) INSERT STYLE
      let style = win.document.createElement("style");
      style.innerText = `#grid{width:${gwidth}px;grid-template-columns:repeat(${row},minmax(0,1fr))}
      .cell{width:${width}px;height:${height}px}`;
      win.document.head.appendChild(style);

      // (C4-3) APPEND IMAGES
      transfer();
    };
    return false;
  }
};

// (PART D) INIT IMAGE DROP ZONE
window.addEventListener("load", () => common.dropper("drop", collage.queue));