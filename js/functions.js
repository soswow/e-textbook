function getNewSize(limit, containerSize) {
    var count = Math.floor(containerSize / limit.min);
    var delta = (containerSize - (count * limit.min)) / count;
    var newSize = Math.floor(limit.min + delta) - 24;
    if (newSize > limit.max) {
        newSize = limit.max;
    }
    return newSize;
}
function pxValInInt(pxVal) {
    return parseInt(pxVal.substr(0, pxVal.length - 2), 10);
}

var columnsParams = {
    width: 480,
    gap: 80,
    minWidth: 280,
    maxWidth: 600,
    curWidth: 0,
    columnsOnScreen:0
};

var KEYS = {
    LEFT:37,
    RIGHT:39
};

var debugOnOff = false;
function debug() {
    if (console.log && debugOnOff) {
        console.log.apply(console, arguments);
    }
}

function ajustColumnWidths() {
    debug("\n\n STARTING");
    var totalWidth = 0;
    var totalColumns = 0;
    //    var container = $("#container");
    //var contHeight = container.outerHeight();
    var art = $("article:visible").eq(0);
    debug("Article: ", art);

    var parDiv = art.parents(".when_opened").eq(0);
    var contHeight = $("#content_pane").height() - 40; //TODO PAddings sizes to use
    var contWidth = $("#content_pane").width() - 40; //40 - when_opened.padding-left+right
    debug("Container height, width: " + contHeight + " " + contWidth);

    var colMinWidthWGap = columnsParams.minWidth + columnsParams.gap;
    var colCount = Math.floor(contWidth / colMinWidthWGap);//
    columnsParams.columnsOnScreen = colCount;
    debug("Column count on the list:" + colCount,
            "where Math.floor( " + (contWidth / colMinWidthWGap) + ")"); //+columnsParams.gap

    var colWidthWGap = contWidth / colCount;
    debug("Container width / Columns count: " + (contWidth / colCount) + " - col width with gap");
    var colWidth = colWidthWGap - columnsParams.gap;
    columnsParams.curWidth = colWidth;
    debug("Column width: " + colWidth);

    var pads = {top:pxValInInt(parDiv.css("padding-top")), bottom:pxValInInt(parDiv.css("padding-bottom"))};
    debug("Container paddings (t,b): ", pads.top, pads.bottom);

    var secHeight = contHeight - pads.top - pads.bottom;
    debug("Section height: " + secHeight);

    art.find("VIDEO, EMBED, SVG").each(function(){
        var h = $(this).height();
        var w = $(this).width(); //pxValInInt($(this).css("width")) || $(this).attr("width");
        var newH = h * colWidth / w;
        $(this).attr("width", colWidth+"px").css("width",colWidth);
        $(this).attr("height", newH+"px").css("height", newH);
        debug(this.tagName, "old height: "+h, "old width: "+w, "new height: "+newH, "new width: "+colWidth);
    });

    $("section", art)
        .css({
            "-webkit-column-width": colWidth,
            height: secHeight
        })
        .each(function(i) {
        debug("\nSECTION - " + i);
        var sec = $(this);
        var curCol = 1;
        var children = sec.children();
        children.each(function(i) {
            var pos = $(this).position();
            var left = pos.left + art.scrollLeft();
            var h = $(this).height();
            var bottom = pos.top + h;
            debug(this.tagName,
                    "pos.left:" + left,
                    "pos.top:" + pos.top,
                    "curCol: " + curCol,
                    "curCol * colWidth: " + (curCol * colWidth),
                    "h: " + h,
                    "bottom: " + bottom);
            if (left > curCol * colWidth) {
                colsSkiped = Math.floor((left - curCol * colWidth) / colWidth) + 1;
                debug("next",
                        "colsSkiped: " + colsSkiped,
                        "(left - curCol * colWidth) / colWidth: " + (left - curCol * colWidth) / colWidth);
                curCol += colsSkiped;
            }

            if (children.length == i + 1 && bottom > contHeight) {
                debug("Last column with continued child");
                curCol += 1;
            }
        });
        var newW = curCol * colWidth + (curCol - 1) * columnsParams.gap;
        sec.css("width", newW);
        debug("Columns in section: " + curCol, " Section width:" + newW);
        //totalWidth += newW;
        totalColumns += curCol;
    });

    totalWidth = totalColumns * colWidth + (totalColumns - 1) * columnsParams.gap;
    debug("Columns total in article: " + totalColumns, " Article total width: " + totalWidth);
    art.css("width", totalWidth);//.css("height", contHeight);
    art.data("columns", totalColumns);
    art.data("curColumn", 0);
}

