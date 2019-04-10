var DEBUG = true;
var FIELD = {
	x_axis:31,
	y_axis:21,
	id: "#field"
};
var dice_one = dice_two = 0;
var available = [2,3,4,5,6];
var cmp_tries = 0;
var squares_left;


function blink(that, ms, times){
	for (var i = 0; i < times; i++) {
		$(that).fadeIn(ms).fadeOut(ms);
	}
	$(that).fadeIn(ms);
}

function roll_dices(){
	console.log("Rolling...")
	ar_dice_one = getRandom(available, 1)
	ar_dice_two = getRandom(available, 1)

	dice_one = ar_dice_one[0];
	dice_two = ar_dice_two[0];

	$('#dice_one').attr('src', 'img/'+dice_one+'.png');
	$('#dice_two').attr('src', 'img/'+dice_two+'.png');

	// blink('#dice_wrp', 300, 2); 

	squares_left = dice_one * dice_two;
	console.log(dice_one, dice_two);
}

function FIeldCreate(field){
	// Generates the field
	var table = $(field.id);
	for (var y = -1; y < field.y_axis; y++) {
		var tr = $('<tr>');		
			for (var x = -1; x < field.x_axis; x++) {
				if (y==-1) {
					var td = $('<td class="cord">'+ x +'</td>');
				}
				else if(x==-1){
					var td = $('<td class="cord">'+ y +'</td>');
				}
				else{
					var td = $('<td></td>');
				}
				td.attr('data-y', y);
				td.attr('data-x', x);
				if(!td.hasClass('cord')){
					td.addClass('empty');
				}
				td.appendTo(tr);
			}
		tr.appendTo(table);
	}
	// roll the dices
	roll_dices();

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

	// if all x or all x are the same then we have a line hor or ver
	var equal_y = all_y.every( (val, i, arr) => val === arr[0] );
	var equal_x = all_x.every( (val, i, arr) => val === arr[0] )

	if (emv == selected_squares && !equal_y && !equal_x && squares_left==0) {return true;}
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
function check_box(x,y){
	if($('*[data-x='+ x +'][data-y='+ y +']').hasClass('empty')){
		return true
	}
	// console.log("Unavailable box:", x,y);
	return false
}
function set_box(x,y){
	if (check_box(x,y)) {
		$('*[data-x='+ x +'][data-y='+ y +']').addClass("accepted computer").removeClass("empty");
	}
}

function computer_play(){
	console.log("Cmp tries:", cmp_tries)
	cmp_tries = cmp_tries + 1;
	var pairs = [];
	var to_fill;
	
	var good = true;

	$('.empty').each(function(index, td) {
		var tmp_y = $(td).attr('data-y');
		var tmp_x = $(td).attr('data-x');
		var pair = {
			"y":parseInt(tmp_y),
			"x":parseInt(tmp_x)
		}
		pairs.push(pair);

	});

	// now computer can fill squares
	first_pair = getRandom(pairs, 1)

	// console.log("start cords:", first_pair[0].x, first_pair[0].x)
	// console.log("dice:", dice_one, dice_two)

	// check if box can be set

	var tmp_x = first_pair[0].x;
	var tmp_y = first_pair[0].y;
	for (var i = 0; i < dice_one; i++) {

		if(!check_box(tmp_x, tmp_y)){
			good = false;
		}
		
		for (var j = 0; j < dice_two; j++) {
			if (!check_box(tmp_x, tmp_y)) {
				good = false
			}
			tmp_x = tmp_x + 1;
		}
		tmp_x = first_pair[0].x;
		tmp_y = tmp_y + 1;

	}

	if (good) {
		tmp_x = first_pair[0].x;
		tmp_y = first_pair[0].y;
		for (var i = 0; i < dice_one; i++) {

			set_box(tmp_x, tmp_y)
			
			for (var j = 0; j < dice_two; j++) {
				set_box(tmp_x, tmp_y)
				tmp_x = tmp_x + 1;
			}
			tmp_x = first_pair[0].x;
			tmp_y = tmp_y + 1;

		}
		cmp_tries = 0;
	}
	else{
		if (cmp_tries < 100) {
			computer_play();
		}
		else{
			$('#comp_msg').css({"display":"block"}).html("Can't create any shapes, you play..."); blink("#comp_msg", 400, 2);
			$('#comp_msg').css({"display":"none"});
			roll_dices();
		}
	}

	var comp_score = $('.computer').length
	$('#comp_score').html(comp_score);
	roll_dices();

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
				squares_left = squares_left + 1;
				$(this).removeClass('clicked');
			}
			else{
				squares_left = squares_left - 1;
				$(this).addClass('clicked');
			}
		}
		


	}); 

	$('#save').click(function(){
		$('#comp_msg').html("");
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
			blink('#field', 100, 3)
		}
		else{
			if (validate_square(pairs)) {
				accept_shapes();
				roll_dices();
				computer_play();
				console.log("Shape accepted");
			}
			else{
				blink(".clicked", 300, 3);
				console.log("Not accepted shape");
			}

		}
		$('#comp_msg').html();
		cmp_tries = 0;
	}); 

	$('#skip').click(function(){
		roll_dices();
		computer_play();
		cmp_tries = 0;
	}); 



});