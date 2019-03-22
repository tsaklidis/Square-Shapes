var DEBUG = true;
var FIELD = {
	x_axis:30,
	y_axis:20,
	id: "#field"
};
var dice_one = dice_two = 0;

function blink(that, ms){
	$(that).fadeIn(ms).fadeOut(ms).fadeIn(ms).fadeOut(ms).fadeIn(ms);
};

function FIeldCreate(field){
	// Generates the field
	var table = $(field.id);
	for (var y = 0; y < field.y_axis; y++) {
		var tr = $('<tr>');		
			for (var x = 0; x < field.x_axis; x++) {
				var td = $('<td></td>');
				td.attr('data-y', y);
				td.attr('data-x', x);
				td.addClass('empty');
				td.appendTo(tr);
			}
		tr.appendTo(table);
	}
};

function validate_square(data){
	// console.log(data);

	var minX, maxX, minY, maxY, emv;
	var all_y = [];
	var all_x = [];
	var selected_squares = data.length;

	$.each(data, function (index, pair) {
		// console.log(pair);
		all_y.push(pair.y);
		all_x.push(pair.x);


	});

	minX = Math.min.apply(null, all_x);
	maxX = Math.max.apply(null, all_x);

	minY = Math.min.apply(null, all_y);
	maxY = Math.max.apply(null, all_y);

	emv = (maxX - minX + 1) * (maxY - minY + 1);

	if (DEBUG) {
		console.log("all_y:", all_y);
		console.log("all_x:", all_x);
		console.log("emv:", emv)
		console.log("minX:", minX, "maxX:", maxX, "minY:", minY, "maxY:", maxY)
	}

	// if all x or all x are the same then we have a line hor or ver
	var equal_y = all_y.every( (val, i, arr) => val === arr[0] );
	var equal_x = all_x.every( (val, i, arr) => val === arr[0] )

	if (emv == selected_squares && !equal_y && !equal_x) {return true;}
	else{return false;}

};

function accept_shapes(){
	$('.clicked').each(function(index, box) {
		$(box).removeClass('clicked').removeClass('empty').addClass('accepted player');

	});
	// update score
	var score = $('.player').length
	$('#score').html(score);
};

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function set_box(pair){
	$('*[data-x='+ pair.x +'][data-y='+ pair.y +']').addClass("accepted computer").removeClass("empty");
}

function computer_play(){
	var pairs = [];
	var to_fill;
	$('.empty').each(function(index, td) {
		var tmp_y = $(td).attr('data-y');
		var tmp_x = $(td).attr('data-x');
		var pair = {
			"y":parseInt(tmp_y),
			"x":parseInt(tmp_x)
		}
		pairs.push(pair);

	});

	dice_one = Math.floor(Math.random() * 6) + 1  
	dice_two = Math.floor(Math.random() * 6) + 1  

	result = dice_one * dice_two;
	// now computer can fill squares
	console.log(pairs)
	to_fill = getRandom(pairs, result)

	$.each(to_fill, function (index, pair) {
		set_box(pair)
	});

	console.log("will fill ", result, " squares")
	console.log("to fill:", to_fill)

};

function init_game(){
	FIeldCreate(FIELD);

};

$(document).ready(function(){

	init_game();


	$('#field td').click(function(){
		var locked = $( this ).hasClass( "accepted" );
		if ( !locked ) {
			if ( $( this ).hasClass( "clicked" ) ) {
				$(this).removeClass('clicked');
			}
			else{
				$(this).addClass('clicked');
			}
		}

	}); 

	$('#save').click(function(){
		var pairs = [];
		$('.clicked').each(function(index, td) {
			var tmp_y = $(td).attr('data-y');
			var tmp_x = $(td).attr('data-x');
			var pair = {
				"y":parseInt(tmp_y),
				"x":parseInt(tmp_x)
			}
			pairs.push(pair);

		});
		if (pairs.length < 1) {
			blink('#field', 100)
		}
		else{
			if (validate_square(pairs)) {
				console.log("Shape accepted");
				accept_shapes();
			}
			else{
				console.log("Not accepted shape");
				blink(".clicked", 300);
			}

		}
	}); 

});