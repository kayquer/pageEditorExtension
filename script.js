appendDependencias(); 
 
 
 $('body *').on('click',function(e){

        e.preventDefault();
        e.stopPropagation();
        
        var path = getDomPath(e.target);
        
      var $alvo = $(e.target);
      var top = getPosTop($alvo)
      var left = getPosLeft($alvo)
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      var widthPopup = 500;
      var mousePosX = e.pageX; 
      var mousePosY = e.pageY;
      var popupPosX = mousePosX ;
      var popupPosY = mousePosY + 25;

      switch(true){
          case mousePosX > windowWidth - widthPopup:
           console.log('fora do eixo X')
           popupPosX = mousePosX - widthPopup;
          
      }

      $alvo.text()
        console.log("$('"+path.join(' > ')+"')");
        $('#__popup').remove();
        var contem_html = '';
        if(detectaTags($alvo.html()))
            contem_html = '( *Contem html)';

        addOverlay($alvo);

        var linhatexto = $alvo.text() ? `<p style="font-weight:bold;">Texto${contem_html}:</p><textarea id="editar_elemento_text" style="width: 100%;height:400px;border:none;">${$alvo.html()}</textarea>` : '' ;


        var linhaimagem = $alvo.attr('src') ? `<p style="font-weight:bold;">Imagem:</p>
        <textarea id="editar_elemento_src" style="width: 100%;height:300px;border:none;">${$alvo.attr('src')}</textarea>` : '' ;

        var linhahref = $alvo.attr('href') ? `<p style="font-weight:bold;">Link:</p>
        <input id="editar_elemento_href" style="width: 100%;border:none;" value="${$alvo.attr('href')}">`: '';

        var corpo = `<span id="__popup" class="tooltip-balao" style="
        position:absolute;
        left:${popupPosX}px;
        top:${popupPosY}px;
        display:block;
        width:${widthPopup}px;    
        background-color: #fff;
        padding: 20px;
        z-index: 9999;
        color: #000;box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);" >
        <i id="fechar_painel" style="
        top: 5px;
        right: 15px;
        position: absolute;
        font-style: normal;
        font-weight: bold;
        cursor: pointer;
        ">X</i>
        <p style="font-weight:bold;">Cor Fundo:</p>
        <input type="hidden" id="color-picker_bg_val">
        <span id="color-picker_bg"></span>
        <p style="font-weight:bold;">Cor texto:</p>
        <span id="color-picker_text"></span>
        <input type="hidden" id="color-picker_text_val">
        <p style="font-weight:bold;">Tipo de elemento:</p>
        <p> ${$alvo.prop('nodeName')}</p>
        ${linhatexto}
        
        ${linhaimagem}
        
        ${linhahref}
        
        <input id="editar_elemento_btn" value="Confirmar" type="button">
        
        </span>`;
   
        $.when($('body').append(corpo)).then(

            function(){
              $('#caixa_cod').remove()
                carregaPicker($alvo.css( "color" ),$alvo.css( "background-color" ));
                $('#fechar_painel').on('click', function(){ $('#__popup').hide(); removeOverlay() })
                $('#editar_elemento_btn').on('click', function(){

                    
                    var collapsed = '';
                    var srcCollapsed = '';
                    console.log($alvo.text())
                    $alvo.html($('#editar_elemento_text').val());
                    $alvo.attr('src',$('#editar_elemento_src').val());
                    $alvo.attr('href',$('#editar_elemento_href').val());
                    $alvo.css('background-color',$('#color-picker_bg_val').val());
                    $alvo.css('color',$('#color-picker_text_val').val());
                    if($('#editar_elemento_text').val())
                    collapsed = $('#editar_elemento_text').val().replace(/(\r\n|\n|\r)/gm,"");
                    if($('#editar_elemento_src').val())
                    srcCollapsed = $('#editar_elemento_src').val();
                    var caminhoDOM  = "$('"+path.join(' > ')+"')"+".html('"+collapsed+"').attr('src','"+srcCollapsed+"')";
                    caminhoDOM = '<script>$(function(){'+caminhoDOM+'})</script>';
                    $('#__popup').hide();
                    removeOverlay();
                    $('body').append(`<div id="caixa_cod" style="position: absolute;top: ${popupPosY}px;left: ${popupPosX}px;z-index: 9999;"><textarea style="width:400px;height:400px">${caminhoDOM}</textarea></div>`)
                })
            }
        )
        ;


        
 });
    $('body *').mouseover(function(e){
        $(e.target).addClass('elemento_selecionado');
        
    });

    $('body *').mouseout(function(e){
        $(e.target).removeClass('elemento_selecionado');
        
    });

  $('body *').on('mouseover',function(e){

       e.preventDefault();
       e.stopPropagation()
        var path = getDomPath(e.target);
        //console.log("$('"+path.join(' > ')+"')");
        
 });
 

