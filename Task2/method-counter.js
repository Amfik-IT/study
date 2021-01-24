function getCounter (nam) {
    let obg = {
        number: nam,
        log() {
            debugger
            console.log (this.number);
            return this;
        },
        count(i) {
            this.number += i;
            return this;
        },
        reset() {
            this.number = 0;
            return this;
        },
    };
    return obg;
}


var counter = getCounter(5);

counter.log()
  .count(4)
  .log()
  .count(3)
  .log()
  .reset()
  .log()
  .count(8)
  .log();