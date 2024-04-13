// (PART A) COVER TEMPLATES
/*
name : {
  img : image file in static/
  font : font file in static/
  size : font size
  spacing : line spacing
  color : font color
  swidth: stroke width
  scolor : stroke color
  x, y : starting x and y coordinates
  align : left/center/right
  case : optional. true for upper case, false for lower case.
  quality : 0 (worst) to 95 (best)
}
*/
var covers = {
  "Blog Demo" : {
    img : "C_blog.webp",
    font : "C_BOLDFONT.ttf",
    size : 65, spacing: 10, color: "white",
    swidth: 5, scolor: "black",
    x : 250, y : 70, align : "left", case : true,
    quality : 75
  },
  "Podcast Demo" : {
    img : "C_podcast.webp",
    font : "C_BOLDFONT.ttf",
    size : 65, spacing: 10, color: "white",
    swidth: 5, scolor: "black",
    x : 40, y : 90, align : "left", case : false,
    quality : 75
  },
  "Video Demo" : {
    img : "C_video.webp",
    font : "C_BOLDFONT.ttf",
    size : 65, spacing: 10, color: "white",
    swidth: 5, scolor: "black",
    x : 50, y : 80, align : "left",
    quality : 75
  }
};

// (PART B) CREATE COVER
var cover = {
  // (B1) INIT - POPULATE TEMPLATE SELECTOR
  init : () => {
    let hsel = document.getElementById("template");
    for (let c of Object.keys(covers)) {
      let o = document.createElement("option");
      o.value = c; o.innerHTML = c;
      hsel.appendChild(o);
    }
  },

  // (B2) PROCESS GENERATION
  lock : false, // processing in progress
  go : () => {
    if (!cover.lock) {
      // (B2-1) LOCK
      cover.lock = true;
      common.conmsg(); common.conmsg("Process started.");
      common.conlock(1); common.contog(1);

      // (B2-2) COLLECT DATA
      let template = covers[document.getElementById("template").value],
          txt = document.getElementById("txt").value,
          data = new FormData();
      for (let [k, v] of Object.entries(template)) { data.append(k, v); }
      if (template["case"]) {
        if (template["case"] === true) { data.append("txt", txt.toUpperCase()); }
        if (template["case"] === false) { data.append("txt", txt.toLowerCase()); }
      } else { data.append("txt", txt); }

      // (B2-3) PROCEED
      common.fetch(data,
        txt => common.conmsg(txt),
        err => common.conmsg(err.message),
        () => {
          cover.lock = false;
          common.conmsg("Process finished.");
          common.conlock();
        }
      );
    }

    // (B2-4) STOP FORM SUBMIT
    return false;
  }
};

// (PART C) ON PAGE LOAD
window.addEventListener("load", cover.init);