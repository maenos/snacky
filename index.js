window.onload = function() 
{
  /* variable local */
  var canvash = 600;
  var canvasw = 1020;
  var delay = 150;
  var blocksize = 30;
  var ctx;
  var snake;
  var apple;
  var widthinblock = canvasw/blocksize;
  var heightinblock = canvash/blocksize;
  var score;
  var time;
 
  /*executerinit*/
  init();
   /*initialisation*/
   function init() 
   { 
    var canvas = document.createElement('canvas');
    canvas.width = canvasw;
    canvas.height = canvash;
    canvas.style.border = "20px solid gray";
     canvas.style.margin = "50px auto";
     canvas.style.display = "block";
     canvas.style.backgroundColor="black";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    snake = new snackeb([[5,3], [4,3], [3,3], [2,3]],   "right");
     apple = new pom([10,10]);
    score = 0;
     canvasref();
     
   }


   /* canvasrefresh */
   function canvasref() 
   {
    snake.advance();
     if(snake.collision())
       {
         gameover();
         
       }
     else
     {
       if(snake.iseat(apple))
         {
           score ++;
           snake.atepom = true;
           do
           {
             apple.setnewposition();
           } 
           while(apple.onsnake(snake))
         }
    ctx.clearRect(0,0,canvasw,canvash);
    snake.draw();
    apple.draw();
    drawscore();
    time = setTimeout(canvasref,delay);
     }
    
   }
     /* game over draw */
        
     
     function gameover()
     {
       ctx.save();
       ctx.font = "bold 30px serif";
       ctx.fillStyle = "white";
       ctx.lineWidth = 10;
        var centerx = canvasw / 2;
       var centery = canvash / 2;
       ctx.textBaseline = "middle";
       ctx.strokeText("Game Over", centerx, centery);
       ctx.fillText("Game Over", centerx, centery);
       ctx.strokeText("Espace pour rejouer" , centerx, centery +40 )
       ctx.fillText("Espace pour rejouer" , centerx, centery  +40 );
       ctx.restore();
     }

   /*draw serpent*/
   function drawblock(ctx, place) {
     var x = place[0] * blocksize;
     var y = place[1] * blocksize;
     ctx.fillRect(x ,y , blocksize, blocksize);
     
   }
   /*snakebody */
   function snackeb(body,direction) 
   {
     this.body = body;
     this.atepom = false;
	 this.direction = direction;
     this.draw = function() 
     {
       ctx.save();
       ctx.fillStyle = "lightskyblue";
       for (var i = 0; i < this.body.length; i++) 
       {
         drawblock(ctx, this.body[i]);
         
       }
       ctx.restore();
     };
     /*faire avance*/
     this.advance = function()
      {
       var nextplace = this.body[0].slice();
      /*les positions avec les directions*/   
      switch(this.direction)
        {
          case "left":
            nextplace[0] -= 1;
            break;
          case "right":
            nextplace[0] += 1;
            break;
          case "down":
            nextplace[1] += 1;
            break;
          case "up":
            nextplace[1] -= 1;
            break;
          default:
            throw("invalid direction");
            
        }
       this.body.unshift(nextplace);
       if(!this.atepom)
        
         this.body.pop();
       else
         this.atepom = false;
       
     };
     /*direction et permis */
     this.setdirection = function(newdirection)
     {
       var allowedirections;
       switch(this.direction)
         {
           case "left":
           case "right":
             allowedirections = ["up", "down"];
             break;
           case "down":
           case "up":
             allowedirections = ["left", "right"];
             break;
           default:
             throw("invalid direction");
         }
       if(allowedirections.indexOf(newdirection) > -1)
         {
           this.direction = newdirection;
         }
     };
     /*collision avec un mur ou corps*/
     this.collision = function()
     {
       var wallcollision = false;
       var snakecollision = false;
       var head = this.body[0];
       var rest = this.body.slice(1);
       var snakex = head[0];
       var snakey = head[1];
       var minX =0;
       var minY = 0;
       var maxX = widthinblock -1;
       var maxY = heightinblock -1;
       /*depasse les murs horizontal */
       var depasseh = snakex < minX || snakex > maxX;
       var depassew = snakey < minY || snakey > maxY;
       
       if(depasseh || depassew)
       {
         wallcollision = true;
       }
       for(var i = 0; i < rest.length ; i++)
         {
           if(snakex === rest[i][0] && snakey === rest[i][1])
             {
              snakecollision = true;  
             }
         }
       return wallcollision || snakecollision;
       
     };
     /*mange t il la pomme */
     this.iseat = function(eat)
     {
       var head = this.body[0];
       if(head[0] === eat.position[0] && head[1] === eat.position[1])
         return true;
       else
         return false;
     };
   }
     /* score affiche */
     
     function drawscore()
     {
       ctx.save();
       ctx.font = "bold 70px monospace";
       ctx.fillStyle = "white";
       ctx.textAlign = "center";
       ctx.fillText(score.toString(), 30, canvash - 15);
       ctx.restore();
     }
  
  /* creation de la pomme*/
  
  function pom(position)
  {
    this.position = position; 
    this.draw = function()
    {
      ctx.save();
      ctx.fillStyle = "orange";
      ctx.beginPath();
      var radius = blocksize/2;
      var x = this.position[0]*blocksize +radius;
      var y = this.position[1]*blocksize +radius;
      ctx.arc(x,y, radius, 0, Math.PI*2, true);
      ctx.fill();
      ctx.restore();
                  
    };
    this.setnewposition = function()
    {
      var newX = Math.round(Math.random() * (widthinblock -1));
      var newY = Math.round(Math.random() * (heightinblock -1));
      this.position = [newX, newY];
      };
    /*pom sur le serpen */
    this.onsnake = function(snakecheck)
    {
      
      var onsnake = false;
      
      for(var i = 0; i < snakecheck.body.length; i++)
        {
          if(this.position[0] === snakecheck.body[i][0] && 
           this.position[1] === snakecheck.body[i][1])
            {
              onsnake =true;
            }
        }
      return onsnake;
    };
  }
  
     /* restart */
     function restart()
     {
        snake = new snackeb([[5,3], [4,3], [3,3], [2,3]],   "right");
     apple = new pom([10,10]);
       clearTimeout(time);
       score = 0;
    canvasref();
     }
  /*touch directionnelle*/
  document.onkeydown = function handleKeyDown(e)
  {
    var key = e.keyCode;
    var newdirection;
      switch(key)
      {
            case 37:
                newdirection = "left";
                break;
            case 38:
                newdirection = "up";
                break;
            case 39:
                newdirection = "right";
                break;
            case 40:
                newdirection = "down";
                break;
           case 32:
                 restart();
             return;
            default:
                return;
    }
      snake.setdirection(newdirection);
  
  }
  
  
}

/*les variable perso
*place = position
next place = nextposition

*
*
*/