function getDomPath(el) {
  var stack = [];
  while ( el.parentNode != null ) {
//    console.log(el.nodeName);
    var sibCount = 0;
    var sibIndex = 0;
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      var sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if ( sibCount > 1 ) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }

  return stack.slice(1); // removes the html element
}

function findScreenCoords(mouseEvent)
{
  var xpos;
  var ypos;
  if (mouseEvent)
  {
    //FireFox
    xpos = mouseEvent.screenX;
    ypos = mouseEvent.screenY;
  }
  else
  {
    //IE
    xpos = window.event.screenX;
    ypos = window.event.screenY;
  }
  return {xpos : xpos, ypos: ypos};
}


function getPosTop(el) {
  var eTop = $(el).offset().top; //get the offset top of the element
   //return eTop - $(window).scrollTop(); //position of the ele w.r.t window

  $(window).scroll(function() { //when window is scrolled
   return eTop - $(window).scrollTop();
  } );
}

function getPosLeft(el) {
  var eTop = $(el).offset().left; //get the offset top of the element
   //return eTop - $(window).scrollLeft(); //position of the ele w.r.t window

  $(window).scroll(function() { //when window is scrolled
   return console.log(eTop - $(window).scrollLeft());
  } )
}

function carregaPicker(cor_texto, cor_bg){
    const pickr = Pickr.create({
        el: '#color-picker_bg',
        theme: 'classic', // or 'monolith', or 'nano'
        default: cor_bg,
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],
    
        components: {
    
            // Main components
            preview: true,
            opacity: true,
            hue: true,
    
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                input: true,
                clear: true,
                save: true
            }
        }
    });

    pickr.on('save', (color, instance) => {

        console.log(color.toRGBA().toString())   
       $('#color-picker_bg_val').val(color.toRGBA().toString())
       console.log(instance.hide())

   });

   const pickr_2 = Pickr.create({
    el: '#color-picker_text',
    theme: 'classic', // or 'monolith', or 'nano'
    default: cor_texto,
    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            clear: true,
            save: true
        }
    }
    });
    pickr_2.on('save', (color, instance) => {

        console.log(color.toRGBA().toString())   
    $('#color-picker_text_val').val(color.toRGBA().toString())
    console.log(instance.hide())

    });



    
}


function detectaTags(texto){
    var myRe = /<\s*[a-z][^>]*>(.*?)<\s*\/\s*[a-z]>/g;
    var myArray = myRe.exec(texto);
    return (myRe.lastIndex)
}


function addOverlay($el){
    
    $oLay = $('.overlay'),
    elPos = $el.offset(),// coordinates of element within document
    elH = $el.height(),
    elW = $el.width();
    padding = 10;
    $oLay.show(); 
     
  $oLay.filter('.top').height(elPos.top );
  
  $oLay.filter('.left').css({
    top: elPos.top,
    height: elH ,
    width: elPos.left - padding
  });
  
  $oLay.filter('.right').css({
    top: elPos.top,
    height: elH ,
    left: elPos.left + elW 
  });
  
  $oLay.filter('.bottom').css({
    top: ( elPos.top) + elH,
    height: '100%'

  });
}

function removeOverlay(){
    $oLay = $('.overlay');
    $oLay.hide();
}

function appendDependencias(){
  $('head').append(`<style>
  .elemento_selecionado {
      border: 2px solid yellow !important;
      border-style: dotted;
      transition: 0.15s all;
    }

      .overlay {
        position: absolute;
        background: rgba(0, 0, 0, .5);
        z-index: 50
      }
      .overlay.top {
        top: 0;
        left: 0;
        width: 100%
      }
      .overlay.left {
        left: 0
      }
      .overlay.right {
        right: 0
      }
      .overlay.bottom {
        width: 100%;
        left: 0;
        bottom: 0
      }
    
  </style>`);
  $('head').append("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css'/>");
  $('head').append("<script src='https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js'></script>");
}