

(()=>{
  // transform: translate(5%, 5%); */
  //   transition: ease .5s all;
  let content = document.querySelector('.content')
  let name = document.querySelector('.name-2');
  let dots = document.querySelector('#dots');
  let avatar = document.querySelector('.avatar')
  let description = document.querySelector('.description')
  let { innerHeight, innerWidth } = window;


  document.onmousemove = (e)=> {
    let { pageY, pageX } = e;
    let halfX = (innerWidth / 2)
    let halfY = (innerHeight / 2)
    let moveX = distance => (pageX - halfX) / distance;

    avatar.style.transform = `translate(${-(moveX(300))}%, ${-(pageY) / (innerHeight)}%)`
    content.style.transform = `translate(${-(moveX(320))}%, ${-(pageY) / (innerHeight)}%)`
    // content.style.transform = `translate(${-(pageX)/ (innerWidth)}%, ${-(pageY) / (innerHeight)}%)`
    dots.style.transform = `translate(${moveX(300)}%, ${(pageY) / (innerHeight)}%)`
  }

  avatar.onclick = () =>{
    $(avatar).addClass('hide')
      $(name).addClass('small')
      $(description).addClass('hide')
  }

  const myHandler = (event) => {
    if(event.deltaY > 0 ){
      $(avatar).addClass('hide')
      $(name).addClass('small')
      $(description).addClass('hide')
    }else{
      $(avatar).removeClass('hide')
      $(name).removeClass('small')
      $(description).removeClass('hide')
    }
    
  }// do something with the event
  const tHandler = throttled(1000, myHandler);

  document.addEventListener("mousewheel", tHandler);

})()


function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

//CANVAS
$(function(){
    var canvas = document.querySelector('#dots'),
        ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    $(window).resize(function(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    })
    ctx.lineWidth = .3;
    ctx.strokeStyle = (new Color(100)).style;
    
    var mousePosition = {
      x: 30 * canvas.width / 100,
      y: 30 * canvas.height / 100
    };
    console.log(canvas.width)
    var dots = {
      nb: (canvas.width>600?150:100),
      distance: 80,
      d_radius: 150,
      array: []
    };
  
    function colorValue(min) {
      return Math.floor(Math.random() * 255 + min);
    }
    
    function createColorStyle(r,g,b) {
      return 'rgba(' + r + ',' + g + ',' + b + ', 0.1)';
    }
    
    function mixComponents(comp1, weight1, comp2, weight2) {
      return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    }
    
    function averageColorStyles(dot1, dot2) {
      var color1 = dot1.color,
          color2 = dot2.color;
      
      var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
          g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
          b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
      return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    }
    
    function Color(min) {
      min = min || 0;
      this.r = colorValue(min);
      this.g = colorValue(min);
      this.b = colorValue(min);

      this.r = 250;
      this.g = 170;
      this.b = 84;
      this.style = createColorStyle(this.r, this.g, this.b);
    }
  
    function Dot(){
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
  
      this.vx = -.5 + Math.random();
      this.vy = -.5 + Math.random();
  
      this.radius = Math.random() * 3;
  
      this.color = new Color();
    //   console.log(this);
    }
  
    Dot.prototype = {
      draw: function(){
        ctx.beginPath();
        ctx.fillStyle = this.color.style;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
      }
    };
  
    function createDots(){
      for(i = 0; i < dots.nb; i++){
        dots.array.push(new Dot());
      }
    }
  
    function moveDots() {
      for(i = 0; i < dots.nb; i++){
  
        var dot = dots.array[i];
  
        if(dot.y < 0 || dot.y > canvas.height){
          dot.vx = dot.vx;
          dot.vy = - dot.vy;
        }
        else if(dot.x < 0 || dot.x > canvas.width){
          dot.vx = - dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    }
  
    function connectDots() {
      for(i = 0; i < dots.nb; i++){
        for(j = 0; j < dots.nb; j++){
          i_dot = dots.array[i];
          j_dot = dots.array[j];
  
          if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
            if((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
              ctx.beginPath();
              ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
              ctx.moveTo(i_dot.x, i_dot.y);
              ctx.lineTo(j_dot.x, j_dot.y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    }
  
    function drawDots() {
      for(i = 0; i < dots.nb; i++){
        var dot = dots.array[i];
        dot.draw();
      }
    }
  
    function animateDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveDots();
      connectDots();
      drawDots();
  
      requestAnimationFrame(animateDots);	
    }
  
    $(document).on('mousemove', function(e){
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    });
  
    $('canvas').on('mouseleave', function(e){
      mousePosition.x = canvas.width / 2;
      mousePosition.y = canvas.height / 2;
    });
  
    createDots();
    requestAnimationFrame(animateDots);	
  });
