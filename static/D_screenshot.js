var screenshot = {
  // (PART A) PROCESS SCREENSHOT
  lock : false,
  go : () => {
    if (!screenshot.lock) {
      // (A1) LOCK
      screenshot.lock = true;
      common.conmsg(); common.conmsg("Process started.");
      common.conlock(1); common.contog(1);

      // (A2) PROCEED
      common.fetch(
        common.collect(["site", "size", "format"]),
        txt => common.conmsg(txt),
        err => common.conmsg(err.message),
        () => {
          screenshot.lock = false;
          common.conmsg("Process completed. It may take a while for Chrome to load the URL and finish.");
          common.conlock();
        }
      );
    }

    // (A3) STOP FORM SUBMIT
    return false;
  }
};