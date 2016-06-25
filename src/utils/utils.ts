declare var process: any;
declare var window: any;

function getTime() {

    if (typeof window !== "undefined") {

        // modern browsers
        return window.performance.now();

    } else if (typeof process !== "undefined") {

        // node
        let nanoseconds = process.hrtime()[1];
        let milliseconds = nanoseconds / 1000000;
        return milliseconds;

    } else {

        // old browsers
        return new Date().getTime();

    }

}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
    s4() + "-" + s4() + s4() + s4();
}

function getTimeDiference( start: number, end: number) {
    let diff = end - start;
    let formatted = diff.toFixed(2);
    return formatted;
}

export { getTime, getTimeDiference, guid };
