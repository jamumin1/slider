
/**
 * InsSlider
 * Developed by Zbigniew Jodynis
 * 
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
var $ = jQuery.noConflict();
 

(function($)
 
{
  
function Plugin_InsSlider(element,options){
};


Plugin_InsSlider.prototype = {
  name : 'zbigniew jodynis',
  defaults  : {
    x : 7,
    y: 5,
    animating : false,
    current : 2,
    effect : 'sideEffect',
    color: 'black',
    tilesTime : 1500,
    listTime : 1111,
    navigationWidth: '2.5em',
    navigationHeight: '2.5em',
    navigation : true,
    borderWidth: 4,
    borderColor : 'grey',
    mouseMove: true,
    scrollChange : true
       
  },
  settings :{
        x:0,
        endX:0,
        index : 0,
        step: 0,
        dir:0,
        left:0,
        offsetX : 0,
        direction:null
  },

  init : function (element,options){
    this.element = element
    this.options = $.extend({},this.defaults,options)

    this.$el = $(this.element)
    this.$elChildrens = this.$el.children('li')
    this.$elWidth = $(this.element).parent().width()
    this.$elHeight = $(this.element).parent().height()
    this.$elParent = $(this.element).parent()

    this.initTiles()
    this.changeIndex()
    this.klik()
    this.sizE()
   
    
  },  

  changeIndex : function (){

    var containersArray = [];
    this.$elChildrens.each(function(i){
      containersArray.push($(this))
    });

    var containersArray2 = containersArray.reverse();
    for (var i=0; i < containersArray2.length; i++){
      containersArray2[i].css('z-index',i+1)
    }
  
  },

  initTiles : function (){
  
    this.$elChildrens.addClass('insContainer');

    if(this.options.effect == 'upLeft' || this.options.effect == 'upRight' || this.options.effect == 'downLeft' || this.options.effect == 'downRight' || this.options.effect == 'random'){
      this.$el.addClass('insLista-tiles'); 
      this.$elChildrens.css({
          'position': 'absolute',
          'display': 'block'
      });
      
      this.$elChildrens.eq(0).addClass('insActive')
    }
    else if (this.options.effect == 'sideEffect'){
      this.$el.addClass('insLista-slider');
      this.$elChildrens.css({
         'display': 'block',
         'position': 'relative',
         'float':'left'
        });
      var last =  this.$elChildrens.slice(-2).clone(),
          first  = $('.insContainer:lt(2)').clone();

      this.$el.prepend(last);
      this.$el.append(first);
    
      this.$elChildrens = $('.insContainer');

      this.$el.css({'width':(this.$elWidth*this.$elChildrens.length)+'px',
                    'left': -this.$elWidth *2 +'px'});

      if(that.options.mouseMove){
         this.side_Slider();
      }
     
    };
      
    if (this.options.navigation){
      this.$elParent.append('<span id="prevSliderBtn"></span>','<span id="nextSliderBtn"></span>');
      $('#prevSliderBtn, #nextSliderBtn').css({'background-color':this.options.color,
                      'widht': this.options.navigationWidth,
                      'height': this.options.navigationHeight,
                      'border': this.options.borderWidth+'px '+ this.options.borderColor+' solid',
                      'display':'block'});
    };
    if(this.options.scrollChange){
       this.scroll_Change();
    };
  },

  sizE : function (){
   
    this.$elWidth =this.$elParent.width();
    this.$elHeight =this.$elParent.height();


    if(this.options.effect == 'sideEffect') {
         this.$elChildrens.css({'width': Math.floor(this.$elWidth), 
                                'height': this.$elHeight});

        this.$el.css({'width':(this.$elWidth*this.$elChildrens.length)+'px',
                      'left': -this.$elWidth *this.options.current +'px'});
    }
    else {
        this.$elChildrens.css({'width' : '100%',
                              'height' : '100%'});
        this.$el.css({'height': Math.floor(this.$elHeight/ this.options.y)*this.options.y+'px',
                      'width': Math.floor(this.$elWidth/ this.options.x)*this.options.x+'px'});
    };
},

scroll_Change : function(){

    var that = this;
    this.$el.on('mousewheel DOMMouseScroll',function (e){
      if(e.originalEvent.wheelDelta /120 > 0 || e.originalEvent.detail > 0){
        if(that.options.animating) return;
        that.options.animating= true;
        
        that.options.current ++;
        that.settings.direction  = (-that.settings.endX*0.1 -that.$elWidth/2);
        that.effects();
      }
      else{
        if(that.options.animating) return;
        that.options.animating= true;

        that.options.current --;
        that.settings.direction  = (-that.settings.endX*0.1 +that.$elWidth/2);
        that.effects();

      };
    });
  },

  klik : function (){
    var that= this;

    $('#nextSliderBtn').on('click touchstart',function(e){
      e.stopPropagation();
      e.preventDefault();

      if(that.options.animating) return;

      that.options.animating = true;

      that.options.current++;

      that.settings.direction  = -that.settings.endX*0.1 -that.$elWidth/2
      that.effects();
      
      });

      $('#prevSliderBtn').on('click touchstart',function(e){
      e.stopPropagation();
      e.preventDefault();

      if(that.options.animating) return;

      that.options.animating = true;
     
      that.options.current--;
      
      that.settings.direction  = -that.settings.endX*0.1 +that.$elWidth/2
      that.effects();
     
    });

  },

  effects : function (){
    var effAll = ['upLeft','upRight','downLeft','downRight'];
    var eff = this.options.effect; 

    
    if(eff !== 'sideEffect'){

       $("img").hide();

      var currentContainer = ($('.insActive') ? $('.insActive') : $('.insContainer:first'));
      var next = (this.$elChildrens.eq(this.options.current-2)); 
     
      currentContainer.removeClass('insActive');
      currentContainer.css('z-index','100');
      next.addClass("insActive");
      next.css('z-index','50');
     

      next.find('img').show();

      if(this.options.current > this.$elChildrens.length){
        this.options.current -= this.$elChildrens.length;
      }
      else if (this.options.current < 0){
        this.options.current += this.$elChildrens.length;
      }
    }



    switch (eff){
      case 'random' : 
         this.randoM(currentContainer)
        break;

      case 'upLeft' :
        this.uLeff(currentContainer)
        break;

      case 'upRight' :
        this.uPeff(currentContainer);
        break;

      case 'downLeft' :
        this.dLeff(currentContainer);
        break;

      case 'downRight' :
        this.dReff(currentContainer);
        break;

      case 'sideEffect' :
        this.move();
        break;

    }
  },
 randoM : function (kontenerElem){
    var result = this.options.x * this.options.y;
    for(var i=1; i<result; i++){
        rand = Math.floor((Math.random()*(result)+ 1))
          kontenerElem.append('<div class="insTile" id="'+rand+'"></div>');
    };
 
    this.animateTiles(kontenerElem);
  },
  uLeff : function (kontenerElem){
      for(var i=1; i<this.options.y+1; i++){
        for(var j=1; j<this.options.x+1; j++){
          kontenerElem.append('<div class="insTile" id="'+i*j+'"></div>');
        };
    };
    this.animateTiles(kontenerElem);
  },

  uPeff : function ( kontenerElem){
    for(var i=1; i<this.options.y+1; i++){
      for(var j=this.options.x; j>0; j--){
          kontenerElem.append('<div class="insTile" id="'+i*j+'"></div>');
        };
    };
    this.animateTiles(kontenerElem);
  },

  dLeff : function (kontenerElem) {
      for(var i=this.options.y; i>0; i--){
        for(var j=1; j<this.options.x+1; j++){
          kontenerElem.append('<div class="insTile" id="'+i*j+'"></div>');  
       };
    };
    this.animateTiles(kontenerElem);
  },
  dReff : function (kontenerElem) {
      for(var i=this.options.y; i>0; i--){
        for(var j=this.options.x; j>0; j--){
          kontenerElem.append('<div class="insTile" id="'+i*j+'"></div>');
        };
    };
    this.animateTiles(kontenerElem);
  },
  animateTiles : function (elem){

    this.elem = elem;
    var that = this;
    var src = elem.find('img').attr('src');

    elem.find('.insTile').css({
      'width':  Math.floor(this.$elWidth / this.options.x)+'px', 
      'height': Math.floor(this.$elHeight / this.options.y) + 'px',
      'opacity': '1',
      'float': 'left',
      'overflow': 'hidden',
      'background-image': 'url("'+src+'")',
      'background-repeat': 'no-repeat',
      'transform': 'scale(1)',
      'background-size': 100 * this.options.x + '%' + 100 * this.options.y +'%',
      });

    elem.find('.insTile').each(function(){
        var pos = $(this).position();
        $(this).css({ 'backgroundPosition': -pos.left +'px '+ -pos.top +'px'});
    });

    elem.find('.insTile').each(function(i){
      var pos = $(this).position();

      $(this).css({
        'opacity': '0',
        'transition': '400ms',
        'transform': 'scale(0.9)',
        '-webkit-filter': 'blur(15px)',
        'transition-delay': (parseInt($(this).attr('id')) )*(that.options.tilesTime*0.03) + 'ms'});
      });
    setTimeout(function(){
      that.options.animating = false;
      elem.find('.insTile').remove();
      
    }, (that.options.tilesTime*0.03)*(that.options.x * that.options.y));
  },
   
  side_Slider : function(){
  
    var that = this;
    var currentX =0;

    this.$elChildrens.on(' mousedown touchstart', function(e){
      if(that.options.animating) return;
      e.preventDefault();
    
      currentX = e.originalEvent.touches ?  e.originalEvent.touches[0].pageX : e.pageX;
     
      that.settings.index = $(this).index();
      that.settings.x = currentX;

        $(document).on('mousemove touchmove',function(e){
           e.preventDefault();
    
          currentX = e.originalEvent.touches ?  e.originalEvent.touches[0].pageX : e.pageX;
   
          that.settings.endX = that.settings.x - currentX;
          that.settings.dir = that.settings.endX > 0 ? +1 : -1;
            
          var endxSlowly = (-that.$elWidth *that.options.current) - that.settings.endX/5;

          that.$el.css({'left':endxSlowly});
          if(that.settings.dir == -1){
            that.$elChildrens.eq(that.settings.index + (that.settings.dir)).css({
              'z-index' : -5,
              'left' : -that.settings.endX*0.1 +that.$elWidth/2}) ; 
              that.settings.direction  = -that.settings.endX*0.1 +that.$elWidth/2
          }
          else{ 
            that.$elChildrens.eq(that.settings.index + (that.settings.dir)).css({
              'z-index' : -5,
              'left' : -that.settings.endX*0.1 -that.$elWidth/2});
              that.settings.direction  = -that.settings.endX*0.1 -that.$elWidth/2
          }
      
        });

    });

    $(document).on('mouseup touchend',function(e){
      $(document).off('mousemove touchmove');

      e.stopPropagation();
      e.preventDefault();
            
      if(that.settings.endX < -1){
        that.options.current --;
        that.effects();
      }
      else if (that.settings.endX > 1){
        that.options.current++;
        that.effects();
      }
      that.settings.endX = 0;
    }); 

  },

  move : function  (liczba){
    var that = this
        this.$elChildrens.eq(this.options.current).css({'transition':'0','left': that.settings.direction  + 'px',
                                                    'z-index' : -5})
          this.$elChildrens.eq(this.options.current).animate({left :(0 )},that.options.listTime,function(){
          that.$elChildrens.css({'transition':'0','left':'0px'})
        })

        this.$el.animate({
            left: -this.$elWidth * that.options.current
        },that.options.listTime,function(){               
            that.options.endX = 0;
            if(that.options.current <2){
                that.options.current +=that.$elChildrens.length-4
                that.$el.css({'transition':'0','left': -that.$elWidth * that.options.current+'px'})
            }
            else if (that.options.current > that.$elChildrens.length-4) {

              that.options.current-=that.$elChildrens.length-4

              that.$el.css({'transition':'0','left': -that.$elWidth *  that.options.current+'px'})
            }
        })
        setTimeout(function(){
            that.options.animating = false;
            that.$elChildrens.siblings().css('z-index',1);
        },that.options.listTime);

   }
}   

$.fn.RwdJquerySlider = function(options){
  return this.each(function(){
    var PluginInsSlider = new Plugin_InsSlider(this,options)
    PluginInsSlider.init(this,options)

      $(window).resize(function() {
      PluginInsSlider.sizE()
});
  })
}


})(jQuery);

