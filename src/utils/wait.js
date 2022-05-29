function wait(second) {
  return new Promise(function time(resolve) {
    setTimeout(resolve, second * 1000);
  });
}

export default wait;
