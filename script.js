// Simon Game for Free Code Camp
	// Uses jQuery, jQuery UI, jQuery Color, Material Design Lite, and Google Fonts
	// Functionality: 
		// On click to square
		// Gives feedback for that square
		// Checks if that square matches the pattern at that index
		//		If so: checks if the index == the length of the pattern, the turn is over
		//				Checks if that turn was last turn
		//						If so: runs "win" functionality
		//						If turn is NOT the last turn: increments round number, runs function to increase and display pattern
		//		If turn is NOT over: increments index
		// If the square does NOT match the pattern at that index: checks if in strict mode
		//		If so: player lost, runs "lose" functionality
		//		If NOT in strict mode: runs "mistake" functionality (notifies player, replays pattern)

// sounds
	var beepone= $("#beepOne")[0];
	var beeptwo= $("#beepTwo")[0];
	var beepthree= $("#beepThree")[0];
	var beepfour= $("#beepFour")[0];

// the correct pattern
var pattern=[];

// the pattern the User has entered
var userPattern=[];

// the round number (finish round 20 to win)
var round=1;

// the number the User just clicked
var clicked=0;

// the current index of the pattern
var index=0;

// is strict on or off?
var strict= false;



// plays the audio and changes the color
// for the selected button
function choose(id){
	
	// determine which sound to play
	function beep(){
			switch(id){
			case "one":
				beepone.play();
				break;
			case "two":
				beeptwo.play();
				break;
			case "three":
				beepthree.play();
				break;
			case "four":
				beepfour.play();
				break;
		}
	};
	
	// make the element's background flash dark
		// uses jQuery Color plugin 
		// get element's background color's lightness
		// and decrease/increase it at a rate of 200ms
	var color = $.Color($("#"+id).css('backgroundColor'));
	//function darken(){
		$("#"+id).animate({backgroundColor: color.lightness('+=0.55')}, 200, function() {
        $("#"+id).animate({backgroundColor: color}, 200);
    });
	//};

	//setTimeout(darken, 400);
	setTimeout(beep, 300);
};

// generate a random number, 1 through 4
	// will be called every AI turn
	// makes the pattern that the User must copy
function randomNumber(){
	// pick the next number
	var num= Math.floor(Math.random() * (4 - 1 +1)) + 1;
	console.log("new #: "+ num);
	// put it in the pattern
	pattern.push(num);
	console.log(pattern);
	max=pattern.length;
};

// show the full pattern in order as it currently exists
	// plays at the start of computer's turn
function showPattern(){
	// test that it's working
	console.log("showPattern");
	console.log(pattern);
	
	// for every entry in the pattern
	for(var i=0; i<pattern.length; i++){
		// this is an immediately-invoked function 
		// that will be called in the setTimeout
		(function(i){
        setTimeout(function(){
					switch(pattern[i]){
						case 1:
							choose("one");
							break;
						case 2:
							choose("two");
							break;
						case 3:
							choose("three");
							break;
						case 4:
							choose("four");
							break;
					};
				}, 750 * i)
		}(i));
	};
	
	
};

// resets the game to a blank, starting state
function reset(modal){
	// reset all the information
	pattern=[];
	userPattern=[];
	round=1;
	$("#number").html(round+'/20');
	clicked=0;
	index=0;
	// start a new game
	randomNumber();
	// visual context
	setTimeout(function(){
		$("#status").html("Watch");
		$(modal).show("drop");
	}, 500);
	
	setTimeout(showPattern, 800);
	// after pattern is shown,
	// visual feedback for "Your Turn" status
	setTimeout(function(){
			$("#status").html("Your Turn");
			$(modal).hide("drop");
		}, 1200);
};

function curtainDrop(){
	// visual feedback for "Watch" status
		$("#status").html("Watch");
		$("#curtain").show("drop");
};

// prevents selecting text in buttons
function clearSelection() {
	if(document.selection && document.selection.empty) {
		document.selection.empty();
	} else if(window.getSelection) {
		var sel = window.getSelection();
		sel.removeAllRanges();
	}
}

