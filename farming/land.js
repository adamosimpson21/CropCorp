goog.provide('farming.Land');

/**
 * Land elements
 * 
 * @param {} gameObj
 */
farming.Land = function(gameObj, playerObj) {
    goog.base(this);
    this.setAnchorPoint(0, 0);
    this.setSize(gameObj.tile_size,gameObj.tile_size);
    this.setFill('images/dirt.png');
    this.state = this.EMPTY;

    var land = this;
    goog.events.listen(this,['mousedown', 'touchstart'], function(e) {
        e.event.stopPropagation();        
        if(land.state == land.EMPTY && playerObj.money >= gameObj.costPlowing) {
            //plow land
            land.setFill('images/ploweddirt.png')
            land.state = land.PLOWED;

            //update player money
            playerObj.money -= gameObj.costPlowing;
            gameObj.updateMoney();
        }
        else if(land.state == land.PLOWED && playerObj.money >= gameObj.crops[playerObj.currentCrop].cost) {
            //store crop and left time for it to be ready and to die
            land.crop = playerObj.currentCrop;
            land.ripeTime = gameObj.crops[playerObj.currentCrop].time_to_ripe * 1000;
            land.deathTime = gameObj.crops[playerObj.currentCrop].time_to_death * 1000;
            land.liveChance = gameObj.crops[playerObj.currentCrop].chance_to_live;

            //plant
            land.setFill('images/'+gameObj.crops[this.crop].growing_image);
            land.state = land.GROWING;
            unlockAchievement('plant_something')
            updateAllPlantsAchievement(playerObj.currentCrop)

            //update player money
            playerObj.money -= gameObj.crops[playerObj.currentCrop].cost;
            gameObj.updateMoney();
        }
        else if(land.state == land.READY ) {
            //harvest
            land.setFill('images/dirt.png');
            land.state = land.EMPTY;

            //update player money
            playerObj.money += gameObj.crops[land.crop].revenue;
            gameObj.updateMoney();
        } 
        else if(land.state == land.DEAD) {
            //remove dead plant
            land.setFill('images/dirt.png');
            land.state = land.EMPTY;
            updateClearDead()
        }
        
        //growing plants
        dt = 1000;
        lime.scheduleManager.scheduleWithDelay(function() {
            if(this.state == land.GROWING) {            
                if(this.ripeTime <= 0) {
                    if((Math.random()+this.liveChance)>1){
                       this.state = land.READY;
                       this.setFill('images/'+gameObj.crops[this.crop].image);
                    }
                    else{
                        this.state = land.DEAD;
                        this.setFill('images/wilted.png');
                    }
                }
                else {
                this.ripeTime -= dt;
                }
            }
            else if(this.state == land.READY) {
                if(this.deathTime <= 0) {
                    this.state = land.DEAD;
                    this.setFill('images/wilted.png');
                }
                else {
                    this.deathTime -= dt;
                }
            }     
        }, this, dt);
    });
}

goog.inherits(farming.Land,lime.Sprite);

//states
farming.Land.prototype.EMPTY = 0;
farming.Land.prototype.PLOWED = 1;
farming.Land.prototype.GROWING = 2;
farming.Land.prototype.READY = 3;
farming.Land.prototype.DEAD = 4;