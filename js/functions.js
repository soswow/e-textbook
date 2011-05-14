jQuery.fn.css3 = function() {
  var property, value, map, key;
  if (arguments.length == 1) {
    map = arguments[0];
    for (key in map) {
      this.css3(key, map[key]);
    }
  } else if (arguments.length == 2) {
    property = arguments[0],value = arguments[1];

    var that = $(this);
    $.each(["-webkit-", "-moz-", ""], function() {
      that.css(this + property, value);
    });
  }
  return that;
};
String.prototype.pxToInt = function(){
  var val = this.valueOf();
  return +val.substring(0, val.length-2);
};

//var EBOOK =
(function($) {
  var cons = {
    columnWidth: 400,
    columnGap: 40
  },
  keys = {
    left:37,
    up:38,
    right:39,
    down:40
  },
  onePageColumnsCount, totalColumnsCount, columnWidth, currentColumn,
  article, scrollable;

  function getColumnCount(width, colWidth) {
    var i = 1;
    for (; i < 100; i++) {
      if (colWidth * i + cons.columnGap * (i - 1) > width) {
        return i - 1;
      }
    }
  }

  function swipeContent(keyCode) {
    var noColumn = false;
    if (keyCode == keys.left || keyCode == keys.right) {
      currentColumn += keyCode == keys.right ? 1 : -1;
      $(".go_left, .go_right").removeClass("end");
      if (currentColumn <= 0) {
        $(".go_left").addClass("end");
        currentColumn = 0;
      } else if (currentColumn >= totalColumnsCount - onePageColumnsCount) {
        $(".go_right").addClass("end");
//        noColumn = true;
        currentColumn = totalColumnsCount - onePageColumnsCount;
      }
//      console.log(currentColumn);
      scrollToColumn(currentColumn, noColumn);
    }
  }

  function scrollToColumn(index, noColumn){
    article.scrollTo(
      (columnWidth + (noColumn?0:cons.columnGap)) * index,
      200,
      { easing:'linear', queue:true, axis:'x'});
  }

  function updateDynamicValues(){
    var leftPadding = article.css("paddingLeft").pxToInt(),
        leftScroll = article.get(0).scrollLeft - leftPadding;
    onePageColumnsCount = getColumnCount(article.width(), cons.columnWidth);
    columnWidth = (article.width() - (cons.columnGap * (onePageColumnsCount - 1))) / onePageColumnsCount;
    totalColumnsCount = getColumnCount(article.get(0).scrollWidth, columnWidth);
    currentColumn = Math.round((leftScroll < 0 ? 0 : leftScroll) / columnWidth);
  }

  $(function() {
    article = $("article");
    article.css3({
          "column-width": cons.columnWidth,
          "column-gap": cons.columnGap
    });

    article.wrapInner($("<div id='scrollableArea'></div>"));
    scrollable = $("#scrollableArea");

    $(".go_left, .go_right").click(function() {
      swipeContent($(this).hasClass("go_left") ? keys.left : keys.right);
    });


    $(window).resize(function(){
      updateDynamicValues();
      scrollToColumn(currentColumn);
    }).load(function(){
      updateDynamicValues();
      $("#pleaseWaitContainer").hide("normal");
    });
    $(document).keyup(function(e){
      swipeContent(e.keyCode);
    });
  });

//  return {};
}(jQuery));

