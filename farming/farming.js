goog.provide('farming');   
goog.require('lime.Director'); 
goog.require('lime.Scene'); 
goog.require('lime.Layer');   
goog.require('lime.GlossyButton');  
goog.require('lime.Sprite');

//entrypoint 
farming.start = function(){     
    
    //game object
    var gameObj = {
        width: 320,
        height: 480,
        tile_size: 80,
        num_tiles_x: 4,
        num_tiles_y: 5,
        landLayer_w: 80*4, 
        landLayer_h: 80*5,
        controlsLayer_w: 80*4,
        controlsLayer_h: 80*1,
        costPlowing: 2,
        
        //shop
        shop_margin_x: 5,
        shop_margin_y: 0,
        shop_text_margin_x: 20,
        shop_text_margin_y: 16,

        //achievement page
        achieve_margin_x: 10,
        achieve_margin_y: 5,
        achieve_text_margin_x:20,
        achieve_text_margin_y:16
    }
    
    
    //player object
    var playerObj = {
        money: 17,
        currentCrop: 0     
    }
    

    //object-oriented crop creation
    createCrop = function(name, cost, revenue, time_to_ripe, time_to_death, chance_to_live, image, growing_image, description){
        var self = {
            name: name,
            cost: cost,
            revenue: revenue,
            time_to_ripe: time_to_ripe, //secods
            time_to_death: time_to_death, //second from when it's ripe
            chance_to_live: chance_to_live, //between 0 and 1
            image: image,
            growing_image: growing_image,
            description: description
        }
    return self
    }
    //crops and details
    gameObj.crops = [
    createCrop('Weedling',1,4,25,25,.75,'weedling.png','miniweedling.png','Office always smells weird'),
    createCrop('Bad Apple',2,6,30,3,.9,'badapple.png','minibadapple.png','Joke about Spaghetti Code'),
    createCrop('Oopsie Daisy',3,12,45,180,.4,'oopsiedaisy.png','minioopsiedaisy.png','License to Spill'),
    createCrop('Couch Potato',5,13,240,60,.8,'couchpotato.png','minicouchpotato.png','Could finish before Half Life 3'),
    createCrop('Wise Old Sage',16,26,90,90,.9,'oldsage.png','miniosage.png','Favorite Language:FORTRAN'),
    createCrop('Adam\'s Apple',5,28,20,99999,1,'adamsapple.png','miniadamsapple.png','You\'re the apple of his eye')
    ];

    var director = new lime.Director(document.body,gameObj.width,gameObj.height);     
    director.makeMobileWebAppCapable();     
    director.setDisplayFPS(false);        
    
    //start Menu
    var startMenuScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
    var startMenuLayer = new lime.Layer().setAnchorPoint(0,0);

    var startMenuBackground = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0)
        .setSize(gameObj.width, gameObj.height).setFill('images/CropCorpTitle.png');
    startMenuLayer.appendChild(startMenuBackground);
    startMenuScene.appendChild(startMenuLayer);

    //start menu to intro page button
    var startMenuToIntroButton = new lime.GlossyButton().setColor('#06630e').setText('Dig In')
        .setPosition(gameObj.width/2, gameObj.height/2+150)
        .setSize(gameObj.width-50, 60);
    startMenuLayer.appendChild(startMenuToIntroButton)
    
    //introduction Page
    var introPageScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
    var introPageLayer = new lime.Layer().setRenderer(lime.Renderer.CANVAS);

    var introPageBackground = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0)
        .setSize(gameObj.width, gameObj.height).setFill('images/CropCorpIntro.png');
    introPageLayer.appendChild(introPageBackground);
    introPageScene.appendChild(introPageLayer);

    //intro page to game button
    var introPageButton = new lime.GlossyButton().setColor('#06630e').setText('Get your hands dirty')
        .setPosition(gameObj.width/2, gameObj.height/2+180)
        .setSize(gameObj.width-50, 60);
    introPageLayer.appendChild(introPageButton)

    //game Scene
    var gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
    var landLayer = new lime.Layer().setAnchorPoint(0, 0);
    var controlsLayer = new lime.Layer().setAnchorPoint(0, 0);
    
    gameScene.appendChild(landLayer);
    gameScene.appendChild(controlsLayer);
    
    //controls area
    var controlArea = new lime.Sprite().setAnchorPoint(0,0)
        .setPosition(0, gameObj.height-gameObj.controlsLayer_h)
        .setSize(gameObj.controlsLayer_w, gameObj.controlsLayer_h)
        .setFill('#0D0D0D')
    controlsLayer.appendChild(controlArea);

    //money indicator
    var moneyLabel = new lime.Label().setText('$'+playerObj.money).setFontColor('#42e334')
        .setPosition(gameObj.controlsLayer_w-120, gameObj.height-gameObj.controlsLayer_h/2)
        .setFontSize(32)
    controlsLayer.appendChild(moneyLabel); 
    
    //updating money indicator
    gameObj.updateMoney = function() {
        moneyLabel.setText('$'+playerObj.money);
        updateBigMoney()
    };

    //display current crop in game scene
    var currentCropImage = new lime.Sprite().setAnchorPoint(0,0)
        .setPosition(gameObj.controlsLayer_w-gameObj.tile_size+10, gameObj.height-gameObj.controlsLayer_h+10)
        .setSize(gameObj.tile_size*3/4,gameObj.tile_size*3/4)
        .setFill('images/'+gameObj.crops[playerObj.currentCrop].image)
    controlsLayer.appendChild(currentCropImage)

    //update current crop icon
    var setCurrentCropImage = function(){
        currentCropImage.setFill('images/'+gameObj.crops[playerObj.currentCrop].image)
    }

    //game to shop button
    var shopButton = new lime.GlossyButton().setColor('#06630e').setText('Resum\xE8s')
        .setPosition(80, gameObj.height-gameObj.controlsLayer_h*3/4)
        .setSize(90, 40);
    controlsLayer.appendChild(shopButton);

    //game to achievement scene button
    var achieveButton = new lime.GlossyButton().setColor('#06630e').setText('Achieve!')
        .setPosition(80, gameObj.height-gameObj.controlsLayer_h/4)
        .setSize(90, 40);
    controlsLayer.appendChild(achieveButton);


    //achievements scene
    var achieveScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
    var achieveLayer = new lime.Layer().setAnchorPoint(0, 0);
    
    var achieveBackground = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0)
        .setSize(gameObj.width, gameObj.height).setFill('#0D0D0D');
    achieveLayer.appendChild(achieveBackground);
    achieveScene.appendChild(achieveLayer);

    //achieve scene to game button
    var achieveToGameButton = new lime.GlossyButton().setColor('#06630e').setText('Back to the Farm')
        .setPosition(gameObj.width/2, gameObj.height/2+180)
        .setSize(gameObj.width-50, 60);
    achieveLayer.appendChild(achieveToGameButton)

    //achievement template
    createAchievement= function(id, name, description){
        var self ={
        id:id,
        name:name,
        description:description,
        unlocked:false,
        status_message_image:'images/notachieved.png'
        }
    return self
    }


    //achievements
    gameObj.achievements =[
    createAchievement('view_page','View the Achievement Page','You\'ve made it all the way here!'),
    createAchievement('plant_something','Farm Assist','Plant anything!'),
    createAchievement('all_plants','Corn-ucopia!','Plant every type of plant'),
    createAchievement('clear_dead','Bring out your dead!','Clear 10 sad, unsuccessful plants'),
    createAchievement('big_money','Out, standing in your field','Get 1000 money!')
    ]


    //earning achievements
    unlockAchievement = function(achievementID){
        for(var i=0; i<gameObj.achievements.length; i++){
            if (gameObj.achievements[i].id===achievementID){
                gameObj.achievements[i].unlocked=true
                gameObj.achievements[i].status_message_image='images/achieved.png'
                drawCheckMark()
            }
        }
    }

    //draw check mark for unlocked achievement
    drawCheckMark = function(){
        for(var i=0; i<gameObj.achievements.length; i++){
            var item = new lime.Sprite().setAnchorPoint(0,0).setFill(gameObj.achievements[i].status_message_image)
                .setPosition(gameObj.tile_size*3,gameObj.tile_size*i+gameObj.achieve_margin_y)
        achieveLayer.appendChild(item)
        }
    }

    //achievement scene items
    for(var i=0; i<gameObj.achievements.length; i++){
        var item = new lime.Label().setText(gameObj.achievements[i].name).setFontColor('#42e334')
            .setPosition(gameObj.tile_size*3/2,gameObj.tile_size*i+gameObj.achieve_margin_y+15)
        achieveLayer.appendChild(item)
        var item = new lime.Sprite().setAnchorPoint(0,0).setFill(gameObj.achievements[i].status_message_image)
            .setPosition(gameObj.tile_size*3,gameObj.tile_size*i+gameObj.achieve_margin_y)
        achieveLayer.appendChild(item)
        var item = new lime.Label().setText(gameObj.achievements[i].description).setFontColor('#cea645')
            .setPosition(gameObj.tile_size*3/2,gameObj.tile_size*i+gameObj.achieve_margin_y+35).setFontSize(14)
        achieveLayer.appendChild(item)
    }

    //counter for 'clear_dead' achievement
    gameObj.achievements[3].counter=0
    updateClearDead = function(){
        gameObj.achievements[3].counter += 1;
        if (gameObj.achievements[3].counter===10){
            unlockAchievement('clear_dead')
        }
    }

    //updates counter for 'big_money' achievement
    updateBigMoney = function(){
        if (playerObj.money>1000){
            unlockAchievement('big_money')
        }
    }

    //update 'all_plants' achievement
    gameObj.achievements[2].plantedCrops=[]
    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }
    updateAllPlantsAchievement = function(currentCrop){
        if (!isInArray(currentCrop,gameObj.achievements[2].plantedCrops)){
            gameObj.achievements[2].plantedCrops.push(currentCrop)
            console.log(gameObj.achievements[2].plantedCrops)
        }
        if (gameObj.achievements[2].plantedCrops.length===gameObj.crops.length){
            unlockAchievement('all_plants')
            console.log('unlockedachievement')
        }
    }


    //game to start menu button
    /*var startMenuButton = new lime.GlossyButton().setColor('#CCFF00').setText('Start Menu')
        .setPosition(160, gameObj.height-gameObj.controlsLayer_h/2)
        .setSize(100, 40);
    controlsLayer.appendChild(startMenuButton); */

    //shop
    var shopScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
    var shopLayer = new lime.Layer().setAnchorPoint(0, 0);
    
    var shopBackground = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0)
        .setSize(gameObj.width, gameObj.height).setFill('#0D0D0D');
    shopLayer.appendChild(shopBackground);
    shopScene.appendChild(shopLayer);

    //shop items
    for(var i=0; i<gameObj.crops.length; i++) {
        var item = new lime.Sprite().setAnchorPoint(0,0).setPosition(gameObj.shop_margin_x, gameObj.shop_margin_y + (gameObj.shop_margin_y + gameObj.tile_size)*i)
            .setFill('images/'+gameObj.crops[i].image).setSize(gameObj.tile_size, gameObj.tile_size);
        shopLayer.appendChild(item);
        
        var label = new lime.Label().setText(gameObj.crops[i].name+' ('+gameObj.crops[i].time_to_ripe+' days)').setFontColor('#42e334')
        .setPosition(gameObj.shop_margin_x+200, gameObj.shop_text_margin_y*1 + (gameObj.shop_margin_y + gameObj.tile_size)*i);
        shopLayer.appendChild(label);
        var label = new lime.Label().setText('Cost: $'+gameObj.crops[i].cost + ' Yield: $'+gameObj.crops[i].revenue).setFontColor('#cea645')
        .setPosition(gameObj.shop_margin_x+200, gameObj.shop_text_margin_y*2 + (gameObj.shop_margin_y + gameObj.tile_size)*i);
        shopLayer.appendChild(label);
        var label = new lime.Label().setText('Chance to Produce Code: '+gameObj.crops[i].chance_to_live*100 + '%').setFontColor('#cea645')
        .setPosition(gameObj.shop_margin_x+200, gameObj.shop_text_margin_y*3 + (gameObj.shop_margin_y + gameObj.tile_size)*i);
        shopLayer.appendChild(label);
        var label = new lime.Label().setText(gameObj.crops[i].description).setFontColor('#cea645')
        .setPosition(gameObj.shop_margin_x+200, gameObj.shop_text_margin_y*4 + (gameObj.shop_margin_y + gameObj.tile_size)*i);
        shopLayer.appendChild(label);
        
        //choose crop
        (function(item, i) {
            goog.events.listen(item,['mousedown', 'touchstart'], function(e) {
                playerObj.currentCrop = i;
                director.replaceScene(gameScene);
                setCurrentCropImage()
            });
        })(item, i);
    }

    //Achievements!

    
    //create land elements
    for(var i=0; i<gameObj.num_tiles_x; i++) {
        for(var j=0; j<gameObj.num_tiles_y; j++) {
            var landElement = new farming.Land(gameObj, playerObj).setPosition(i*gameObj.tile_size, j*gameObj.tile_size);
            landLayer.appendChild(landElement);
        }
    }

    

    director.replaceScene(startMenuScene); 

    //launch intro from menu
    goog.events.listen(startMenuToIntroButton,['mousedown','touchstart'], function(e){
        director.replaceScene(introPageScene);
    });

    //launch shop from intro
    goog.events.listen(introPageButton,['mousedown','touchstart'], function(e){
        director.replaceScene(shopScene);
    })

    //launch achieve from game
    goog.events.listen(achieveButton,['mousedown','touchstart'], function(e){
        director.replaceScene(achieveScene);
        unlockAchievement('view_page')
    })

    //launch game from achieve
    goog.events.listen(achieveToGameButton,['mousedown','touchstart'], function(e){
        director.replaceScene(gameScene);
        unlockAchievement('view_game_scene')
    })

    //launch shop from game
    goog.events.listen(shopButton,['mousedown', 'touchstart'], function(e) {
        director.replaceScene(shopScene);
    });
    
    //launch Start Menu event
    /*goog.events.listen(startMenuButton,['mousedown','touchstart'], function(e){
        director.replaceScene(startMenuScene);
    });*/

    /*//close shop event
    goog.events.listen(closeButton,['mousedown', 'touchstart'], function(e) {
        director.replaceScene(gameScene);
    });*/
    
      //close Shop button
    /*var closeButton = new lime.GlossyButton().setColor('#133242').setText('Back')
        .setPosition(gameObj.width/2, gameObj.height-25)
        .setSize(80, 40);
    shopLayer.appendChild(closeButton);*/
    
}

