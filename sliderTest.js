var $ = jQuery.noConflict();
 
 
(function($)

{
  console.log($('.kontener').eq(0).width())

function Plugin(element,options){
}


Plugin.prototype = {
  name : 'put your name here',
  defaults  : {
    x : 7,
    y: 5,
    dodatnik : 2,
    animating : false,
    current : 2,
    delays : 300,
    hoverPause : true,
    effect : 'sliderBoczny',
    auto : false,
    color: '',
    time : 100
        
  },
  settings :{
        x:0,
        endX:0,
        index : 0,
        step: 0,
        dir:0,
        left:0,
        offsetX : 0,
          
  },

  init : function (element,options){
    this.element = element
    this.options = $.extend({},this.defaults,options)

    this.$el = $(this.element)
    this.$elChildrens = $('.kontener')
    this.$elWidth = $(this.element).parent().width()
    this.$elHeight = $(this.element).parent().height()
    this.tiW = Math.floor($('.kontener').width() / this.options.x);
    this.tiH = Math.floor($('.kontener').height() / this.options.y);


    this.initTiles()
    this.changeIndex()
    this.klik()
  
    
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

    if(this.options.effect == 'upLeft' || this.options.effect == 'upRight' || this.options.effect == 'downLeft' || this.options.effect == 'downRight' || this.options.effect == ''){
      this.$el.parent().css({'height': Math.floor(this.$elHeight/ this.options.y)*this.options.y+'px',
                         'width': Math.floor(this.$elWidth/ this.options.x)*this.options.x+'px'});
  
      this.$el.addClass('lista-tiles'); 
        $('.kontener').css({
          'position': 'absolute',
          'display': 'block',
          'width': '100%',
          'height':'100%'
      })
    }

    else if (this.options.effect == 'sliderBoczny'){

      this.$el.addClass('lista-slider');
      this.$elChildrens.css({
         'width': Math.floor($('#zbiornik').width())+'px', 
         'height': $('#zbiornik').height() + 'px',
         'display': 'block',
         'position': 'relative',
         'float':'left'
        });
      var last =  this.$elChildrens.slice(-2).clone()
      var first  = $('.kontener:lt(2)').clone()
         

      $('#lista').prepend(last)
      $('#lista').append(first)
    
      this.$elChildrens = $('.kontener')
      this.$el.css({'width':($('#zbiornik').width()*$('.kontener').length)+'px',
                    'left': -this.$elWidth *2 +'px'})

      this.ser()
    }

    if(this.options.auto == true){
      setInterval(function(){
        pushingTiles();
      },this.options.time);
    }

  },

  klik : function (){
    var that= this;

    $('#next').on('mouseup touchend',function(){
      //if(that.options.animating) return;

      that.options.animating = true;

      if(that.options.effect == 'sliderBoczny' ){
        that.navigateRight()
      }
      else {
        that.options.current ++
        that.pushingTiles();
      }
      });

      $('#prev').on('mouseup touchend',function(){
      //if(that.options.animating) return;

      that.options.animating = true;
      if(that.options.effect == 'sliderBoczny' ){
        that.navigateLeft()
      }
      else {
        that.options.current --
        that.pushingTiles();
      }
    });

  },

  effects : function (el){

    var effAll = ['upLeft','upRight','downLeft','downRight'];
    var eff = this.options.effect; 

    this.el = el
    switch (eff){
      case 'random' : 
        eff = effAll[Math.floor(Math.random()*(effAll.length))];
        break;

      case 'upLeft' :
        this.uLeff(el)
        break;

      case 'upRight' :
        this.uPeff(el);
        break;

      case 'downLeft' :
        this.dLeff(el);
        break;

      case 'downRight' :
        this.dReff(el);
        break;

      case 'sliderBoczny' :
        this.ser(el);
        break;

    }
  },

  uLeff : function (kontenerElem){
      for(var i=1; i<this.options.y+1; i++){
        for(var j=1; j<this.options.x+1; j++){
          kontenerElem.append('<div class="tile" id="'+i*j+'"></div>');
        };
    };
    this.animateTiles(kontenerElem)
  },

  uPeff : function ( kontenerElem){
    for(var i=1; i<this.options.y+1; i++){
      for(var j=this.options.x; j>0; j--){
          kontenerElem.append('<div class="tile" id="'+i*j+'"></div>');
        };
    };
    this.animateTiles(kontenerElem)
  },

  dLeff : function (kontenerElem) {
      for(var i=this.options.y; i>0; i--){
        for(var j=1; j<this.options.x+1; j++){
          kontenerElem.append('<div class="tile" id="'+i*j+'"></div>');  
       };
    };
    this.animateTiles(kontenerElem)
  },
  dReff : function (kontenerElem) {
      for(var i=this.options.y; i>0; i--){
        for(var j=this.options.x; j>0; j--){
          kontenerElem.append('<div class="tile" id="'+i*j+'"></div>');
        };
    };
    this.animateTiles(kontenerElem)
  },
  animateTiles : function (elem){
    this.elem = elem
    var that = this
    var src = elem.find('img').attr('src');

    elem.find('.tile').css({
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

    elem.find('.tile').each(function(){
        var pos = $(this).position();
        $(this).css({ 'backgroundPosition': -pos.left +'px '+ -pos.top +'px'});
    })

    elem.find('.tile').each(function(i){
        var pos = $(this).position();

        $(this).css({'opacity': '0',
          'transition': '400ms',
          'transform': 'scale(0.9)',
          '-webkit-filter': 'blur(15px)',
          'transition-delay': (parseInt($(this).attr('id')) )/35 + 's'});
      })
    setTimeout(function(){
      that.options.animating = false;
      elem.find('.tile').remove()
    }, 1000)
  },
  pushingTiles: function (){  

    if (this.options.effect == 'sliderBoczny') return;

    $("img").hide();

    var currentContainer = ($('.active') ? $('.active') : $('.kontener:first'));
    var next = ($('.kontener').eq(this.options.current-2)); 
    var prev = ((currentContainer.prev().length) ? (currentContainer.prev()) : $('.kontener:last'));
    this.effects(currentContainer)

    currentContainer.removeClass('active');
    currentContainer.css('z-index','100');
    next.addClass("active");
    next.css('z-index','50');
    prev.css('z-index','50');

    next.find('img').show();

    if(this.options.current > $('.kontener').length){
      this.options.current -= $('.kontener').length
    }
    else if (this.options.current < 0){
      this.options.current += $('.kontener').length
    }
  },
  
  navigateRight : function (){
        var that = this
    if(this.options.current<that.$elChildrens.length-1) {
      that.options.current ++;
      that.move();
    }
  },
  navigateLeft : function (){
    if(this.options.current > 0) {
      this.options.current --;
      this.move(this.options.current);
    }
  },
  ser : function(){
    var that = this
    var currentX =0

    this.$elChildrens.on(' mousedown touchstart', function(e){
     
        e.preventDefault();
        window.clearTimeout(600);
        currentX = e.originalEvent.touches ?  e.originalEvent.touches[0].pageX : e.pageX;
        if(that.options.animating) return;

        that.settings.index = $(this).index();
        that.settings.x = currentX
          //
          $('body').on('mousemove touchmove',function(e){
          currentX = e.originalEvent.touches ?  e.originalEvent.touches[0].pageX : e.pageX;
 
          that.settings.endX = that.settings.x - currentX;
          that.settings.dir = that.settings.endX > 0 ? +1 : -1;
          
          var endxSlowly = (-$('#zbiornik').width() *that.options.current) - that.settings.endX/5;

            $('#lista').css({'left':endxSlowly});
            if(that.settings.dir == -1){
                  that.$elChildrens.eq(that.settings.index + (that.settings.dir)).css({
              'z-index' : -5,
              'left' : -that.settings.endX*0.1 +that.$elWidth/2})    
              }
                else{ 
              that.$elChildrens.eq(that.settings.index + (that.settings.dir)).css({
                    'z-index' : -5,
                'left' : -that.settings.endX*0.1 -that.$elWidth/2})
            }
      
          });

       });

    $(document).on('mouseup touchend',function(e){
      $('body').off('mousemove touchmove');
      console.log(currentX)
      e.stopPropagation()
      e.preventDefault()
           
      if(that.settings.endX < -that.$elWidth/3.8){
        that.navigateLeft ();
      }
      else if (that.settings.endX > that.$elWidth/3.8){
        that.navigateRight ();
      }
      that.settings.endX = 0
    }); 
  },

  move : function  (liczba){
    var that = this
    this.options.animating = true;
    this.$elChildrens.animate({left :(0)},553);        
    this.$el.animate({
      left: -$('.kontener').width() * that.options.current
    },555,function(){               
      that.options.endX = 0;
     
      if(that.options.current <2){
        
        that.options.current += $('.kontener').length-4
        that.$el.css({'transition':'0','left': -that.$elWidth * that.options.current+'px'})
      }

      else if (that.options.current > that.$elChildrens.length-4) {
       
        that.options.current -=($('.kontener').length-4)
        that.$el.css({'transition':'0','left': -that.$elWidth *  that.options.current+'px'})
      }
    })
    setTimeout(function(){
      that.options.animating = false;
      that.$elChildrens.siblings().css('z-index',1);
    },600);
  }
   
}
 

$.fn.nazwa = function(options){
  return this.each(function(){
    var plugin = new Plugin(this,options)
    plugin.init(this,options)

  
  })
}




})(jQuery);

