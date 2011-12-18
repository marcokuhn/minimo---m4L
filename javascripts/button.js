var Button = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.label = null;
        this.textAlign = "center";
        this.fontColor = "#fff";
        this.fontName = "Arial";
        this.fontSize = 10;
        this.fgColor = '#0b9dff';
        this.bgColor = '#393637';
        this.borderWidth = 0;
        this.borderColor = "rgba(255,255,255,1)";

        Widget.prototype.initialize.call(this, options);
    },

    drawBorder: function(context) {
        var w = this.borderWidth / 2;
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.borderWidth;
        context.strokeRect(w, w, this.width - w, this.height - w); 
    },

    drawBackground: function(context, style) {
        context.fillStyle = style;
        context.fillRect(0, 0, this.width, this.height);
    },

    drawLabel: function(context) {
        context.textAlign = this.textAlign;
        context.fillStyle = this.fontColor;
        context.font = (this.height * this.fontSize / 30) + "px " + this.fontName;
        context.fillText(this.label, this.width / 2, this.height / 2 + this.height * this.fontSize / 100);
    },

    drawCanvas: function(context) {
        this.drawBackground(context, this.bgColor);

        if (this.label) {
            this.drawLabel(context);
        }

        if (this.borderWidth > 0) {
            this.drawBorder(context);
        }
    },

    onTouchDown: function(event) {
        this.fireEvent("click");
        return true;
    }

});

var SelectionButton = new Class({
    Extends: Button,

    drawCanvas: function(context) {
        this.drawBackground(context, this.active ? this.fgColor : this.bgColor);
        this.drawLabel(context);
    },

    onTouchDown: function(event) {
        this.fireEvent('click', this.clip);
        return true;
    }
});

var SelectionSwitcher = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        this.active = 0;
        this.layout = 'horizontal';
		
		selections = ['OSC', 'Filter', 'ADSR','FX'];
		params = [["volume", "pitch", "octave", "detune", "pwidth"],
		["cutoff", "reso"],
		["attack", "decay", "sustain", "release"],
		["reverb", "delay", "dtime", "feedback"]
		]
		this.params = params;
		colors = [this.color1, this.color2, this.color3, this.color4];
		
        for (var i = 0; i < 4; i++) {
            this.add({
                active: i == 0,
                type: SelectionButton,
                fgColor: colors[i],
                label: selections[i],
                param: params[i],
                marginRight: 1,
                clip: i,
                on: {
                    click: this.onButtonClick.bind(this)
                }
            });
        }
    },

    onButtonClick: function(clip) {
        this.clip(clip);
        //console.log('clip-->'+clip);
        this.instrument.selectionToggle(1, clip, this.params);
        //this.instrument.send('/clip', 'i', this.active);
    },

    clip: function(clip) {
        this.active = clip;
        this.children.each(function(child, i) {
            child.active = i == this.active;
        }, this);
    }
});

var ToggleButton = new Class({
    Extends: Button,

    initialize: function(options) {
        this.state = false;
        Button.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        this.drawBackground(context, this.state ? this.fgColor : this.bgColor);
        this.drawLabel(context);
    },

    onTouchDown: function(event) {
        this.state = ! this.state; 
        this.fireEvent("click", this.state);
        return true;
    }

});
