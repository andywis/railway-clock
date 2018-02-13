

/*
    Times in the timetable must be 'hh:mm:ss'
*/
var timetable = [
    ['09:58:00', '09:58:15'], // '10:03:45'
    ['10:30:00', '10:33:00']
];


// Definition of ClockMechanism object
function ClockMechanism() {
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS
    this.timeOffset = 0;  // difference between real "now" and fake Clock time
    this.months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    this.timetable_s = [];  // a 1D array of timetable times.
    this.timetablePosition = 0;  // indicator of which time step we're looking at
    this.clockSpeed = 1;  // seconds per second
    this.hour = 0;  // The hour at any given point in time
    this.minute = 0;  // The minute at any given point in time
    this.second = 0;  // The second at any given point in time
    this.fastClockSpeed = 1200; // 600 times normal == advance 10 mins every second
    this.tickInterval = 16;  // 16 milliseconds, approx 60 times/second



    this.setup = function(timetable_in) {
        this.convertTimetable(timetable_in);
        this.calculateStartOffset(timetable_in[0][0])
    }

    /*
        Convert timetable in 'hh:mm:ss' into a timetable in seconds
        since midnight; more useful for further calculations
    */
    this.convertTimetable = function(timetable_in) {
        var time_str, parts, hours, minutes, seconds;
        var new_tt_index = 0;
        for (var row = 0; row < timetable_in.length; row++) {
            secs = this.convertHhmmssToSeconds(timetable_in[row][0]);
            this.timetable_s[new_tt_index++] = {'speed': 'normal', 'time': secs};
            secs = this.convertHhmmssToSeconds(timetable_in[row][1]);
            this.timetable_s[new_tt_index++] = {'speed': 'fast', 'time': secs};
        }
        // add a "normal" speed on the end.
        this.timetable_s[new_tt_index++] = {'speed': 'normal', 'time': secs+30};
    }

    /*
        Calculate the time to be drawn.
        Will be called every tick.

        uses this.timeOffset; the difference in seconds between the time to
        draw and real-world-time.

        Sets internal properties (for use in tick()) and returns them too.
    */
    this.getTime = function() {
        var now = new Date(new Date().getTime() - this.timeOffset * 1000);
        var isAccelerated = false;
        this.hour = now.getHours();
        this.minute = now.getMinutes();
        this.second = now.getSeconds();

        // pre-tick operations: before drawing the clock at each tick
        if (this.clockSpeed > 1) {
            isAccelerated = true;
        }
        return [this.hour, this.minute, this.second, now.getMilliseconds(), isAccelerated];
    }

    /*
        Convert a string "hh:mm:ss" into number of seconds.
    */
    this.convertHhmmssToSeconds = function(in_str) {
        var parts = in_str.split(':');
        var hours = parseInt(parts[0]) * 3600;
        var minutes = parseInt(parts[1]) * 60;
        var seconds = hours + minutes + parseInt(parts[2]);
        return seconds;

    }

    /*
       Read the initial time from the Timetable and calculate our offset from
       real time.
       start is the start time as a string: "hh:mm:ss"
    */
    this.calculateStartOffset = function(start) {
        now = new Date();
        // Use the fact that 'start' is already hh:mm:ss to
        // create a new Date from a string.
        var fakeDate = now.getDate() + " " + this.months[now.getMonth()] + " " +
                       now.getFullYear() + " " + start;
        var appTimeStart = new Date(fakeDate);
        this.timeOffset = (now.getTime() - appTimeStart.getTime()) / 1000;
        this.timetablePosition = 0;
    }

 
    
    /*
        Handle a single "tick". cater for accelerated time
    */
    this.tick = function() {
        if (this.clockSpeed > 1) {
            // clock advances by 1s anyway.
            this.timeOffset -= this.clockSpeed;
        }
        // Have we hit a "boundary" time when we need to change speed?
        if ( typeof this.timetable_s[this.timetablePosition+1] == 'undefined') {
            this.clockSpeed = 1;
        }
        else if ((this.hour*3600 + this.minute * 60 + this.second) >
                this.timetable_s[this.timetablePosition+1]['time']) {
            // console.log("YOU HAVE HIT A BOUNDARY");
            this.timetablePosition++;
            // console.log(this.timetable_s[this.timetablePosition]['time'],
            //            "<=>", (this.hour*3600 + this.minute * 60 + this.second) );

            if (this.timetable_s[this.timetablePosition]['speed'] == 'fast') {
                this.clockSpeed = (this.tickInterval / 1000) * this.fastClockSpeed;
            }else{
                this.clockSpeed = 1;
            }
            console.log("Clock speed is now", this.clockSpeed);
        }



    }
}