$(document).ready(function(){
	console.log("start");
	
	// on first opening window, show "start" modal
	$(".startModal").show("drop");
	$(".start").show("drop");
	$("#startBtn").click(function(){
		// hide "start" modal
		$(".start").hide("drop");
		// generate first number
		randomNumber();
		// visual context
		setTimeout(function(){
			$(".start").hide("drop");
		}, 500);
		// show the pattern
		setTimeout(showPattern, 500);
		setTimeout(function(){
			$("#status").html("Your Turn");
			$(".startModal").hide("drop");
		}, 1000*pattern.length);
	});
	
	
	// is it in strict?
	console.log("strict? "+strict);
	// what's the pattern?
	console.log("pattern:" +pattern);
	
	// on hover over strict switch, show tooltip
	$(".strict").mouseenter(function(){
		$(".tooltip").css({
			'color':'white',
			'background-color': 'rgba(0,0,0,0.8)',
			'text-align':'center',
			'position': 'fixed',
			'top': '40%',
			'left': '35%',
			'display' : 'block',
			'width' : '30%',
			'float' : 'left',
			'padding': '10px 10px',
			'z-index': '1',
		});
  });	
	
	// on exit, hide tooltip
	$(".strict").mouseleave(function(){
		$(".tooltip").hide("drop");
	});
	
	// if strict is clicked, show "restart" modal
	$("#switch").click(function(){
		
		strict= strict== true? false: true;
		$("#curtain").show("drop");
		// generate first number
		randomNumber();
		// visual context
		setTimeout(function(){
			$(".start").hide("drop");
		}, 500);
		// show the pattern
		setTimeout(showPattern, 500);
		setTimeout(function(){
			$("#status").html("Your Turn");
			$("#curtain").hide("drop");
		}, 1000*pattern.length);
	});
	
	// on click to "new game" button
	$("#resetBtn").click(function(){
		// show "restart" modal
		$(".restartModal").show("drop");
		$(".restart").show("drop");
	});
	
	// on click to "Yes" button in "restart" modal,
		// switch "strict" value
		// start new game
	$("#yes").click(function(){

		// hide modal
		$(".restart").hide("drop");
		// start new game
		reset(".restartModal");

	});
	
	// on click to "No" button in restart modal
	$("#no").click(function(){
		// hide modal
		$(".restartModal").hide("drop");
		$(".restart").hide("drop");

	});
	
	
	// on click to square
	// ***  Game Logic and Verification  *** \\
	$(".square").click(function(){
		
		// prevent selecting text in buttons
		clearSelection();
		
		// on click, flash + play selected element
		var id= this.id;
		choose(id);
		
		// clicked= this id
		switch(id){
			case "one":
				clicked=1;
				break;
			case "two":
				clicked=2;
				break;
			case "three":
				clicked=3;
				break;
			case "four":
				clicked=4;
				break;
		}
		
		console.log("clicked: "+clicked);
		
		// if clicked== pattern[index] (if it matches)
		if(clicked==pattern[index]){
			
			// "correct" visual feedback
			$("#status").html('<i class="material-icons">done</i>');
			// increment index (because they got it right)
			index++;
			
			if(index==pattern.length){ // if the index is the same length as the pattern
					// if they beat round 20
					if(round==20){
						// they won!
						
						// show the "win" modal
						setTimeout(function(){
							$(".winModal").show("drop");
							$(".win").show("drop");
						}, 400);
						// on click to winBtn, restart game
						$("#winBtn").click(function(){
							// hide modal
							$(".win").hide("drop");
							// enable the board
							// start new game
							reset(".winModal");
						});
					} else{ // otherwise, they haven't won yet, but they did beat this round
						// reset the index, so they start from the begining of the pattern
						index=0;
						// increase the round
						round++;
						// change the round in the counter
						$("#number").html(round+'/20')
						// generate a random # and add it to the pattern
						randomNumber();
						// visual feedback
						setTimeout(function(){
							$("#status").html("Watch");
							$("#curtain").show("drop");
						}, 500);
						// show the pattern
						setTimeout(showPattern, 1000);
						setTimeout(function(){
							$("#curtain").hide("drop");
							$("#status").html("Your Turn");
						}, pattern.length*1000);
					}
				}
		
		} else { // if the clicked button doesn't match the pattern at this index
				// they got it wrong
			// "incorrect" visual feedback
			$("#status").html('<i class="material-icons">clear</i>');
				// ((( "Wrong" setting goes here  )))

				if(strict==true){ // if it's in strict mode
					// show the "lose" modal
					$(".loseModal").show("drop");
					$(".lose").show("drop");
					
					// on click to loseBtn
					$("#loseBtn").click(function(){
						// hide "lose" modal
						$(".lose").hide("drop");
						reset(".loseModal");
					});
				} else { // if it's NOT in strict mode
					// show "mistake" modal
					setTimeout(function(){
						$(".mistakeModal").show("drop");
						$(".mistake").show("drop");
					}, 800);
					// on click to mistakeBtn
					$("#mistakeBtn").click(function(){
						// hide "mistake" modal
						$(".mistake").hide("drop");
						// visual feedback for "Watch" status
						$("#status").html("Watch");
						// show the pattern again
						setTimeout(showPattern, 800);
						setTimeout(function(){
							$(".mistakeModal").hide("drop");
						}, pattern.length*1000);
					});
				}
			
		}
	});
	
});

