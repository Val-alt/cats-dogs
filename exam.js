var YA_TRANSLATE_KEY =
  "trnsl.1.1.20190118T073029Z.3f310cb0cd1394d9.52268319f275afdd6bc274241581fc691aa64ccd";

var $loading = $("#message").hide();

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
var translations;

$.getJSON("https://dog.ceo/api/breeds/list/all")
  .then(result => {
    var engBreeds = Object.keys(result.message);
    return engBreeds;
  })
  .then(engBreeds => {
    translations = {
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

      if (!translations[breed]) {
        $.getJSON(
          "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" +
            YA_TRANSLATE_KEY +
            "&text=" +
            breed +
            "&lang=en-ru"
        ).then(response => {
          var rusBreed = response.text[0].toLowerCase();

          translations[breed] = rusBreed;

          if (Object.keys(translations).length === engBreeds.length) {
            var sortedRusBreeds = Object.values(translations).sort();
            var html = "";
            $(".spinner-border.load-breed").hide();
            $(".dropdown-toggle").html(
              'cписок пород <i class="fas fa-check ml-2"></i>'
            );
            $(".fa-check").fadeOut(600);
            // var qaz = {};
            for (let value of sortedRusBreeds) {
              html +=
                '<button class="dropdown-item" type="button" value="' +
                getKeyByValue(translations, value) +
                '">' +
                value +
                "</button>";
              // var qqq = getKeyByValue(translations, value);
              // qaz[qqq] = value;
            }

            $(".dogs-select").html(html);
            clickDropdown();
          }
        });
      }
    }
  })
  .catch(error => {
    $("#content").html("не удалось перевести породы собачек");
  });

function Dogs(breed, rusBreed) {
  $(".load-dog.spinner-border").show();
  $.getJSON("https://dog.ceo/api/breed/" + breed + "/images/random") // получить картинку первой породы
    .then(data => {
      // если удача
      $(".card-title").html("");
      $(".card-title").html(
        'Собачки породы <span class="breed text-primary">' +
          rusBreed +
          "</span>"
      );

      $(".load-dog.spinner-border").hide();

      $("#content").html('<img class="img-fluid" src="' + data.message + '">');

      arrPreviousImage.push($("#content").html());
      $("#btnLeft").prop("disabled", true);
      $("#btnLeft").css("visibility", "visible");
      $("#btnRight").css("visibility", "visible");
      if (arrPreviousImage.length > 1) {
        $("#btnLeft").prop("disabled", false);
      }
    })
    .catch(() => {
      // если ошибка
      $(".load-dog.spinner-border").hide();
      $("#content").html("не удалось загрузить собачку");
    });
}

var itemBreed, itemRusBreed;

function clickDropdown() {
  $(".main-dogs button.dropdown-item").on("click", function() {
    arrPreviousImage = [];
    itemBreed = $(this).val();
    itemRusBreed = $(this).html();
    Dogs(itemBreed, itemRusBreed);
  });
}

$("#btnRight").on("click", () => {
  if (itemBreed !== undefined) {
    Dogs(itemBreed, itemRusBreed);
  } else {
    return false;
  }
});

$("#btnLeft").on("click", () => {
  if (arrPreviousImage.length > 1) {
    $("#content").html("");
    $("#content").html(arrPreviousImage[arrPreviousImage.length - 2]);
    arrPreviousImage.pop();
  } else {
    return false;
  }
  if (arrPreviousImage.length <= 1) {
    $("#btnLeft").prop("disabled", true);
  }
});

