//Augmenting jQuery and standard objects.
if(!jQuery.fn.css3){
  jQuery.fn.css3 = function() {
    var property, value, map, key;
    if (arguments.length === 1) {
      map = arguments[0];
      for (key in map) {
        this.css3(key, map[key]);
      }
    } else if (arguments.length === 2) {
      property = arguments[0],value = arguments[1];

      var that = $(this);
      $.each(["-webkit-", "-moz-", "-o-", ""], function() {
        that.css(this + property, value);
      });
    }
    return that;
  };
}
String.prototype.pxToInt = function(){
  var val = this.valueOf();
  return +val.substring(0, val.length-2);
};
if(!String.prototype.startsWith){
  String.prototype.startsWith = function(str){
    var val = this.valueOf();
    if(str.length > val.length){
      return false;
    }else{
      return val.substring(0, str.length) === str;
    }
  };
}

(function($) {
  //Initializing local variables.
  var cons = {
    columnWidth: 500,
    columnGap: 40
  },
  keys = {
    left:37,
    up:38,
    right:39,
    down:40
  },
  onePageColumnsCount, totalColumnsCount, columnWidth, currentColumn,
  sectionIndexMap,
  article, sections,
  idPrefix = "book-",
  openCloseWords = ["open", "close"];

  function getColumnCount(width, colWidth) {
    //Finds number of columns fitted into specified width.

    var i = 1;
    for (; i < 100; i++) {
      if (colWidth * i + cons.columnGap * (i - 1) > width) {
        break;
      }
    }
    return i-1;
  }

  function updateArrows() {
    //Update statuses of arrows (disabling/enabling)
    //and update current column if needed.
    
    $("#eo-left-event, #eo-right-event").removeClass("end");
    if (currentColumn <= 0) {
      $("#eo-left-event").addClass("end");
      currentColumn = 0;
    } else if (currentColumn >= totalColumnsCount - onePageColumnsCount) {
      $("#eo-right-event").addClass("end");
      currentColumn = totalColumnsCount - onePageColumnsCount;
    }
  }

  function swipeContent(keyCode) {
    //Swipe content right or left
    scrollToColumn(currentColumn + (keyCode === keys.right ? 1 : -1));
  }

  function updateColumnCounter(){
    /* column conter */
    $("#eo-columncounter").html("<span>"+(currentColumn + 1)+"</span>/<span>"+totalColumnsCount+"</span>");
  }

  function scrollToColumn(index){
    //Move to specified column index. Starting from 0
    if(index !== undefined){
      if(index === currentColumn){
        return; //Already on place
      }
      currentColumn = index;
      updateArrows();
      index = currentColumn;
      var hash = currentColumn;
      if(sectionIndexMap[index] !== undefined){
        hash = sectionIndexMap[index];
      }

      updateColumnCounter();

      document.location.hash = "#"+hash;
      article.scrollTo(
        (columnWidth + cons.columnGap) * currentColumn,
        200,
        { easing:'linear', queue:true, axis:'x',
          onAfter:function(){}
        });
    }
  }

  function updateDynamicValues(){
    //Update some dynamic local variable

    var leftPadding = article.css("paddingLeft").pxToInt(),
        leftScroll = article.get(0).scrollLeft - leftPadding;
    onePageColumnsCount = getColumnCount(article.width(), cons.columnWidth);
    columnWidth = (article.width() - (cons.columnGap * (onePageColumnsCount - 1))) / onePageColumnsCount;
    totalColumnsCount = getColumnCount(article.get(0).scrollWidth, columnWidth);
    currentColumn = Math.round((leftScroll < 0 ? 0 : leftScroll) / columnWidth);
    sectionIndexMap = {};
    $.each(sections, function(){
      var that = $(this), id=getNoPrefixId(that);
      if(id){
        var index = columnOfObject(that);
        sectionIndexMap[index] = id;
        sectionIndexMap[id] = index;
      }
    });
  }

  function hashWatcher(){
    var oldHash;
    setInterval(function(){
      var colIndex, hash = document.location.hash;
      if(hash && oldHash !== hash){
        hash = hash.substr(1);
//        obj = $(hash);
        if(sectionIndexMap[hash]){
          colIndex = sectionIndexMap[hash];
        }else{
          colIndex = +hash;
        }

        if(colIndex && !isNaN(colIndex)){
          scrollToColumn(colIndex);
        }
      }
      oldHash = document.location.hash;
    }, 300);
  }

//  function scrollToObject(obj){
//    scrollToColumn(columnOfObject(obj));
//  }

  function columnOfObject(obj){
    var left = obj.position().left + article.scrollLeft();
    var colNum = left / (columnWidth + cons.columnGap);
    return colNum - (colNum>0?1:0);
  }
  
  function getNoPrefixId(obj){
    var id = obj.attr("id");
    if(id && id.startsWith(idPrefix)){
      return id.substr(idPrefix.length);
    }
    return id;
  }

  function initializeFigures() {
    $("figure").each(function(){
      var self = $(this),
          title = self.attr("title"),
          img = self.find("img"),
          caption = self.find("figcaption");

      self.wrapInner($('<div class="container"></div>'))
        .prepend($('<div class="title">'+title+':</div>'))
        .prepend($('<a href="#" class="openclose">open</a>'));

      img.click(function(){
          return hs.expand(this, {
            src: img.attr("src"),
            wrapperClassName: 'wide-border',//'borderless floating-caption',
            dimmingOpacity: 0.3,
            align: 'center',
            captionText: caption.html(),
            captionOverlay: {
              padding:5+'px',
              width: 300 + 'px',
              position: 'rightpanel'
            }
          });
        })
    });

    $(".openclose").click(function (){
      var that = $(this),
          figure = that.parents("figure").eq(0),
          cont = figure.find(".container"),
          toOpen = that.text() == openCloseWords[0];
      if(toOpen){
        cont.slideDown();
        that.html(openCloseWords[1]);
      }else{
        cont.slideUp();
        that.html(openCloseWords[0]);
      }
    }).each(function(){
      var that = $(this);
      that.parents("figure").eq(0).find(".title").click(function(){
        that.trigger("click");
      });
    });
    $("A.gotoFigure").click(function(){
      var that = $(this),
          id = that.attr("href"),
          figure = $(id),
          toggleButton = figure.find(".openclose"),
          isCosed = toggleButton.text() == openCloseWords[0];
      figure.find("img").click();
      if(figure){
        if(isCosed){
          toggleButton.click();
        }
        scrollToColumn(columnOfObject(figure));
      }
      return false;
    });
  }

  $(function() {
    //On DOM load event actions
    var sectionChooserDiv = $("#section-chooser");
    article = $("article");
    sections = article.find("section");
    article.css3({
          "column-width": cons.columnWidth,
          "column-gap": cons.columnGap
    }); //Set column properties

    if(!$.browser.mozilla){
        $("HTML > HEAD").prepend("<link rel='stylesheet' type='text/css' href='styles/mathml.css' />");
    }

    $("#eo-go-left, #eo-go-right").click(function() {
      //Arrow buttons event handling
      swipeContent($(this).is("#eo-go-left") ? keys.left : keys.right);
    });

    $(document).keyup(function(e){
      //Key handling
      var keyCode = e.keyCode;
      if (keyCode === keys.left || keyCode === keys.right) {
        swipeContent(keyCode);
      }
    });

    $(window).resize(function(){
      updateDynamicValues(); //Update dynamic properties on every resize.
      scrollToColumn(currentColumn); //If resize, make column stay at nearest column start
      updateColumnCounter(); //Update column counter
    }).load(function(){
      // Update dynamic variables when every image is loaded,
      // for proper total content length counting
      updateDynamicValues();
      updateColumnCounter();
      hashWatcher();
      //Hiding Please wait overlay
      $("#pleaseWaitContainer .centered").html("Go!");
      setTimeout(function(){
        $("#pleaseWaitContainer").hide("normal");
      }, 200);
    });

    var sectionChooser = $("<select></select>").appendTo(sectionChooserDiv);
    sections.each(function(){
      var that = $(this), 
          id = that.attr("id"),
          h2 = that.find("h2").eq(0);
      if(id && !id.startsWith(idPrefix)){
        that.attr("id", idPrefix+id);
      }
      sectionChooser.append($("<option></option>").val(h2.attr("id")).html(h2.text()));
    });

    initializeFigures();

//    hs.showCredits = 0;
//    hs.padToMinWidth = true;
//    if (hs.registerOverlay) {
//      // The white controlbar overlay
//      hs.registerOverlay({
//        thumbnailId: 'thumb3',
//          overlayId: 'controlbar',
//          position: 'top right',
//          hideOnMouseOut: true
//      });
//      // The simple semitransparent close button overlay
//      hs.registerOverlay({
//        thumbnailId: 'thumb2',
//        html: '<div class="closebutton"	onclick="return hs.close(this)" title="Close"></div>',
//        position: 'top right',
//        fade: 2 // fading the semi-transparent overlay looks bad in IE
//      });
//    }


  });

}(jQuery));