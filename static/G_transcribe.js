var transcribe = {
  // (PART A) PROCESS TRANSCRIBE
  lock : false, // in progress
  go : () => { if (!transcribe.lock) {
    // (A1) LOCK SCREEN
    transcribe.lock = true;
    common.conmsg(); common.conmsg("Process started - This may take a while depending on the audio length.");
    common.conlock(1);
    common.contog(1);

    // (A2) UPLOAD & PROCESS
    let data = new FormData();
    data.append("file", document.getElementById("file").files[0]);
    common.fetch(data,
      txt => common.conmsg(txt),
      err => common.conmsg(err.message),
      () => {
        transcribe.lock = false;
        common.conmsg("Process completed.");
        common.conlock();
      }
    );
  }}
};