$("#text-to-find").keyup(function(event) {
  event.preventDefault();
  var search = $(event.target).val();
  $.get("ajax/dogs.json").then(result => {
    var qwe = Object.values(result);
    let html = "";

    for (let value of qwe) {
      let value1 = value.substring(0, search.length);
      if (search === value1 && search != "") {
        html += "<li class='search__item'>" + value + "</li>";
        $(".search").css("display", "block");
        $(".search__items").html(html);

        $(".search__item").on("click", event => {
          arrPreviousImage = [];
          itemRusBreed = $(event.target).html();
          itemBreed = getKeyByValue(translations, itemRusBreed);
          Dogs(itemBreed, itemRusBreed);
          $("#text-to-find").val("");
        });
      }
    }

    if (search == "") {
      html = "";
      $(".search__items").html(html);
      $(".search").css("display", "none");
    }

    $(document).on("click", event => {
      if (!$("#text-to-find").is(event.target)) {
        html = "";
        $(".search__items").html(html);
        $(".search").css("display", "none");
      }
    });
  });

  if (event.keyCode == 27) {
    this.value = "";
    html = "";
    $(".search__items").html(html);
    $(".search").css("display", "none");
  }

  if (event.keyCode == 13) {
    if (search.length < 4) {
      alert("Введите четыре или более символов");
      this.value = "";
    }
    if (search.length >= 4) {
      var regexp = /[a-z\s]/i;
      if (regexp.test($(this).val())) {
        alert("Некорректный ввод");
        this.value = "";
      } else {
        if (getKeyByValue(translations, search)) {
          arrPreviousImage = [];
          itemBreed = getKeyByValue(translations, search);
          itemRusBreed = search;
          Dogs(itemBreed, itemRusBreed);
        } else {
          alert("Такой породы нет, попробуйте еще раз");
          this.value = "";
        }
      }
    }
  }
});

// КОШЕЧКИ

var translations1;
var engBreeds12 = {};
var test = [];

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
      engBreeds12[engBreeds1[i]] = engBreedsId[i];
      test[i] = {
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
      // console.log(test);
    }
    return engBreeds12;
  })
  .then(engBreeds12 => {
    translations1 = {
      Cheetoh: "чито"
    };

    for (let i = 0; i < Object.keys(engBreeds12).length; i++) {
      let breed1 = Object.keys(engBreeds12)[i];

      if (!translations1[breed1]) {
        $.getJSON(
          "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" +
            YA_TRANSLATE_KEY +
            "&text=" +
            breed1 +
            "&lang=en-ru"
        ).then(response => {
          var rusBreed1 = response.text[0].toLowerCase();

          translations1[breed1] = rusBreed1;
          // console.log(JSON.stringify(translations1));

          if (
            Object.keys(translations1).length ===
            Object.keys(engBreeds12).length
          ) {
            var sortedRusBreeds1 = Object.values(translations1).sort();
            var html = "";
            $(".spinner-border.load-breed").hide();
            $(".dropdown-toggle1").html(
              'cписок пород <i class="fas fa-check ml-2"></i>'
            );
            $(".fa-check").fadeOut(600);
            for (let value of sortedRusBreeds1) {
              html +=
                '<button class="dropdown-item" type="button" value="' +
                getKeyByValue(translations1, value) +
                '">' +
                value +
                "</button>";
            }

            $(".dogs-select1").html(html);
            clickDropdown1();
          }
        });
      }
    }
  })
  .catch(error => {
    $("#content").html("не удалось перевести породы кошечек");
  });

function Cats(breed, rusBreed, catObj) {
  $(".load-cat.spinner-border").show();
  $.getJSON("https://api.thecatapi.com/v1/images/search?breed_ids=" + breed) // получить картинку первой породы
    .then(data => {
      // если удача
      let img1 = data[0].url;
      $(".card-title1").html("");
      $(".card-title1").html(
        'Кошечки породы <span class="breed text-primary">' +
          rusBreed +
          "</span>"
      );

      $(".load-cat.spinner-border").hide();

      $("#content1").html('<img class="img-fluid" src="' + img1 + '">');

      for (var key in catObj) {
        // console.log(catObj);
        if (key == "life_span") {
          $('div[data-param="' + key + '"]').html(catObj[key]);
        } else if (
          key == "experimental" ||
          key == "rare" ||
          key == "hairless" ||
          key == "suppressed_tail" ||
          key == "short_legs"
        ) {
          $('div[data-param="' + key + '"]').css(
            "background-image",
            "url('img/" + catObj[key] + "star-one.png')"
          );
        } else if (key != "name" && key != "id" && key != "origin") {
          $('div[data-param="' + key + '"]').css(
            "background-image",
            "url('img/" + catObj[key] + "star.png')"
          );
        }
      }

      arrPreviousImage1.push($("#content1").html());
      $("#btnLeft1").prop("disabled", true);
      $("#btnLeft1").css("visibility", "visible");
      $("#btnRight1").css("visibility", "visible");
      if (arrPreviousImage1.length > 1) {
        $("#btnLeft1").prop("disabled", false);
      }
    })
    .catch(() => {
      // если ошибка
      $(".load-cat.spinner-border").hide();
      $("#content1").html("не удалось загрузить кошечку");
    });
}

