var asoup = {
  // (PART A) PROCESS RESEARCH
  lock : false, // in progress
  go : () => { if (!asoup.lock) {
    // (A1) LOCK SCREEN
    asoup.lock = true;
    common.conmsg(); common.conmsg("Process started - This will take a while...");
    common.conlock(1);
    common.contog(1);

    // (A2) PROCESS
    common.fetch(common.collect(["keyword", "engine"]),
      txt => common.conmsg(txt),
      err => common.conmsg(err.message),
      () => {
        asoup.lock = false;
        common.conmsg("Process completed.");
        common.conlock();
      }
    );

    // (A3) PREVENT SUBMIT
    return false;
  }}
};