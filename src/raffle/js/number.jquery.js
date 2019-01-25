;(function(window, document, $, undefined){
	
	$('.inputnumber').each(function(){
		var $this = $(this),
			$up = $(".up", $this),
			$down = $(".down", $this),
			$input = $("input[type=number]", $this),
			val = parseFloat($input.val()) ? parseFloat($input.val()) : 0,
			step = parseFloat($input.attr("step")) ? parseFloat($input.attr("step")) : 1,
			ani = 0,
			updown = 0,
			pause = 250,
			speed = 50,
			setDownUpVal = function(type){
				if($input[0].disabled){
					return;
				}
				var virt = parseFloat($input.val()) ? parseFloat($input.val()) : 0;
				val = virt;
				switch(type){
					case 'min':
						if(parseFloat($input.attr("min"))){
							var min = parseFloat($input.attr("min"));
							virt = val - step;
							val = virt < min ? val : virt;
						}else{
							val = val - step;
						}
						break;
					case 'max':
						if(parseFloat($input.attr("max"))){
							var max = parseFloat($input.attr("max"));
							virt = val + step;
							val = virt > max ? val : virt;
						}else{
							val = val + step;
						}
						break;
					default:
						break;
				}
				$input.val(val).trigger('input');
			};
		$input.on("input change", function(e){
			val = parseFloat($input.val()) ? parseFloat($input.val()) : 0;
		});
		$down.on("click", function(e){
			e.preventDefault();
			return !1;
		}).on("mousedown touchstart", function(){
			clearInterval(ani);
			clearTimeout(updown);
			setDownUpVal('min');
			updown = setTimeout(function(){
				ani = setInterval(function(){
					setDownUpVal('min');
				}, speed);
			}, pause);
		});
		$up.on("click", function(e){
			e.preventDefault();
			return !1;
		}).on("mousedown touchstart", function(e){
			if(e.type == 'mousedown'){
				if(e.which != 1){
					return;
				}
			}
			clearInterval(ani);
			clearTimeout(updown);
			setDownUpVal('max');
			updown = setTimeout(function(){
				ani = setInterval(function(){
					setDownUpVal('max');
				}, speed);
			}, pause);
		});
		$(document).on('mouseup touchend touchcancel', function(e){
			clearInterval(ani);
			clearTimeout(updown);
		}).on("mouseleave", ".up, .down", function(e){
			clearInterval(ani);
			clearTimeout(updown);
		});
	});
}(window, document, window.jQuery || jQuery));