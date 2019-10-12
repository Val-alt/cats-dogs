var dataPage = $("body").attr("data-page"),
dataPageForJQ = "[data-page='" + dataPage + "'] ",
  translationBreeds,
  engBreeds,
  engCatBreeds = {},
  engCatsObj = [],
  itemId,
  itemObj,
  arrPreviousImage,
  correctBreedDogTranslation = {
    waterdog: "водяная собака",
    papillon: "папильён",
    african: "африканская",
    cattledog: "пастушья собака",
    cotondetulear: "котон-де-тулеар",
    entlebucher: "энтлебухер",
    eskimo: "эскимосская собака",
    germanshepherd: "немецкая овчарка",
    mexicanhairless: "ксолоитцкуинтли",
    mountain: "зенненхунд",
    pointer: "пойнтер",
    pug: "мопс",
    puggle: "пагль",
    redbone: "редбон кухаунд",
    shihtzu: "ши-тцу",
    stbernard: "сербернар"
  },
  correctBreedCatTranslation = {
    Cheetoh: "чито"
  };

var App = {
  options: {},

  init: function() {
    this.animateLine();
    this.loadingBreeds();
    this.btnLeftRight();
  },

  animateLine: () => {
    let lineWidthMax, lineWidthMin;
    lineWidthMin = "0px";

    if ($(window).width() > "1234") {
      lineWidthMax = "600px";
    } else if ($(window).width() > "646") {
      lineWidthMax = "280px";
    } else if ($(window).width() <= "575") {
      lineWidthMax = "200px";
    }

    $("[data-btn='main-page']").on("mouseenter", function() {
      $(this)
        .find(".option__line")
        .animate({ width: lineWidthMax }, 250);
    });

    $("[data-btn='main-page']").on("mouseleave", function() {
      $(this)
        .find(".option__line")
        .animate({ width: lineWidthMin }, 250);
    });
  },

  getKeyByValue: (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  },

  loadingBreeds: () => {
    if (dataPage === "dogs") {
      $.getJSON("https://dog.ceo/api/breeds/list/all")
        .then(result => {
          engBreeds = Object.keys(result.message);
          return engBreeds;
        })
        .then(engBreeds => {
          translationBreeds = correctBreedDogTranslation;

          for (let i = 0; i < engBreeds.length; i++) {
            let breed = engBreeds[i];

            if (!translationBreeds[breed]) {
              App.translateBreeds(breed, engBreeds);
            }
          }
        })
        .catch(error => {
          $(dataPageForJQ + "[data-card='content']").html(
            "не удалось перевести породы собачек"
          );
        });
    }
    if (dataPage === "cats") {
      $.getJSON("https://api.thecatapi.com/v1/breeds")
        .then(result => {
          for (let i = 0; i < result.length; i++) {
            engCatBreeds[result[i].name] = result[i].id;
            engCatsObj[i] = result[i];
          }
          return engCatBreeds;
        })
        .then(engCatBreeds => {
          translationBreeds = correctBreedCatTranslation;

          for (let i = 0; i < Object.keys(engCatBreeds).length; i++) {
            let breed = Object.keys(engCatBreeds)[i];

            if (!translationBreeds[breed]) {
              App.translateBreeds(breed, engCatBreeds);
            }
          }
        })
        .catch(error => {
          $(dataPageForJQ + "[data-card='content']").html(
            "не удалось перевести породы кошечек"
          );
        });
    }
  },

  translateBreeds: (breed, engBreeds) => {
    let YA_TRANSLATE_KEY =
      "trnsl.1.1.20190118T073029Z.3f310cb0cd1394d9.52268319f275afdd6bc274241581fc691aa64ccd";

    let YA_TRANSLATE_API =
      "https://translate.yandex.net/api/v1.5/tr.json/translate?key=";

    $.getJSON(
      YA_TRANSLATE_API + YA_TRANSLATE_KEY + "&text=" + breed + "&lang=en-ru"
    ).then(response => {
      let rusBreed = response.text[0].toLowerCase();
      translationBreeds[breed] = rusBreed;
      if (
        Object.keys(translationBreeds).length === Object.keys(engBreeds).length
      ) {
        let sortedRusBreeds = Object.values(translationBreeds).sort();
        let html = "";
        let dataForPict;
        $(dataPageForJQ + "[data-icon='load-breed']").hide();
        $(dataPageForJQ + ".breeds-dropdown .dropdown-toggle").html(
          'cписок пород <i class="fas fa-check ml-2" data-icon="check"></i>'
        );
        $(dataPageForJQ + "[data-icon='check']").fadeOut(600);
        for (let value of sortedRusBreeds) {
          html +=
            '<button class="dropdown-item" type="button" value="' +
            App.getKeyByValue(translationBreeds, value) +
            '" data-btn="breed-item">' +
            value +
            "</button>";
        }
        $(dataPageForJQ + "[data-search='input']").prop("disabled", false);
        $(dataPageForJQ + "[data-btn='search']").prop("disabled", false);

        $(dataPageForJQ + ".breeds-select").html(html);
        if (dataPage === "cats") {
          dataForPict = engCatBreeds;
        }

        App.clickDropdown(dataForPict);
        App.searchBreed(sortedRusBreeds);
      }
    });
  },

  clickDropdown: dataForPict => {
    $(dataPageForJQ + "[data-btn='breed-item']").on("click", function() {
      arrPreviousImage = [];
      let itemRusBreed = $(this).html();
      let itemBreed = $(this).val();
      if (dataPage === "dogs") {
        itemId = itemBreed;
      }
      if (dataPage === "cats") {
        itemId = engCatBreeds[itemBreed];
        itemObj = engCatsObj.find(x => x.name === itemBreed);
      }
      App.pictBreed(itemId, itemRusBreed, itemObj);
    });
  },

  pictBreed: (breedId, rusBreed, itemObj) => {
    $(dataPageForJQ + "[data-icon='load-pict']").show();
    let BREED_PICT_API;
    if (dataPage === "dogs") {
      BREED_PICT_API =
        "https://dog.ceo/api/breed/" + breedId + "/images/random";
    } else if (dataPage === "cats") {
      BREED_PICT_API =
        "https://api.thecatapi.com/v1/images/search?breed_ids=" + breedId;
    }
    $.getJSON(BREED_PICT_API) // получить картинку первой породы
      .then(data => {
        // если удача
        let imgBreed;
        $(dataPageForJQ + "[data-card='title']").html("");
        $(dataPageForJQ + "[data-card='title']").html(
          'Порода <span class="breed text-primary">' + rusBreed + "</span>"
        );
        if (dataPage === "dogs") {
          imgBreed = data.message;
        } else if (dataPage === "cats") {
          imgBreed = data[0].url;
        }

        $(dataPageForJQ + "[data-icon='load-pict']").hide();
        $(dataPageForJQ + "[data-card='content']").html(
          '<img class="img-fluid" src="' + imgBreed + '">'
        );

        if (dataPage === "cats") {
          $("[data-characteristics]").show();
          let widthStar;
          if ($(window).width() > 610) {
            widthStar = 22;
          } else {
            widthStar = 22;
          }
          for (var key in itemObj) {
            if (key == "life_span") {
              $(dataPageForJQ + 'div[data-param="' + key + '"]').html(
                itemObj[key]
              );
            } else {
              $(dataPageForJQ + 'div[data-param="' + key + '"]').css(
                "width",
                itemObj[key] * widthStar + "px"
              );
            }
          }
        }

        arrPreviousImage.push(
          $(dataPageForJQ + "[data-card='content']").html()
        );
        $(dataPageForJQ + "[data-btn='left-pict']").prop("disabled", true);
        $(dataPageForJQ + "[data-btn='left-pict']").css(
          "visibility",
          "visible"
        );
        $(dataPageForJQ + "[data-btn='right-pict']").css(
          "visibility",
          "visible"
        );
        if (arrPreviousImage.length > 1) {
          $(dataPageForJQ + "[data-btn='left-pict']").prop("disabled", false);
        }
      })
      .catch(() => {
        // если ошибка
        $(dataPageForJQ + "[data-icon='load-pict']").hide();
        $(dataPageForJQ + "[data-card='content']").html(
          "не удалось загрузить картинку"
        );
      });
  },

  btnLeftRight: () => {
    $("[data-btn='right-pict']").on("click", () => {
      let itemRusBreed = $(dataPageForJQ + ".breed").html();
      if (itemId !== undefined) {
        App.pictBreed(itemId, itemRusBreed, itemObj);
      } else {
        return false;
      }
    });

    $("[data-btn='left-pict']").on("click", () => {
      if (arrPreviousImage.length > 1) {
        $(dataPageForJQ + "[data-card='content']").html("");
        $(dataPageForJQ + "[data-card='content']").html(
          arrPreviousImage[arrPreviousImage.length - 2]
        );
        arrPreviousImage.pop();
      } else {
        return false;
      }
      if (arrPreviousImage.length <= 1) {
        $(dataPageForJQ + "[data-btn='left-pict']").prop("disabled", true);
      }
    });
  },

  searchBreed: sortedRusBreeds => {
    let values;
    let html;
    let search;
    $("[data-search='input']").keyup(function(event) {
      event.preventDefault();
      search = $(event.target)
        .val()
        .toLowerCase();
      values = sortedRusBreeds;
      html = "";
      for (let value of values) {
        let valueOne = value.substring(0, search.length);
        if (search === valueOne && search != "") {
          html +=
            "<li class='search__item' data-search='item'>" + value + "</li>";
          $(dataPageForJQ + "[data-search='result']").css("display", "block");
          $(dataPageForJQ + "[data-search='list']").html(html);

          $("[data-search='item']").on("click", event => {
            arrPreviousImage = [];
            let itemRusBreed = $(event.target).html();
            let itemBreed = App.getKeyByValue(translationBreeds, itemRusBreed);
            if (dataPage === "dogs") {
              itemId = itemBreed;
            }
            if (dataPage === "cats") {
              itemId = engCatBreeds[itemBreed];
              itemObj = engCatsObj.find(x => x.name === itemBreed);
            }
            App.pictBreed(itemId, itemRusBreed, itemObj);
            $(dataPageForJQ + "[data-search='input']").val("");
          });
        }
      }

      if (search == "") {
        html = "";
        $(dataPageForJQ + "[data-search='list']").html(html);
        $(dataPageForJQ + "[data-search='result']").css("display", "none");
      }

      $(document).on("click", event => {
        if (!$(dataPageForJQ + "[data-search='input']").is(event.target)) {
          html = "";
          $(dataPageForJQ + "[data-search='list']").html(html);
          $(dataPageForJQ + "[data-search='result']").css("display", "none");
        }
      });

      if (event.keyCode == 27) {
        this.value = "";
        $(dataPageForJQ + "[data-search='result']").css("display", "none");
      }
    });

    $("[data-btn='search']").on("click", () => {
      if (search.length < 4) {
        $("[data-search='input']")[0].value = "";
        $(dataPageForJQ + "[data-search='result']").css("display", "none");
        alert("Введите четыре или более символов");
      } else if (search.length >= 4) {
        var regexp = /[a-z\s]/i;
        if (regexp.test(search)) {
          $("[data-search='input']")[0].value = "";
          alert("Некорректный ввод");
        } else {
          if (App.getKeyByValue(translationBreeds, search)) {
            arrPreviousImage = [];
            let itemBreed = App.getKeyByValue(translationBreeds, search);
            let itemRusBreed = search;
            if (dataPage === "dogs") {
              itemId = itemBreed;
            }
            if (dataPage === "cats") {
              itemId = engCatBreeds[itemBreed];
              itemObj = engCatsObj.find(x => x.name === itemBreed);
            }
            App.pictBreed(itemId, itemRusBreed, itemObj);
            $("[data-search='input']")[0].value = "";
            $(dataPageForJQ + "[data-search='result']").css("display", "none");
          } else {
            alert("Такой породы нет, попробуйте еще раз");
            $("[data-search='input']")[0].value = "";
          }
        }
      }
    });
  }
};

$(document).ready(function() {
  App.init();
});