// Definition of ClockFace object
// Interface: constructor(elt, mech), setup() and draw()
function DigitalClockFace(elementId, mechanism) {
    this.elementId = elementId;
    this.mech = mechanism;

    this.setup = function() {
    }

    /*
        Draw the clock face at this tick.
        calls mech.getTime() to work out the time, then mech.tick()
        to advance the time.
        This method is expected to be called every animation frame.
    */
    this.draw = function() {
        var hms = this.mech.getTime();
        var h = hms[0], m=hms[1], s=hms[2];

        document.getElementById(this.elementId).innerHTML = this._padStart(h) + ":" + this._padStart(m) + ":" + this._padStart(s);
        this.mech.tick();
    }

    /*
        zero-pad a value (only intended for numbers up to 60) 6 => 06
    */
    this._padStart = function(num) {
        return ('0'+num).slice(-2);
    }
}

/*
    Analogue Clock face
    Clock appearance from
    https://www.w3schools.com/graphics/canvas_clock_start.asp
*/
function AnalogueClockFace(canvasElementId, mechanism) {
    this.elementId = canvasElementId;
    this.mech = mechanism;
    this.smoothSeconds = true;

    this.setup = function() {
        var canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        radius = canvas.height / 2;
        this.ctx.translate(radius, radius); // remap 0,0 to the centre of the canvas.
        radius = radius * 0.90;
        this.radius = radius;

        this.hourHandLength = radius*0.5;
        this.hourHandWidth = radius*0.07;
        this.minuteHandLength = radius*0.8;
        this.minuteHandWidth = radius*0.07;
        this.secondHandLength = radius*0.9;
        this.secondHandWidth = radius*0.02;

        // used to keep second hand still when accelerated.
        this.lastSeconds = 0;
    }

    /*
        Draw the clock face at this tick.
        calls mech.getTime() to work out the time, then mech.tick()
        to advance the time.
        This method is expected to be called every animation frame.
    */
    this.draw = function() {
        var hms = this.mech.getTime();
        var h = hms[0], m=hms[1], s=hms[2];

        if (this.smoothSeconds) {
            var ms = hms[3];
        }else{
            var ms = 0;
        }
        if (hms[4]) {  // accelerated mode
            s = this.lastSeconds;
            ms = 0;
        }else{
            this.lastSeconds = s + 1;
        }

        this._drawFaceBackplate();
        this._drawNumbers();
        this._drawTime(h, m, s + (ms/1000));
    }

    /*
        Draw the backplate on which the clock face will 
        be drawn; background circle etc.
    */
    this._drawFaceBackplate = function() {
        var ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        var grad = ctx.createRadialGradient(
            0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.radius * 0.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    /*
        Draw the numbers around the clock face
    */
    this._drawNumbers = function() {
        var ang;
        var num;
        var ctx = this.ctx;
        ctx.font = this.radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for(num = 1; num <= 12; num++){
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -this.radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, this.radius * 0.85);
            ctx.rotate(-ang);
        }
    }
    this._drawTime = function(hour, minute, second) {
        hour=hour%12;
        hour=(hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        second=(second*Math.PI/30);
        this._drawHand(hour, this.hourHandLength, this.hourHandWidth);
        this._drawHand(minute, this.minuteHandLength, this.minuteHandWidth);
        this._drawHand(second, this.secondHandLength, this.secondHandWidth);
    }

    this._drawHand = function(pos, length, width) {
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

}

