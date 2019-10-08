var className,
  classNameForJQ,
  translationBreeds,
  engBreeds,
  engCatBreeds = {},
  engCatsObj = [],
  itemId,
  itemObj,
  arrPreviousImage;

className = $("body").attr("class");
classNameForJQ = "." + className + " ";

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

    $(".option__btn").mouseenter(function() {
      $(this)
        .find(".option__line")
        .animate({ width: lineWidthMax }, 250);
    });

    $(".option__btn").mouseleave(function() {
      $(this)
        .find(".option__line")
        .animate({ width: lineWidthMin }, 250);
    });
  },

  getKeyByValue: (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  },

  loadingBreeds: () => {
    if (className === "main-dogs") {
      $.getJSON("https://dog.ceo/api/breeds/list/all")
        .then(result => {
          engBreeds = Object.keys(result.message);
          return engBreeds;
        })
        .then(engBreeds => {
          translationBreeds = {
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
          };

          for (let i = 0; i < engBreeds.length; i++) {
            let breed = engBreeds[i];

            if (!translationBreeds[breed]) {
              App.translateBreeds(breed, engBreeds);
            }
          }
        })
        .catch(error => {
          $(classNameForJQ + "#content").html(
            "не удалось перевести породы собачек"
          );
        });
    }
    if (className === "main-cats") {
      $.getJSON("https://api.thecatapi.com/v1/breeds")
        .then(result => {
          let origin = result.map(a => a.origin);
          let life_span = result.map(a => a.life_span);
          let engBreeds1 = result.map(a => a.name);
          let engBreedsId = result.map(a => a.id);
          let adaptability = result.map(a => a.adaptability);
          let affection_level = result.map(a => a.affection_level);
          let child_friendly = result.map(a => a.child_friendly);
          let dog_friendly = result.map(a => a.dog_friendly);
          let energy_level = result.map(a => a.energy_level);
          let grooming = result.map(a => a.grooming);
          let health_issues = result.map(a => a.health_issues);
          let intelligence = result.map(a => a.intelligence);
          let shedding_level = result.map(a => a.shedding_level);
          let social_needs = result.map(a => a.social_needs);
          let stranger_friendly = result.map(a => a.stranger_friendly);
          let vocalisation = result.map(a => a.vocalisation);
          let experimental = result.map(a => a.experimental);
          let rare = result.map(a => a.rare);
          let hairless = result.map(a => a.hairless);
          let suppressed_tail = result.map(a => a.suppressed_tail);
          let short_legs = result.map(a => a.short_legs);
          for (let i = 0; i < engBreeds1.length; i++) {
            engCatBreeds[engBreeds1[i]] = engBreedsId[i];
            engCatsObj[i] = {
              name: engBreeds1[i],
              id: engBreedsId[i],
              origin: origin[i],
              life_span: life_span[i],
              adaptability: adaptability[i],
              affection_level: affection_level[i],
              child_friendly: child_friendly[i],
              dog_friendly: dog_friendly[i],
              energy_level: energy_level[i],
              grooming: grooming[i],
              health_issues: health_issues[i],
              intelligence: intelligence[i],
              shedding_level: shedding_level[i],
              social_needs: social_needs[i],
              stranger_friendly: stranger_friendly[i],
              vocalisation: vocalisation[i],
              experimental: experimental[i],
              rare: rare[i],
              hairless: hairless[i],
              suppressed_tail: suppressed_tail[i],
              short_legs: short_legs[i]
            };
          }
          return engCatBreeds;
        })
        .then(engCatBreeds => {
          translationBreeds = {
            Cheetoh: "чито"
          };

          for (let i = 0; i < Object.keys(engCatBreeds).length; i++) {
            let breed = Object.keys(engCatBreeds)[i];

            if (!translationBreeds[breed]) {
              App.translateBreeds(breed, engCatBreeds);
            }
          }
        })
        .catch(error => {
          $(classNameForJQ + "#content").html(
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
        $(classNameForJQ + ".spinner-border.load-breed").hide();
        $(classNameForJQ + ".breeds-dropdown .dropdown-toggle").html(
          'cписок пород <i class="fas fa-check ml-2"></i>'
        );
        $(classNameForJQ + ".fa-check").fadeOut(600);
        for (let value of sortedRusBreeds) {
          html +=
            '<button class="dropdown-item breed-dropdown-item" type="button" value="' +
            App.getKeyByValue(translationBreeds, value) +
            '">' +
            value +
            "</button>";
        }
        $(".text-to-find").prop('disabled', false);

        $(classNameForJQ + ".breeds-select").html(html);
        if (className === "main-cats") {
          dataForPict = engCatBreeds;
        }

        App.clickDropdown(dataForPict);
        App.searchBreed(translationBreeds);
      }
    });
  },

  clickDropdown: dataForPict => {
    $(classNameForJQ + "button.breed-dropdown-item").on("click", function() {
      arrPreviousImage = [];
      let itemRusBreed = $(this).html();
      let itemBreed = $(this).val();
      if (className === "main-dogs") {
        itemId = itemBreed;
      }
      if (className === "main-cats") {
        itemId = engCatBreeds[itemBreed];
        itemObj = engCatsObj.find(x => x.name === itemBreed);
      }
      App.pictBreed(itemId, itemRusBreed, itemObj);
    });
  },

  pictBreed: (breedId, rusBreed, itemObj) => {
    $(classNameForJQ + ".load-pict-breed.spinner-border").show();
    let BREED_PICT_API;
    if (className === "main-dogs") {
      BREED_PICT_API =
        "https://dog.ceo/api/breed/" + breedId + "/images/random";
    } else if (className === "main-cats") {
      BREED_PICT_API =
        "https://api.thecatapi.com/v1/images/search?breed_ids=" + breedId;
    }
    $.getJSON(BREED_PICT_API) // получить картинку первой породы
      .then(data => {
        // если удача
        let imgBreed;
        $(classNameForJQ + ".card-title").html("");
        $(classNameForJQ + ".card-title").html(
          'Порода <span class="breed text-primary">' + rusBreed + "</span>"
        );
        if (className === "main-dogs") {
          imgBreed = data.message;
        } else if (className === "main-cats") {
          imgBreed = data[0].url;
        }

        $(classNameForJQ + ".load-pict-breed.spinner-border").hide();
        $(classNameForJQ + "#content").html(
          '<img class="img-fluid" src="' + imgBreed + '">'
        );

        if (className === "main-cats") {
          $(".characteristics").show();
          let widthStar;
          if ($(window).width() > 610) {
            widthStar = 22;
          } else {
            widthStar = 22;
          }
          for (var key in itemObj) {
            if (key == "life_span") {
              $(classNameForJQ + 'div[data-param="' + key + '"]').html(
                itemObj[key]
              );
            } else if (key != "name" && key != "id" && key != "origin") {
              $(classNameForJQ + 'div[data-param="' + key + '"]').css(
                "width",
                itemObj[key] * widthStar + "px"
              );
              console.log(
                key +
                  "===" +
                  $(classNameForJQ + 'div[data-param="' + key + '"]').css(
                    "width"
                  )
              );
            }
          }
        }

        arrPreviousImage.push($(classNameForJQ + "#content").html());
        $(classNameForJQ + ".btnLeft").prop("disabled", true);
        $(classNameForJQ + ".btnLeft").css("visibility", "visible");
        $(classNameForJQ + ".btnRight").css("visibility", "visible");
        if (arrPreviousImage.length > 1) {
          $(classNameForJQ + ".btnLeft").prop("disabled", false);
        }
      })
      .catch(() => {
        // если ошибка
        $(classNameForJQ + ".load-pict-breed.spinner-border").hide();
        $(classNameForJQ + "#content").html("не удалось загрузить картинку");
      });
  },

  btnLeftRight: () => {
    $(".btnRight").on("click", () => {
      let itemRusBreed = $(classNameForJQ + ".breed").html();
      if (itemId !== undefined) {
        App.pictBreed(itemId, itemRusBreed, itemObj);
      } else {
        return false;
      }
    });

    $(".btnLeft").on("click", () => {
      if (arrPreviousImage.length > 1) {
        $(classNameForJQ + "#content").html("");
        $(classNameForJQ + "#content").html(
          arrPreviousImage[arrPreviousImage.length - 2]
        );
        arrPreviousImage.pop();
      } else {
        return false;
      }
      if (arrPreviousImage.length <= 1) {
        $(classNameForJQ + ".btnLeft").prop("disabled", true);
      }
    });
  },

  searchBreed: translationBreeds => {
    let values;
    let html;
    $(".text-to-find").keyup(function(event) {
      event.preventDefault();
      let search = $(event.target).val();
      values = Object.values(translationBreeds);
      html = "";
      for (let value of values) {
        let valueOne = value.substring(0, search.length);
        if (search === valueOne && search != "") {
          html += "<li class='search__item'>" + value + "</li>";
          $(classNameForJQ + ".search").css("display", "block");
          $(classNameForJQ + ".search__items").html(html);

          $(".search__item").on("click", event => {
            arrPreviousImage = [];
            let itemRusBreed = $(event.target).html();
            let itemBreed = App.getKeyByValue(translationBreeds, itemRusBreed);
            if (className === "main-dogs") {
              itemId = itemBreed;
            }
            if (className === "main-cats") {
              itemId = engCatBreeds[itemBreed];
              itemObj = engCatsObj.find(x => x.name === itemBreed);
            }
            App.pictBreed(itemId, itemRusBreed, itemObj);
            $(classNameForJQ + ".text-to-find").val("");
          });
        }
      }

      if (search == "") {
        html = "";
        $(classNameForJQ + ".search__items").html(html);
        $(classNameForJQ + ".search").css("display", "none");
      }

      $(document).on("click", event => {
        if (!$(classNameForJQ + ".text-to-find").is(event.target)) {
          html = "";
          $(classNameForJQ + ".search__items").html(html);
          $(classNameForJQ + ".search").css("display", "none");
        }
      });

      if (event.keyCode == 27) {
        this.value = "";
        html = "";
        this.value = "";
        $(classNameForJQ + ".search").css("display", "none");
      }

      if (event.keyCode == 13) {
        if (search.length < 4) {
          alert("Введите четыре или более символов");
          this.value = "";
          $(classNameForJQ + ".search").css("display", "none");
        }
        if (search.length >= 4) {
          var regexp = /[a-z\s]/i;
          if (regexp.test($(this).val())) {
            alert("Некорректный ввод");
            this.value = "";
          } else {
            if (App.getKeyByValue(translationBreeds, search)) {
              arrPreviousImage = [];
              let itemBreed = App.getKeyByValue(translationBreeds, search);
              let itemRusBreed = search;
              if (className === "main-dogs") {
                itemId = itemBreed;
              }
              if (className === "main-cats") {
                itemId = engCatBreeds[itemBreed];
                itemObj = engCatsObj.find(x => x.name === itemBreed);
              }
              App.pictBreed(itemId, itemRusBreed, itemObj);
              this.value = "";
              $(classNameForJQ + ".search").css("display", "none");
            } else {
              alert("Такой породы нет, попробуйте еще раз");
              this.value = "";
            }
          }
        }
      }
    });
  }
};

$(document).ready(function() {
  App.init();
});
