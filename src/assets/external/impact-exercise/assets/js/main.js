requirejs.config({
  baseUrl: "assets/js",
  paths: {
      "jquery": "lib/jquery.min",
      "knockout": "lib/knockout.min",
      "bootstrap": "lib/bootstrap.bundle.min",
  }
});

require(["index"], function (Index) {
  Index.init();
});
