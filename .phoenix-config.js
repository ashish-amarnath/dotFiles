var 	mCmd = ['ctrl','alt'],
			sCmd = ['ctrl','alt','shift'],
			padding = 0,
			nudge = 10,
			cols = 2,
			rows = 2;

var keys = [];

function start() {
  Phoenix.log('Started')
}

function bind(key, mods, callback) {
    keys.push(new Key(key,mods,callback));
		// if number then also the pad number
		if (/^\d+$/.test(key))
		{
			key = 'keypad'+key
			//keys.push(Phoenix.bind(key,mods,callback));
      keys.push(new Key(key,mods,callback));
		}
}

/*
var active = false;
api.bind('`',mCmd, function() {
	if (!active) {
		enableKeys();
	} else {9
		disableKeys();
	}
});
*/

bind('right', mCmd, rightOneMonitor);
bind('left', mCmd, leftOneMonitor);

/*
^Alt - 
_____________			upper left 7 		bottom left 1
| 7 | 8 | 9 |			all top 8 			all bottom 2
|---|---|---|			upper right 9 	bottom right 3
| 4 | 5 | 6 |			all left 4
|---|---|---|			fullscreen 5
| 1 | 2 | 3 |			all right 6
-------------
*/
bind('7', mCmd, function() { positionOnCurrentWindow(2,2,0,0,1,1); });
bind('8', mCmd, function() { positionOnCurrentWindow(2,2,0,0,2,1); });
bind('9', mCmd, function() { positionOnCurrentWindow(2,2,1,0,1,1); });
bind('4', mCmd, function() { positionOnCurrentWindow(2,2,0,0,1,2); });
bind('5', mCmd, function() { positionOnCurrentWindow(2,2,0,0,2,2); });
bind('6', mCmd, function() { positionOnCurrentWindow(2,2,1,0,1,2); });
bind('1', mCmd, function() { positionOnCurrentWindow(2,2,0,1,1,1); });
bind('2', mCmd, function() { positionOnCurrentWindow(2,2,0,1,2,1); });
bind('3', mCmd, function() { positionOnCurrentWindow(2,2,1,1,1,1); });


/*
^AltShift - 
_____________			upper left 7 		bottom left 1
| 7 | 8 | 9 |			all top 8 			all bottom 2
|---|---|---|			upper right 9 	bottom right 3
| 4 | 5 | 6 |			all left 4
|---|---|---|			fullscreen 5
| 1 | 2 | 3 |			all right 6
-------------
*/
bind('7', sCmd, function() { positionOnCurrentWindow(3,3,0,0,1,1); });
bind('8', sCmd, function() { positionOnCurrentWindow(3,3,1,0,1,1); });
bind('9', sCmd, function() { positionOnCurrentWindow(3,3,2,0,1,1); });

bind('4', sCmd, function() { positionOnCurrentWindow(3,3,0,1,1,1); });
bind('5', sCmd, function() { positionOnCurrentWindow(3,3,1,1,1,1); });
bind('6', sCmd, function() { positionOnCurrentWindow(3,3,2,1,1,1); });

bind('1', sCmd, function() { positionOnCurrentWindow(3,3,0,2,1,1); });
bind('2', sCmd, function() { positionOnCurrentWindow(3,3,1,2,1,1); });
bind('3', sCmd, function() { positionOnCurrentWindow(3,3,2,2,1,1); });

/*
^AltShift -

Grow/Shrink arrows 
*/
bind('g', sCmd, growMode)
bind('s', sCmd, shrinkMode)


function growMode()
{
  Phoenix.notify("Grow Mode")

  bind('up', sCmd,    grow(0,3,3));
  bind('right', sCmd, grow(1,3,3));
  bind('down', sCmd,  grow(2,3,3));
  bind('left', sCmd,  grow(3,3,3));
}

