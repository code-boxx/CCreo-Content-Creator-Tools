var common = {
  // (PART A) FETCH
  //  data : form data object, data to send.
  //  after : optioan function, call after server response.
  //  error : optional function, call on no server response.
  //  final : optional function, call after fetch call.
  fetch : (data, after, error, final) => {
    data.append("mod", host.mod);
    fetch(host.process, { method: "POST", body: data})
    .then(res => res.text())
    .then(txt => { if (after) { after(txt); } })
    .catch(err => { console.error(err); if (error) { error(err); } })
    .finally(() => { if (final) { final(); } });
  },

  // (PART B) COLLECT FORM DATA
  //  id : array, id of elements to collect data from.
  //  keep : boolean, keep empty values? default false.
  collect : (id, keep) => {
    if (typeof keep != "boolean") { keep = false; }
    var data = new FormData();
    for (let i of id) {
      let v = document.getElementById(i).value;
      if (v!="" || keep) { data.append(i, v); }
    }
    return data;
  },

  // (PART C) INIT FILE DROP ZONE
  dropper : (id, dropped) => {
    // (C1) GET DROP ZONE
    let hDrop = document.getElementById(id);

    // (C2) HIGHLIGHT DROP ZONE ON DRAG ENTER
    hDrop.ondragenter = e => {
      e.preventDefault();
      e.stopPropagation();
      hDrop.classList.add("highlight");
    };
    hDrop.ondragleave = e => {
      e.preventDefault();
      e.stopPropagation();
      hDrop.classList.remove("highlight");
    };

    // (C3) DROP TO UPLOAD FILE
    hDrop.ondragover = e => {
      e.preventDefault();
      e.stopPropagation();
    };
    hDrop.ondrop = e => {
      e.preventDefault();
      e.stopPropagation();
      hDrop.classList.remove("highlight");
      dropped(e.dataTransfer.files);
    };
  },

  // (PART D) "CONSOLE"
  // (D1) ADD MESSAGE TO "CONSOLE"
  conmsg : txt => {
    // (D1-1) FLUSH
    if (txt=="" || txt==undefined) { document.getElementById("conmsg").innerHTML = ""; }

    // (D1-2) ADD ROW
    else {
      let row = document.createElement("div"),
          now = new Date().toTimeString();
      row.innerHTML = `<div class="text-secondary">${now}</div><div>${txt}</div>`;
      row.className = "border bg-white p-2 mb-2";
      document.getElementById("conmsg").appendChild(row);
    }
  },

  // (D2) SHOW/HIDE "CONSOLE"
  contog : show => document.getElementById("console").className = show ? "" : "d-none" ,

  // (D3) DISABLE CONSOLE CLOSE
  conlock : locked => {
    if (locked) { document.getElementById("conclose").classList.add("d-none"); }
    else { document.getElementById("conclose").classList.remove("d-none"); }
  }
};