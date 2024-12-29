define(["jquery", "knockout", "bootstrap"], function ($, ko, bootstrap) {
  function beerCreated(error = false, data) {
    const message = { status: error ? 'error' :'success', beer: data};
    window.parent.postMessage(message, '*');
  }

  function CreateViewModel() {
    var self = this;
    self.name = ko.observable('');
    self.image = ko.observable('');
    self.type = ko.observable('');
    self.date = ko.observable('');
    self.description = ko.observable('');

    self.createBeer = () => {
      const empty = [self.name(), self.image(), self.type(), self.date(), self.description()].filter(elem => {
        return elem === '';
      });
      if(empty.length === 0){
        $.post("https://67629e2846efb373237542ad.mockapi.io/api/list", {
          name: self.name(),
          image: self.image(),
          type: self.type(),
          date: self.date(),
          description: self.description()
        }, (result) => {
          beerCreated(false, result);
        }).fail(function() {
          beerCreated(true);
        });
      }
    };
  }

  return {
      init: () => {
        ko.applyBindings(new CreateViewModel(), document.getElementById("main-container"));
      }
  };
});
