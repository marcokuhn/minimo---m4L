var Instrument = new Class({
    Extends: Widget,

    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);

        this.bpm = 120;
        this.layout = 'vertical';
        
        //this.initMenus();

        this.clipswitcher = this.add({ 
            type: ClipSwitcher, 
            sizeHint: 0.5,
            marginTop: 5,
            instrument: this
        });
        /*
        this.automationswitcher = this.add({ 
            type: ClipSwitcher, 
            sizeHint: 0.5,
            marginTop: 5,
            instrument: this
        });
		*/
        this.sequencer = this.add({ 
            type: Sequencer, 
            sizeHint: 1,
            marginTop: 5,
            instrument: this 
        });
		
        //this.initButtons();
        this.automationswitcher = this.add({ 
            type: SelectionSwitcher, 
            sizeHint: 0.5,
            marginTop: 5,
            instrument: this
        });
        this.initSliders();
    },

    initButtons: function() {
        this.buttons = this.add({ 
            layout: 'horizontal',
            sizeHint: 0.5,
            instrument: this 
        });
        
        this.buttons.add({
            type: ToggleButton,
            label: "Osc",
            on: {
                click: this.toggleGroup.bind(this, "Osc", ["volume", "pitch", "octave", "detune", "pwidth"])
            }
            //console.log(this.buttonContainer);
            //this.buttonContainer.push(this);
        });
		
        this.buttons.add({
            type: ToggleButton,
            label: "Filter",
            on: {
                click: this.toggleGroup.bind(this, "Filter", ["cutoff", "reso"])
            }
           // this.buttonContainer.push("sdds");
        });

        this.buttons.add({
            type: ToggleButton,
            label: "ADSR",
            on: {
                click: this.toggleGroup.bind(this, "ADSR", ["attack", "decay", "sustain", "release"])
            }
            //this.buttonContainer.push(this);
        });

        this.buttons.add({
            type: ToggleButton,
            label: "FX",
            on: {
                click: this.toggleGroup.bind(this, "FX", ["reverb", "delay", "dtime", "feedback"])                    
            }
            ///this.buttonContainer.push(this);
        });

    },
    
    selectionToggle: function(state, id, paramList){
    	//console.log(state+'---------'+paramList);
    	
    	for(var i = 0; i < paramList.length; i++){
    		for(var j = 0; j < paramList[i].length; j++){
    			var automation = this.getAutomation(paramList[i][j]);
    			if (id != i){
    				if (automation)	automation.visible = false;
            	}else{
            		if (automation)	automation.visible = true;
            	}
    	
    		}
    	}
    	/*
    	paramList.each(function(selection) {
    		selection.each(function(key)){
            	var automation = this.getAutomation(key);
            	automation.visible = state;
            }
        }.bind(this));
        */
    },

    toggleGroup: function(label,keys) {
    	/*console.log("---"+label);
    	console.log(this.buttons.length)
    	for(var i = 0; i < this.buttonContainer.length;i++){
    		if (this.buttonContainer[i].label != label){	
    			console.log(this.buttonContainer[i].state)
    		}
    	}*/
    	
        keys.each(function(key) {
            var automation = this.getAutomation(key);
            automation.visible = !automation.visible;
        }.bind(this));
    },

    initMenus: function() {
        this.menus = this.add({ 
            layout: 'horizontal',
            sizeHint: 0.5,
            instrument: this 
        });

        this.type1Menu = this.menus.add({
            type: TypeMenu,
            instrument: this,
            index: 1
        });

        this.pitch1Menu = this.menus.add({
            type: PitchMenu,
            instrument: this,
            index: 1
        });

        this.type2Menu = this.menus.add({
            type: TypeMenu,
            instrument: this,
            index: 2
        });

        this.pitch2Menu = this.menus.add({
            type: PitchMenu,
            instrument: this,
            index: 2
        });

        this.modeMenu = this.menus.add({
            type: ModeMenu,
            instrument: this
        });
    },

    initSliders: function() {
        this.sliders = this.add({ 
            layout: 'horizontal',
            sizeHint: 2,
            marginTop: 5,
            instrument: this 
        });

        this.automations = this.add({ 
            layout: 'vertical',
            sizeHint: 10,
            marginTop: 5,
            instrument: this 
        });

        this.addSlider(this.color1, 'volume'    , 0, 1, 0.01);
        this.addSlider(this.color1, 'octave'    , 0, 1, 0.166666);
        this.addSlider(this.color1, 'pitch'     , 0, 1, 0.083333333);
        this.addSlider(this.color1, 'detune'    , 0, 1, 0,01);
        this.addSlider(this.color1, 'pwidth'    , 0, 1, 0.01);
        this.addSlider(this.color2, 'cutoff'    , 0, 1, 0.01);
        this.addSlider(this.color2, 'reso'      , 0, 1, 0.01);
        this.addSlider(this.color3, 'attack'    , 0, 1, 0.01);
        this.addSlider(this.color3, 'decay'     , 0, 1, 0.01);
        this.addSlider(this.color3, 'sustain'   , 0, 1, 0.01);
        this.addSlider(this.color3, 'release'   , 0, 1, 0.01);
        this.addSlider(this.color4, 'reverb'    , 0, 1, 0.01);
        this.addSlider(this.color4, 'delay'     , 0, 1, 0.01);
        this.addSlider(this.color4, 'dtime'     , 0, 1, 0.125);
        this.addSlider(this.color4, 'fback'     , 0, 1, 0.01);
    },

    clock: function(clock, bpm) {
        this.bpm = bpm;

        this.sequencer.clock(clock);

        for (var i = 0; i < this.automations.length; i++) {
            this.automations[i].clock(clock);
        }
    },

    clip: function(clip) {
        this.sequencer.clip(clip);
        this.clipswitcher.clip(clip);
    },

    getSlider: function(key) {
        return this.sliders.child(key);
    },

    getAutomation: function(key) {
        for (var i = 0; i < this.automations.children.length; i++) {
            if (this.automations.children[i].key == key) {
                return this.automations.children[i];
            }    
        }
        return null;
    },

    type: function(index, type) {
        if (index == 1) {
            this.type1Menu.value(type);
        }
        if (index == 2) {
            this.type2Menu.value(type);
        }
    },

    pitch: function(index, type) {
        if (index == 1) {
            this.pitch1Menu.value(type);
        }
        if (index == 2) {
            this.pitch2Menu.value(type);
        }
    },

    mode: function(mode) {
        this.modeMenu.value(mode);
    },

    addSlider: function(color, key, min, max, step) {
        this.sliders.add({
            type: Slider,
            fgColor: color,
            instrument: this,
            label: key,
            key: key,
            min: min,
            max: max,
            step: step
        });

        var automation = this.automations.add({
            type: Automation,
            visible: false,
            fgColor: color,
            instrument: this,
            marginTop: 5,
            key: key, 
            min: min, 
            max: max, 
            step: step
        });
    },
    
    pattern: function(clip, index, value) {
        this.sequencer.setStep(clip, index, value);
    },

    parameter: function(key, value) {
        var slider = this.getSlider(key);
		//console.log('--->value ->'+ value);
        if (slider) slider.value(value);
        //if (slider) console.log('--->value ->'+ value);
    },

    automation: function(key, index, value) {
    	//console.log('--->auto ->');
        var automation = this.getAutomation(key);
        
        if (automation) {
            automation.setStep(index, value);
        }
    },

    send: function(address, types) {
    	
    	if (address == '/parameter'){
    		//console.log(address + '---' +  Array.prototype.slice.call(arguments, 2)[0]);
    		var key = Array.prototype.slice.call(arguments, 2)[0];
    		var value = Array.prototype.slice.call(arguments, 2)[1];
    		for (var i = 0; i < 16; i++) {
        		this.automation(key, i, value);
        		this.getAutomation(key).send(i);
        	}
        	
        }
        
    	
    	
        this.controller.send({
            instrument: this.index,
            address: address,
            types: types,
            args: Array.prototype.slice.call(arguments, 2)
        });
    },

    receive: function(message) {
    	var action = message.address.slice(1);
        var fun = this[action];
        //console.log('action =========' + action);

        if (fun) {
            fun.apply(this, message.args);
        }
        else {
            console.log('action not found: ' + action);
        }
    }
});
