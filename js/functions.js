jQuery.fn.css3 = function(property, value){
    return $(this).css("-webkit-"+property, value).css("-moz-"+property, value);
};

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
    gap: 40,
    minWidth: 280,
    maxWidth: 600,
    curWidth: 0,
    columnsOnScreen:0
};

var KEYS = {
    LEFT:37,
    RIGHT:39
};

String.prototype.endsWith = function(end){
    return this.length - this.lastIndexOf(end) == end.length;
};

function join(arr, sep){
    var res = "";
    for (var i=0;i<arr.length;i++){
        res += arr[i]+(i==arr.length-1?"":sep || " ");
    }
    return res;
}

jQuery.fn.fitTo = function(container, lessOnly, minusHeight){
    var savedInfo = this.data("fitToInfo");

    var flashInside = this.find("embed");
    var media_object = flashInside.length > 0?flashInside:this;

    var tw = media_object.width() || parseInt(media_object.attr("width"));
    var th = media_object.height() || parseInt(media_object.attr("height"));
    
    if(!savedInfo && arguments.length > 0){
        this.data("fitToInfo", {
            container:container,
            lessOnly:lessOnly,
            minusHeight:minusHeight,
            tw:tw,
            th:th
        });
    }else if (savedInfo && arguments.length == 0){
        container = savedInfo.container;
        lessOnly = savedInfo.lessOnly;
        minusHeight = savedInfo.minusHeight;
        tw = savedInfo.tw;
        th = savedInfo.th;
    }

    var cw = container.width();
    var ch = container.height() - (minusHeight || 0);

    var horizontal = tw > th && cw > ch ;
    debug("cw,ch,tw,th\n",cw,ch,tw,th,"\nhorizontal,minusHeight, lessOnly\n",
            horizontal,minusHeight, lessOnly);
    var w,h;
    if(horizontal){
        h = lessOnly?(th>ch?ch:th):ch;
        debug("h=",h);
        w = h  * tw / th;
        debug("w=",w);
        debug("w/h=",w/h);
    }
    
    if(!horizontal || w > cw){
        w = lessOnly?(tw>cw?cw:tw):cw;
        debug("w=",w);
        h = w * th / tw;
        debug("h=",h);
        debug("w/h=",w/h);
    }

    var newWHMap = {
        width:w,
        height:h
    };
    debug(w,h);
    media_object.attr(newWHMap).css(newWHMap);
};

var isiPad = navigator.userAgent.match(/iPad/i) != null;
var debugOnOff = true;

