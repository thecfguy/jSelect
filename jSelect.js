/*
 * ----------------------------- jSelect 0.1-------------------------------------
 * Simple and lightweight plugin to convert HTML Select box to Div based dropdown.
 *
 * Licensed under the Creative Commons License, Version 2.5 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 * 
 * http://creativecommons.org/licenses/by-sa/2.5/in/
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License.
 */
;(function($){
    $.fn.extend({ 
        jSelect : function(opts){
        	var defaults = { 
    				dropwidth : '260px',
    				listwidth : '260px',
    				listheight: '',
    				splitter : '|'
    			};
    		opts = $.extend({},defaults, opts);
			var onSelect = function(obj,jObj,index){
				return function(e){
					var multiSelect = obj.attr("multiple");
					if(multiSelect === undefined){
						$(this).parent().children().removeClass("js_selected");
						$(this).addClass("js_selected");
						obj.val($(obj.find("option")[index]).attr("value"));
					}
					else{
						if($(this).hasClass("js_selected")){
							$(this).removeClass("js_selected");
							$(obj.find("option")[index]).removeAttr("selected");
						}
						else{
							$(this).addClass("js_selected");
							$(obj.find("option")[index]).attr("selected","selected");
						}
						if(e)
							e.stopPropagation();
					}
					
					var selectedText = new Array();
					jObj.find('.js_selected > .js_label').each(function(){
						selectedText.push($(this).text());
					});
					$(".js_selectedText",jObj).html(selectedText.join(','));
					obj.trigger('change');
				}
			};
			//Replicate value
			return this.each(function(){
				var $select = $(this);
				//Check for dropdown already created
				if($select.hasClass("jSelect")){
					return;
				}
				var $jdrop = $("<div class='js_dropdown'><div class='js_selectedText'></div><span class='js_dropdownarrow'/></div>").css({'width':opts.dropwidth});
				$select.after($jdrop);
				$select.addClass('jSelect');
				$jdrop.on('click',function(e){
					$(".js_options").not($(this).find(".js_options")).hide();
					$(".js_options",$(this)).toggle();
					$(".js_dropdownarrow").not($(this).find(".js_dropdownarrow")).removeClass('js_dropon');
					$(".js_dropdownarrow",$(this)).toggleClass('js_dropon');
					e.stopPropagation();
				});
				var generateHTML = function($obj,options,index){
					var values = $select.val()===null?[]:$select.val();
					$obj.children().each(function(i){
						var $this = $(this);
						var tagname = $this.prop("tagName");
						if(tagname === 'OPTGROUP'){
							var option = $("<li/>").addClass('js_optiongroup').html($(this).attr('label'));
							option.on('click',function(e){e.stopPropagation();});
							options.append(option);
							options = generateHTML($this,options,index);
						}
						else{
							var text = $this.html();
							var htmlText = "";
							if(opts.splitter !== ''){
								text = text.split(opts.splitter);
								htmlText = text[1];
								text = text[0];
							}
							var option = $("<li/>").addClass('js_option').html($("<span/>").addClass('js_label').html(text));
							option.on('click',onSelect($select,$jdrop,index[0]++));
							if(htmlText != ''){
								$("<div/>").html($("<span/>").html(htmlText).text()).on('click',function(e){e.stopPropagation();}).appendTo(option);
							}
							if(values.indexOf($(this).attr('value')) != -1){
								option.addClass('js_selected');
							}
							options.append(option);
						}
					});
					return options;
				};
				var loadSelect = function(){
					$jdrop.remove('.js_options');
					var options = $("<ul>").addClass("js_options").css({'width':opts.listwidth,'height':opts.listheight});
					options = generateHTML($select,options,[0]);
					var selectedText = new Array();
					options.find('.js_selected>.js_label').each(function(){
						selectedText.push($(this).text());
					});
					$(".js_selectedText",$jdrop).html(selectedText.join(','));
					$jdrop.append(options);
				};
				$select.hide();
				loadSelect();
				$('body').on('click', function () {
					$(".js_options",$jdrop).hide();
					$(".js_dropdownarrow",$jdrop).removeClass('js_dropon');
                });
			});
        }
    });
})(jQuery);