var itemBreed1, itemRusBreed1, itemId1, catObj;

function clickDropdown1() {
  $(".main-cats button.dropdown-item").on("click", function() {
    arrPreviousImage1 = [];
    itemBreed1 = $(this).val();
    itemId1 = engBreeds12[itemBreed1];
    itemRusBreed1 = $(this).html();
    catObj = test.find(x => x.name === itemBreed1);
    // console.log(itemId1, itemRusBreed1);
    Cats(itemId1, itemRusBreed1, catObj);
  });
}

$("#btnRight1").on("click", () => {
  if (itemId1 !== undefined) {
    Cats(itemId1, itemRusBreed1);
  } else {
    return false;
  }
});

$("#btnLeft1").on("click", () => {
  if (arrPreviousImage1.length > 1) {
    $("#content1").html("");
    $("#content1").html(arrPreviousImage1[arrPreviousImage1.length - 2]);
    arrPreviousImage1.pop();
  } else {
    return false;
  }
  if (arrPreviousImage1.length <= 1) {
    $("#btnLeft").prop("disabled", true);
  }
});

$("#text-to-find").keyup(function(event) {
  event.preventDefault();
  var search = $(event.target).val();
  $.get("ajax/cats.json").then(result => {
    var qwe = Object.values(result);
    let html = "";

    for (let value of qwe) {
      let value1 = value.substring(0, search.length);
      if (search === value1 && search != "") {
        html += "<li class='search__item'>" + value + "</li>";
        $(".search").css("display", "block");
        $(".search__items").html(html);

        $(".search__item").on("click", event => {
          arrPreviousImage1 = [];
          itemRusBreed = $(event.target).html();
          itemBreed1 = getKeyByValue(translations1, itemRusBreed);
          itemId1 = engBreeds12[itemBreed1];
          catObj = test.find(x => x.name === itemBreed1);
          console.log(itemRusBreed);
          Cats(itemId1, itemRusBreed, catObj);
          $("#text-to-find").val("");
        });
      }
    }

    if (search == "") {
      html = "";
      $(".search__items").html(html);
      $(".search").css("display", "none");
    }

    $(document).on("click", event => {
      if (!$("#text-to-find").is(event.target)) {
        html = "";
        $(".search__items").html(html);
        $(".search").css("display", "none");
      }
    });
  });

  if (event.keyCode == 27) {
    this.value = "";
    html = "";
    $(".search__items").html(html);
    $(".search").css("display", "none");
  }

  if (event.keyCode == 13) {
    if (search.length < 4) {
      alert("Введите четыре или более символов");
      this.value = "";
    }
    if (search.length >= 4) {
      var regexp = /[a-z\s]/i;
      if (regexp.test($(this).val())) {
        alert("Некорректный ввод");
        this.value = "";
      } else {
        console.log(translations1);
        if (getKeyByValue(translations1, search)) {
          arrPreviousImage1 = [];
          itemBreed1 = getKeyByValue(translations1, search);
          itemRusBreed = search;
          itemId1 = engBreeds12[itemBreed1];
          catObj = test.find(x => x.name === itemBreed1);
          Cats(itemId1, itemRusBreed, catObj);
        } else {
          alert("Такой породы нет, попробуйте еще раз");
          this.value = "";
        }
      }
    }
  }
});