$(function() {

    $("section").css("-webkit-column-gap", columnsParams.gap);

    ajustColumnWidths();

    var boxLimits = {
        height:{min:164, max:200},
        width:{min:180, max:250}
    };

    var boxes = $("#topic_blocks LI.topic_blocks_list_item");
    var resizeScrollTimer;
    $(window).resize(function() {
        var newWidth = getNewSize(boxLimits.width, $("#content_pane").width());
        var newHeight = getNewSize(boxLimits.height, $("#content_pane").height());
        boxes.css("width", newWidth + "px");
        boxes.css("height", newHeight + "px");

        clearTimeout(resizeScrollTimer);
        resizeScrollTimer = setTimeout(function() {
            debug("box size " + (newHeight + 20));
            $("#topic_blocks").scroll();
        }, 200);
        /*var w = $("#topic_blocks").width();
         var h = $("#topic_blocks").height();
         w/=2;
         debug(w, h);*/
        ajustColumnWidths();
        //$(".left-block").css("-webkit-column-width", w-40).css("height", h);
        //$(".when_opened").
        //debug($(".when_opened").css("-webkit-column-count"));
    });
    $(window).resize();

    var scrollerTimer;
    var smoothScroll = true;
    /*$("#topic_blocks").scroll(function(e){
     if(!smoothScroll){
     debug("busy");
     return;
     }
     var that = $(this);
     var scroll = that.scrollTop();
     var currBoxHeight = boxes.height() + 20;
     var closestRowStart = Math.round(scroll / currBoxHeight) * currBoxHeight;
     var old_scroll = that.data("old_scroll");
     that.data("old_scroll", scroll);
     var up = old_scroll > scroll;
     var less = scroll>closestRowStart;
     //        debug((up?"up":"down") + (less?" u":" d"));
     var timeoutTime = ((up&&less)||(!up&&!less))?100:700;
     clearTimeout(scrollerTimer);
     scrollerTimer = setTimeout(function(){
     debug("scrolling to closestRowStart " + closestRowStart + " ("+currBoxHeight+")");
     smoothScroll = false;
     that.scrollTo(closestRowStart, 100, {
     onAfter:function(){
     smoothScroll = true;
     debug("Done");
     }
     });
     }, timeoutTime) ;
     });*/

    $("#topic_blocks_list .when_minimized").click(function() {
        debug("Open Window");
        var that = $(this).parents("li").eq(0);
        var div = that.find("div.inner");

        var l = that.offset().left;
        var t = that.offset().top;
        var parent = $("#topic_blocks");
        var scroll = parent.scrollTop();
        div.find(".close").show();
        $("#topic_blocks").css({
            overflow:'hidden'
        });
        that.siblings().css({
            opacity:0
        });
        div.css({
            position:'absolute',
            top:t + scroll,
            left:l,
            width:that.width(),
            height:that.height(),
            zIndex:100
        }).animate({
            top:20 + scroll,
            left:20,
            width:parent.width() - 40,
            height:parent.height() - 20
        }, {
            complete: function() {
                div.addClass("opened").css({
                    bottom:20 - scroll,
                    right:20,
                    height:'auto',
                    width:'auto'
                });
                div.find(".when_opened").css("opacity", 1);
            }
        });
    });

    $("#topic_blocks LI.topic_blocks_list_item IMG.close").click(function() {
        debug("Close Window");
        var that = $(this).parents('DIV.inner');
        $(this).hide();
        $(this).nextAll(".when_opened").css("opacity", 0);
        var parent = that.parents("li").eq(0);
        debug(parent);
        var w = parent.width();
        var h = parent.height();
        var scroll = $("#topic_blocks").scrollTop();
        parent.siblings().css({
            opacity:1
        });
        that.animate({
            top:parent.offset().top + scroll,
            left:parent.offset().left,
            width:w,
            height:h
        }, {
            complete:function() {
                that.removeClass("opened").css({
                    position:'relative',
                    top:0,
                    left:0,
                    width:'100%',
                    height:'100%',
                    zIndex:50
                });
                $("#topic_blocks").css({
                    overflow:'auto'
                });
            }
        });
        debug(that.css("width"));
    });

    function checkArrows(){
        var art = $("article:visible");
        var columnsCount = art.data('columns');
        var curColumn = art.data('curColumn');
        $(".go_right, .go_left").removeClass("end");
        if(curColumn == columnsCount - columnsParams.columnsOnScreen){
            $(".go_right").addClass("end");
        }else if(curColumn == 0){
            $(".go_left").addClass("end");
        }
    }

    function swipeConent(direction, art){
        if(art==undefined){
            art = $("article:visible");
            if(art.length == 0){
                return;
            }
        }
        var columnsCount = art.data('columns');
        var curColumn = art.data('curColumn');
        var dir;
        debug("Current column: "+curColumn);
        if (direction == KEYS.RIGHT && curColumn < columnsCount-columnsParams.columnsOnScreen) {
            curColumn++;
            dir = "RIGHT!";
        } else if (direction == KEYS.LEFT && curColumn > 0) {
            curColumn--;
            dir = "LEFT!";
        }
        var newLeft = -(columnsParams.curWidth+columnsParams.gap) * curColumn;
        art.css("left", newLeft);
        art.data('curColumn', curColumn);
        debug(dir,"Columns count: "+columnsCount,
                "New Column: "+curColumn,
                "New Left pos: "+newLeft);
        checkArrows();
    }
    checkArrows();

    $(window).keyup(function(e) {
        if (e.keyCode == KEYS.LEFT || e.keyCode == KEYS.RIGHT) {
            swipeConent(e.keyCode);
        }
    });

    $(".when_opened").touchwipe({
        wipeLeft: function() {
            swipeConent(KEYS.RIGHT);
        },
        wipeRight: function() {
            swipeConent(KEYS.LEFT);
        }
    });

    $(".go_left, .go_right").click(function(){
        swipeConent($(this).hasClass("go_left")?KEYS.LEFT:KEYS.RIGHT);
    });
});