function shrinkMode()
{
  Phoenix.notify("Shrink Mode")

  bind('up', sCmd,    shrink(0,3,3));
  bind('right', sCmd, shrink(1,3,3));
  bind('down', sCmd,  shrink(2,3,3));
  bind('left', sCmd,  shrink(3,3,3));
}

function grow(dir, col, row)
{
  var win = Window.focused()
  var frame = win.frame();
  var screenFrame = win.screen().frameInRectangle();
  var cw = screenFrame.width/col;
  var rh = screenFrame.height/row;
  var rows = new Array();
  var cols = new Array();

  for (y = 0; y < row; y++) {
    rows.push(rh*y)
  }
  for (x = 0; x < col; x++) {
    cols.push(cw*x)
  }

  Phoenix.log('grow dir '+dir+' at '+frame.y)

  switch(dir) {
    case 0:
      for (y=0;y<row;y++) {
        if (y < row-1) {
          cy = rows[y];
          ny = rows[y+1];
          
        }
      }
      break;
    case 1:
      for (y=0;y<row;y++) {
        if (frame.y == cols[y])
        {
          if (y!=0) frame.y = cols[y-1]
        }
      }
      break;
    case 2:
      for (y=0;y<row;y++) {
        if (frame.y == rows[y])
        {
          if (y!=row-1) frame.y = rows[y+1]
        }
      }
      break;
    case 3:
      for (y=0;y<row;y++) {
        if (frame.y == cols[y])
        {
          if (y!=0) frame.y = cols[y-1]
        }
      }
      break;

  }
}

function shrink(dir, col, row)
{

}


function positionOnCurrentWindow(noc, nor, startCol,startRow,width,height)
{
	var win = Window.focused();
	var frame = win.frame();
	var screenFrame = win.screen().frameInRectangle();
	var colWidth = screenFrame.width/noc;
	var rowHeight = screenFrame.height/nor;
	frame.x = screenFrame.x + (colWidth*startCol);
	frame.y = screenFrame.y + (rowHeight*startRow);
	frame.width = (colWidth * width);
	frame.height = (rowHeight * height);
  Phoenix.log("x:"+frame.x+" y:"+frame.y+" width:"+frame.width+" height:"+frame.height);
  win.setFrame(frame);
}

// Move windows between monitors

function moveToScreen(window, screen) {
  Phoenix.log('moving screen!')

  if (!screen) return;
  if (!window) return;

  var frame = window.frame();
  var oldScreenRect = window.screen().visibleFrameInRectangle();
  var newScreenRect = screen.visibleFrameInRectangle();
  var xRatio = newScreenRect.width / oldScreenRect.width;
  var yRatio = newScreenRect.height / oldScreenRect.height;

  var mid_pos_x = frame.x + Math.round(0.5 * frame.width);
  var mid_pos_y = frame.y + Math.round(0.5 * frame.height);

  window.setFrame({
    x: (mid_pos_x - oldScreenRect.x) * xRatio + newScreenRect.x - 0.5 * frame.width,
    y: (mid_pos_y - oldScreenRect.y) * yRatio + newScreenRect.y - 0.5 * frame.height,
    width: frame.width,
    height: frame.height
  });
}


function circularLookup(array, index) {
  if (index < 0)
    return array[array.length + (index % array.length)];
  return array[index % array.length];
}
function rotateMonitors(offset) {
  var win = Window.focused();
  var destScreen = win.screen().next();
  if (offset < 0) destScreen = win.screen().previous();

  if (!win) return;
  if (win.screen() === destScreen) return;

  moveToScreen(win, destScreen);
}

function leftOneMonitor() {
  rotateMonitors(-1);
}

function rightOneMonitor() {
  rotateMonitors(1);
}

/*
// Disables all remembered keys.
function disableKeys() {
  active = false;
  _(keys).each(function(key) {
    key.disable();
  });
  api.alert("done", 0.5);
}
*/
// Enables all remembered keys.
function enableKeys() {
  active = true;
  _(keys).each(function(key) {
    key.enable();
  });
}
enableKeys();
/**/
  Phoenix.log('Started')
