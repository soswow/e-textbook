$(document).ready(function(){

$('math [class="math-edit"]').live("click",function(){
 //var toolbar = '<div id="toolbar"><button id="frac"><math><mrow><mfrac><mrow><mi>▮</mi></mrow><mrow><mi>▯</mi></mrow></mfrac></mrow></math></button><button id="sqrt"><math><mrow><msqrt><mrow><mi>▮</mi></mrow></msqrt></mrow></math></button><button id="subsup"><math><mrow><msubsup><mi>▮</mi><mi>▯</mi><mi>▯</mi></msubsup></mrow></math></button><button id="sub"><math><mrow><msub><mi>▮</mi><mi>▯</mi></msub></mrow></math></button><button id="sup"><math><mrow><msup><mi>▮</mi><mi>▯</mi></msup></mrow></math></button><button id="next"><math><mi>▯</mi><mi>▮</mi></math></button><button id="prev"><math><mi>▮</mi><mi>▯</mi></math></button></div>';
  $("#select").removeAttr("id");
 // $("#toolbar").remove();
  $(this).attr("id","select");
  //$("#select").parents("math").before(toolbar);
});

$(document).keypress(function(event){
// left

if($("#select").parents("math").is('[class="mode-mathEq"]')){

  if (event.keyCode == '37' && event.ctrlKey) { // ctrl + left arrow
      var id = $("#select").parents("math").attr('id');
      var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
      var frac = '<mi class="edit">&#x25a1;</mi>'+selected; // create a frac template // &#x25a1; is &square;
      $("#select").replaceWith(frac); // replace selected by frac
      var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
      $("#"+id).replaceWith(math); // refresh the whole equation
      $("#select").removeAttr("id").prev().attr("id","select");
      event.preventDefault();
  } else if (event.keyCode == '37') { // left arrow
    event.preventDefault();
    if($("#select").is("math")) {
      $("#select").removeAttr("id").find("mi,mn,mo,mtext").eq(0).attr("id","select");
      selectedMap();
    } else if($("#select").is(":first-child")) {
        if ($("#select").closest("math :not(:first-child)").prev().is("mi,mn,mo,mtext")) {
          $("#select").removeAttr("id").closest("math :not(:first-child)").prev().attr("id","select");
          selectedMap();
        } else if($("#select").closest("math :not(:first-child)").prev().has("mi,mn,mo,mtext")) {
          $("#select").removeAttr("id").closest("math :not(:first-child)").prev().find("mi,mn,mo,mtext").eq(-1).attr("id","select");
          selectedMap();
        } else {
          alert("appi!"); // THINK!
        }
    } else if($("#select").prev().is("mi,mn,mo,mtext")) {
      $("#select").removeAttr("id").prev().attr("id","select"); 
      selectedMap(); 
    } else if($("#select").prev().has("mi,mn,mo,mtext")) {
      $("#select").removeAttr("id").prev().find("mi,mn,mo,mtext").eq(-1).attr("id","select");
      selectedMap();    
    } else {
      alert("appi!"); // THINK!   
    }

// right arrow
  } else if (event.keyCode == '39' && event.ctrlKey) { // ctrl + right arrow
      var id = $("#select").parents("math").attr('id');
      var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
      var frac = selected+'<mi class="edit">&#x25a1;</mi>'; // create a frac template // &#x25a1; is &square;
      $("#select").replaceWith(frac); // replace selected by frac
      var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
      $("#"+id).replaceWith(math); // refresh the whole equation
      $("#select").removeAttr("id").next().attr("id","select");
      event.preventDefault();
  } else if (event.keyCode == '39') { // right arrow
    event.preventDefault();
    if($("#select").is("math")) {
      $("#select").removeAttr("id").find("mi,mn,mo,mtext").eq(-1).attr("id","select");
      selectedMap();
    } else if($("#select").is(":last-child")) {
        if ($("#select").closest("math :not(:last-child)").next().is("mi,mn,mo,mtext")) {
          $("#select").removeAttr("id").closest("math :not(:last-child)").next().attr("id","select");
          selectedMap();
        } else if($("#select").closest("math :not(:last-child)").next().has("mi,mn,mo,mtext")) {
          $("#select").removeAttr("id").closest("math :not(:last-child)").next().find("mi,mn,mo,mtext").eq(0).attr("id","select");
          selectedMap();
        }  else {
          alert("appi!"); // THINK!
        }
    } else if($("#select").next().is("mi,mn,mo,mtext")) {
      $("#select").removeAttr("id").next().attr("id","select"); 
      selectedMap(); 
    } else if($("#select").next().has("mi,mn,mo,mtext")) {
      $("#select").removeAttr("id").next().find("mi,mn,mo,mtext").eq(0).attr("id","select");
      selectedMap();     
    } else {
      alert("appi!"); // THINK!   
    }
  } else if (event.keyCode == '38') { // up arrow
    event.preventDefault();
    if($("#select").is("math")) {
      $("#select").removeAttr("id").children(":first-child").attr("id","select");
      selectedMap();
    } else {
      $("#select").removeAttr("id").parent().attr("id","select");
      selectedMap();
    }
  } else if (event.keyCode == '40') { // down arrow
    event.preventDefault();
    if($("#select").children().size() > 0) {
      $("#select").removeAttr("id").children(":first-child").attr("id","select");
      selectedMap();
    }
  } 
// primitive inserting 
  else if (event.keyCode == '46') { // delete
    if ($("#select[class='math-edit']").text() == "□") {
      $("#select").remove(); //what if it is in sub? what to do with parent attribute?   
    } else if ($("#select").is("mfrac,msubsup,msub,msup,msqrt")) {
      $("#select").remove();
    } else {
      $("#select").text("□");
    }
  } else if (event.keyCode == '8') { // backspace
    if ($("#select[class='math-edit']").text().length == '1') {
      $("#select").text("□");   
    } else {
      var text = $("#select").text().replace(/(\s+)?.$/, "");
      $("#select").text(text);
    }
  } else if (event.keyCode == '13' ) { // enter
    event.preventDefault();
      var text = "$" + $("#select").text() + "$";
      var temp = $(document.createElement("div")).css('display','none').text(text).appendTo($("body")); // create temporary element for converter
      // process LaTex code
      AMinitSymbols();
      AMprocessNodeR(temp.get(0), false);
      // get MathML code
      $("#parent").removeAttr("id");
      var code = '<mrow id="parent">'+temp.html().replace(/<math([^>]+)>/,"").replace("</math>","").replace(/<(\/)?mstyle>/g, "").replace(/<\/?mspace[^>]*>/gi, "").replace(/<mtable([^>]+)>/, "<mtable>") + '</mrow>';
      //temp.remove();
      var id = $("#select").parents("math").attr('id');
      $("#select").replaceWith(code); // replace latex with mathml code
      var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
      $("#"+id).replaceWith(math); // refresh the whole equation
      $("#parent").find("mi,mn,mo,mtext").eq(0).attr("id","select");
      $("#select").saveEq();
  } else if (event.which == '102' && event.ctrlKey){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var frac = '<mfrac><mrow>'+selected+'</mrow><mrow><mi class="edit">&#x25a1;</mi></mrow></mfrac>'; // create a frac template // &#x25a1; is &square;
         $("#select").replaceWith(frac); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
  } else if (event.which == '115' && event.ctrlKey){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var sqrt = '<msqrt>'+selected+'</msqrt>'; // create a sqrt template
         $("#select").replaceWith(sqrt); // replace selected by sqrt
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
  } else if (event.which == '109' && event.ctrlKey){ 
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var subsup = '<msubsup><mrow>'+selected+'</mrow><mrow><mi class="edit">&#x25a1;</mi></mrow><mrow><mi class="edit">&#x25a1;</mi></mrow></msubsup>'; // create a msubsup template // &#x25a1; is &square;
         $("#select").replaceWith(subsup); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
  } else if (event.which == '98' && event.ctrlKey){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var subsup = '<msub><mrow>'+selected+'</mrow><mrow class="edit"><mi>&#x25a1;</mi></mrow></msub>'; // create a msub template // &#x25a1; is &square;
         $("#select").replaceWith(subsup); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
  } else if (event.which == '112' && event.ctrlKey){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var subsup = '<msup><mrow>'+selected+'</mrow><mrow><mi class="edit">&#x25a1;</mi></mrow></msup>'; // create a msup template // &#x25a1; is &square;
         $("#select").replaceWith(subsup); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
  } else {
    if ($("#select[class='math-edit']").text() == "□") {
      $("#select").text(String.fromCharCode(event.charCode));      
    } else if($("#select[class='math-edit']")){
      $("#select").append(String.fromCharCode(event.charCode));
    } else if($("#select[class!='math-edit']")){} else {}
  }
} // END of the BIG SECTION DEVOTED TO MathEq

});

//buttons

// new construction insertion

     $("#next").live("click",function(event){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var frac = selected+'<mi class="edit">&#x25a1;</mi>'; // create a frac template // &#x25a1; is &square;
         $("#select").replaceWith(frac); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
         $("#select").removeAttr("id").next().attr("id","select");
       event.preventDefault();
     });

     $("#prev").live("click",function(event){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var frac = '<mi class="edit">&#x25a1;</mi>'+selected; // create a frac template // &#x25a1; is &square;
         $("#select").replaceWith(frac); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
         $("#select").removeAttr("id").prev().attr("id","select");
       event.preventDefault();
     });

     $("#frac").live("click",function(event){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var frac = '<mfrac><mrow>'+selected+'</mrow><mrow><mi class="edit">&#x25a1;</mi></mrow></mfrac>'; // create a frac template // &#x25a1; is &square;
         $("#select").replaceWith(frac); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
     });

    $("#sqrt").live("click",function(event){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var sqrt = '<msqrt>'+selected+'</msqrt>'; // create a sqrt template
         $("#select").replaceWith(sqrt); // replace selected by sqrt
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
     });

     $("#subsup").live("click",function(event){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var subsup = '<msubsup><mrow>'+selected+'</mrow><mrow><mi class="edit">&#x25a1;</mi></mrow><mrow><mi class="edit">&#x25a1;</mi></mrow></msubsup>'; // create a msubsup template // &#x25a1; is &square;
         $("#select").replaceWith(subsup); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
     });

     $("#sub").live("click",function(event){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var subsup = '<msub><mrow>'+selected+'</mrow><mrow class="edit"><mi>&#x25a1;</mi></mrow></msub>'; // create a msub template // &#x25a1; is &square;
         $("#select").replaceWith(subsup); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
     });

     $("#sup").live("click",function(event){
         var id = $("#select").parents("math").attr('id');
         var selected = $("<mrow>").append($("#select").clone()).html(); // create a clone of #select (outerHTML)
         var subsup = '<msup><mrow>'+selected+'</mrow><mrow><mi class="edit">&#x25a1;</mi></mrow></msup>'; // create a msup template // &#x25a1; is &square;
         $("#select").replaceWith(subsup); // replace selected by frac
         var math = $("<div>").append($("#"+id).clone()).html(); // create a clone of #select math parent
         $("#"+id).replaceWith(math); // refresh the whole equation
       event.preventDefault();
     });

});
