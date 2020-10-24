$(function(){
  $.scrollify({
    section: ".panel",
    scrollSpeed: 2000,
    offset : 0,
    scrollbars: true,

    before: function(section){
      if(section===1){
        $(".section2ColumnLeft").addClass("fadeInLeftBig");
        $(".section2ColumnRight").addClass("fadeInRightBig");
      

      }

    }
  });

});