function debug() {
    if (console.log && debugOnOff) {
        if(arguments.length > 1){
            if(isiPad){
                console.log(join(arguments));
            }else{
                console.log.apply(console, arguments);
            }
        }else{
            console.log(arguments[0]);
        }
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
    var main_content = $("#content_pane");
    var contHeight = main_content.height()-40; //TODO PAddings sizes to use
    var contWidth = main_content.width()-40; //4; //TODO PAddings sizes to use

//    var content_pane = $("#content_pane");
//    var main_content = parDiv.find(".main_content");
//    var contHeight = content_pane.height() - 40; //TODO PAddings sizes to use

//    debug("Visible popup width: " + pop_up_content_width);
//    var main_content_width = main_content.width() - pop_up_content_width;
//    var contWidth = main_content_width+30; //40 - when_opened.padding-left+right
//
//    main_content.width(main_content_width);

    var pop_up_content_width = $(".when_opened.show_popup .popup_content").width() || 0;
    if(pop_up_content_width){
        pop_up_content_width+=43;
    }
    contWidth -= pop_up_content_width;

    debug("Container height, width: " + contHeight + " " + contWidth);

    var colMinWidthWGap = columnsParams.maxWidth + columnsParams.gap;
    var colCount = Math.ceil(contWidth / colMinWidthWGap);//
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

    $("section", art)
        .css3("column-width", colWidth)
        .css({
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

    $("section").css3("column-gap", columnsParams.gap);

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
        
        var beforeState = isiPad?{
            position:'absolute',
            zIndex:100,
            top:20 + scroll,
            left:20,
            width:parent.width() - 40,
            height:parent.height() - 20
        }:{
            position:'absolute',
            top:t + scroll,
            left:l,
            width:that.width(),
            height:that.height()
        };
        var animateAfter = isiPad?{}:{
            top:20 + scroll,
            left:20,
            width:parent.width() - 40,
            height:parent.height() - 20
        };

        div.css(beforeState).animate(animateAfter, {
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
        var animateTo = isiPad?{}:{
            top:parent.offset().top + scroll,
            left:parent.offset().left,
            width:w,
            height:h
        };

        that.animate(animateTo, {
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

    $(".float-thumbnail").each(function(){
        var that = $(this);
        var media = that.find(".popup");
        var isVideo = that.is(".video");
        var isFlash = that.is(".flash");
        if(!isVideo && !isFlash){
            media.after(media.clone().removeClass("popup").css({
                width:250,
                height:'auto'
            }));
        }

        var elems = (function(){
            var parent = that.parents(".when_opened").eq(0);
            var superParent = parent.parents(".inner").eq(0);
            var contentPopUp = parent.find(".popup_content");
            return {
                buttons: {
                    contentClose: superParent.find(".close"),
                    popUpClose: superParent.find(".back_to_article")
                },
                parent: parent,
                content: {
                    popup: contentPopUp,
                    main: parent.find(".main_content"),
                    media: contentPopUp.find(".media")
                }
            };
        })();

        var figureTitleText = that.find(".big").html();
        var splitter = elems.parent.find(".popup_splitter");
        that.click(function(){
            var opened = elems.parent.is(".show_popup");
            if(!opened){
                elems.parent.addClass("show_popup");
            }
            var figureTitleSpan = $("<div class='media_title'>"+figureTitleText+"</div>")
            elems.content.media.empty().append(figureTitleSpan);

            var open_sidepane = function(){
                var main_content_width = elems.content.main.width();
                debug("initial width", main_content_width);
                var popUpLeft = main_content_width / 2;
                var media_box = elems.content.media.find(".media_box");
                elems.content.popup.css("left", main_content_width).animate({left: popUpLeft}, {
                    duration: 500,
                    step: function(now){
                        media_box.fitTo();
                        elems.content.main.css("width", now - 40);
                        debug(elems.content.main.css("width"));
                        splitter.css("left", now-splitter.width() / 2);
                        ajustColumnWidths();
                    },
                    complete: function(){
                        //
                    }
                });
            }

            if(isVideo){
                $.get(media.attr("href"), function(resp){
                    var video = $(resp).addClass("media_box");
                    video.fitTo(elems.content.media, false, figureTitleSpan.height() + 12);
                    elems.content.media.prepend(video);
                    if(!opened){
                        open_sidepane();
                    }
                });
            }else{
                var mediaClone = media.clone().addClass("media_box");
                var tagName = mediaClone[0].tagName.toLowerCase();
                var couldBeBigger = (tagName == 'img' && mediaClone.attr("src").endsWith(".svg")) ||
                        isFlash || isVideo;
                mediaClone.fitTo(elems.content.media, !couldBeBigger, figureTitleSpan.height() + 12);
                elems.content.media.prepend(mediaClone);
                if(!opened){
                    open_sidepane();
                }
            }
        });
    });

    $(".back_to_article").click(function(){
        var that = $(this);
        var parent = that.parents(".inner");
        parent.find(".when_opened").removeClass("show_popup");
        parent.find(".close").show();
        that.hide();
        parent.find(".popup_content").find(".header h1, .text, .media, .media_title").empty();
    });

    $(".popup_splitter").draggable({ axis: 'x', drag: function(event, ui){
        var pos = ui.position.left;
        var parent = $(this).parents(".when_opened").eq(0);
        var parent_width = parent.width();
//        if (pos > 400 && pos < parent_width - 300){
        var width = $(this).width();
        parent.find(".main_content").css("width", pos-20);
        parent.find(".popup_content").css("left", pos+width/2-2);
        parent.find(".media_box").fitTo();
        ajustColumnWidths();
//        }
    }});

    $(".popup_splitter .close").click(function(){
        var parent = $(this).parents(".when_opened").eq(0);
        var main_content = parent.find(".main_content");
        var media_box = parent.find(".media_box");
        var splitter = $(this).parents(".popup_splitter");
        parent.find(".popup_content").animate({left:parent.width()+40}, {
            duration:500,
            step: function(now){
                media_box.fitTo();
                main_content.css("width", now - 40);
                splitter.css("left", now-splitter.width() / 2);
                ajustColumnWidths();
            },
            complete: function(){
                parent.removeClass("show_popup");
            }
        });
    });
});