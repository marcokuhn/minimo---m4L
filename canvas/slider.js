var Slider = new Class({
    Extends: Widget,

    initialize: function(options) {
        this._value = 0;
        this.handleSize = 20;
        this.handlePos = 0;
        this.lastEventTime = 0;
        this.min = 0;
        this.max = 1;
        this.label = "";
        this.fgColor = '#0b9eff';
        this.bgColor = '#3a3637';
        this.fontColor = '#ffffff';

        Widget.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        var position = (this.height - this.handleSize) * 
                ((this._value - this.min) / (this.max - this.min));

        this.handlePos = this.height - this.handleSize - position;        

        context.fillStyle = this.bgColor;
        context.fillRect(0, 0, this.width, this.height);

        context.fillStyle = this.fgColor;
        context.fillRect(0, this.handlePos, this.width, this.height-this.handlePos);//*-1);

        context.rotate(-Math.PI / 2);
        context.font = (this.height / 8) + "px Arial";
        context.fillStyle = this.fontColor;
        context.fillText(this.label, -this.height + 10, 20)
    },

    value: function(value) {
        if (value === undefined) {
            return this._value;
        }
        else {
            this._value = Math.max(this.min, Math.min(this.max, value));
        }
    },

    setValueTimed: function(value) {
        if (this.lastEventTime + 500 < Number(new Date())) {
            this.value(value);
        }
    },

    handleEvent: function(event) {    
        var value = this.min + ((this.height - event.localY) / this.height) * (this.max - this.min);

        if (Math.abs(value - this._value) >= this.step) {
            this.lastEventTime = Number(new Date());
            this.value(value);
            this.fireEvent("change", this._value);
            this.instrument.send('/parameter', 'sf', this.key, this._value);
        }
    },

    onTouchDown: function(event) {
        this.handleEvent(event);
        return true;
    },

    onTouchMove: function(event) {
        this.handleEvent(event);
        return true;
    }
});