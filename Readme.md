

# A clock for your Model Railway

A clock for your Model Railway, which 
accelerates in the periods where no train is running.

You would run this clock inside a web
browser on a laptop or Raspberry Pi where
it can be seen by the public and operators.

It allows you to run to timetable, while keeping
things moving. In periods where your timetable
says there are no trains, the clock runs fast,
until a point where a train is about to appear.

## How it works

To set up the clock, you need to create a timetable, to 
tell the clock when to go at normal time and when to run fast.

This goes in a &lt;script&gt; block at the top of your HTML page.

e.g.
```
    var timetable = [
        ['09:00:00', '09:05:00'], 
        ['10:30:00', '10:33:00']
    ];```

When the page loads, a lost of the "slow-down" and "speed-up"
times is calculated, along with the offset between real-world-time
and the time your timetable starts at.

When the clock reaches a "speeding up" time, it will run fast until
the next time entr is reached. In the example above, the clock will
run fast between 09:05:00 and 10:30:00

Start times may need to be adjusted to cater for accelerated clock time.
e.g. start 15s before you need to.
TODO: work out what to say about the end-end time.
e.g. add a 4-hour run-off block? or will the clock stop?
The time when the clock slows down may be a while after the stated time
because the clock needs to slow down. (about 20-30s with current settings)


<!-- ================================================================ -->

<h2>Technical Notes</h2>

<p>
The original Analogue Clock is based on 
<a href="https://www.w3schools.com/graphics/canvas_clock_start.asp">https://www.w3schools.com/graphics/canvas_clock_start.asp</a>
</p>

<p>
There are zillions of other Javascript clocks out there. Here are some I like the look of:
<ul>
<li><a href="https://codepen.io/ky0suke/pen/MyNXWX">https://codepen.io/ky0suke/pen/MyNXWX</a> - beautiful clock, includes click sound.</li>
<li><a href="http://www.javascriptkit.com/script/script2/css3analogclock.shtml">http://www.javascriptkit.com/script/script2/css3analogclock.shtml</a>
    CSS 3 analog clock, smooth second hand (JS to move the hands!)</li>
<li><a href="http://www.encodedna.com/html5/canvas/simple-analog-clock-using-canvas-javascript.htm"
    >http://www.encodedna.com/html5/canvas/simple-analog-clock-using-canvas-javascript.htm</a>
    another tutorial with a nice-looking clock.</li>
<li><a href="http://randomibis.com/coolclock/">http://randomibis.com/coolclock/</a> is a
    customisable Canvas clock</li>
<li><a href="https://github.com/sganz/analogclock">https://github.com/sganz/analogclock</a> a
    clock with many nice features</li>
<li><a href="http://www.aspdotnet-suresh.com/2013/04/8-best-jquery-clock-plugins-analog.html"
    >http://www.aspdotnet-suresh.com/2013/04/8-best-jquery-clock-plugins-analog.html</a>
    8 different JS clocks reviewed</li>
<li>Now that <tt>ClockMechanism</tt> is reporting Milliseconds, it should be possible to create
    a Mondaine clock. Each second the second hand moves 1.5/60 of a circle further than it would
    on a normal clock, and pauses for 1.5s when it reaches 60s.</li>
</ul>
</p>

<p>
    It's OK to redraw the canvas all the time (see
    <a href="https://stackoverflow.com/questions/7365436/erasing-previously-drawn-lines-on-an-html5-canvas"
    >this stack overflow</a>), unless doing so results in a massive performance it (see
    <a href="https://stackoverflow.com/questions/5805705/is-it-asking-too-much-of-canvas-to-redraw-everything-inside-of-the-game-loop"
    ><i>this</i> stack overflow</a>)
</p>

<p>
    window.requestAnimationFrame() is a bit like window.setInterval() or window.setTimeout(), except it repeatedly
    calls your function at the refresh rate (e.g. 60 times a second)
</p>

<!-- ================================================================ -->


<h2>To Do</h2>
<p>
    
</p>
<ul>
    <li>Get the window size to draw the clock full-screen.
        (currently hard-coded in the HTML)</li>
        
    <li>make sure the timetable is chronological</li>

</ul>
