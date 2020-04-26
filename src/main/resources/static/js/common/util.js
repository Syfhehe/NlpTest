define(["jquery", "bootstrap", "validate", "validateAdditional"], function($, bootstrap) {
	$.fn.serializeObject = function() {
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};
	Date.prototype.format = function(format){
	   var o = {
	      "M+" :  this.getMonth()+1,  // month
	      "d+" :  this.getDate(),     // day
	      "h+" :  this.getHours(),    // hour
	        "m+" :  this.getMinutes(),  // minute
	        "s+" :  this.getSeconds(), // second
	        "q+" :  Math.floor((this.getMonth()+3)/3),  // quarter
	        "S"  :  this.getMilliseconds() // millisecond
	     };

	     if(/(y+)/.test(format)) {
	      format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	     }

	     for(var k in o) {
	      if(new RegExp("("+ k +")").test(format)) {
	        format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	      }
	     }
	   return format;
	};

	var util = {
		init: function() {
		    this.injectAjaxCall();
        this.addValidationMethods();
        this.validateForm();
		},
		injectAjaxCall: function() {
		  var _this = this;
      var $loading = $('#loading-indicator').hide();
      if (!$("#pipelineDashboard").length) {
        $(document).ajaxStart(function () {
          if($("#codereview-dashboard").length || $("div.coverage").length){
          }else{
            $loading.show();
          }
        }).ajaxSend(function (event, jqxhr, settings){
          var ajaxUrl = settings.url;
          if($("#codereview-dashboard").length){
            if(ajaxUrl.indexOf("compare")<0){
               $loading.show();
            }
          }
          if($("div.coverage").length) {
            if(ajaxUrl.indexOf("run?testCaseIds") != -1 || ajaxUrl.indexOf("sync") != -1) {
              $loading.show();
            }
          }
        }).ajaxStop(function (arg) {
          if ($("#checkstyle-dashboard").length) {
            if($("#checkstyleStatus").val() !== 'RUNNING') {
              $loading.hide();
            }
          } else if ($("#analyzer-dashboard").length) {
            if($("#analyzerStatus").val() !== 'RUNNING') {
              $loading.hide();
            }
          } else {
            $loading.hide();
          }
        }).ajaxComplete(function (event, xhr, settings) {
          if (xhr.status === 401){
            _this.hideModal();
            window.top.location = contextPath+"/login";
          } else if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
            var contentType = xhr.getResponseHeader("Content-Type");
            if (_this.isHTML(xhr.responseText)
                && contentType.indexOf("text/html") !== -1
                && $(xhr.responseText).find('#status').length > 0 
                && $(xhr.responseText).find('#status').text().indexOf("500") !== -1){
              _this.hideModal();
              $("body").html(xhr.responseText);
              if (window.top.document != this){
                $('nav').hide();
                $("footer").hide();
                $("#wrapper").addClass("wrapper-error");
              }
              _this.showStack();
            } else if (_this.isHTML(xhr.responseText)
                && contentType.indexOf("text/html") !== -1 
                && $(xhr.responseText).find('#wanrning_message_from_exception').length > 0 ){
              util.notification($(xhr.responseText).find('#wanrning_message_from_exception').text(),
               function() {},
                null, "warning-box");
            }
          }
        });
      }
		},
		isHTML: function(str) {
		  var doc = new DOMParser().parseFromString(str, "text/html");
		  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
		},
		isValidJSONString: function(str) {
		  if (typeof str === "string") {
  	    try {
  	        JSON.parse(str);
  	    } catch (e) {
  	        return false;
  	    }
		  }
      return true;
		},
		hideModal: function(){
		  $(".modal").removeClass("in");
		  $(".modal-backdrop").remove();
		  $('body').removeClass('modal-open');
		  $('body').css('padding-right', '');
		  $(".modal").hide();
		},
		showStack: function(){
		  $('#showStack').bind("click", function() {
		    if ($("#keterStackTrace").hasClass('hidden')) {
		      $("#showStack").text('Hide Stack <<');
		      $("#keterStackTrace").removeClass('hidden');
		    } else {
		      $("#showStack").text('Show Stack >>');
		      $("#keterStackTrace").addClass('hidden');
		    }
		  });
		},
    getQueryString: function(name) {
      var reg =  "/(\\#|\\&)" + name + "=([^\\&]+)/i";
      reg = eval(reg);
      var result = window.location.href.match(reg);
      if (result) {
          return result[2];
      }
      return null; 
    },
		addValidationMethods: function() {
		  $.validator.addMethod('validUsername', function (value) {
		    if (value) {
		      return /^[a-zA-Z\.@0-9\-_]{5,50}$/.test(value);
		    } else {
		      return true;
		    }
		  }, "Invalid username. The minimum length is 5. Only letters, digits, _, -, . and @ allowed.");
		  
			$.validator.addMethod("uniqueUserDisplayname", function(value, element) {
				var response = true;
				var configId = $("#bpmUserForm #configId").val();	
				var displayName= $("#bpmUserForm #displayName").val(); 	
				var bpmUserId = $("#bpmUserForm #bpmUserId").val();
				if(bpmUserId == "" || bpmUserId.length == 0){
				  bpmUserId = "-1";
				}
			  getAjax(contextPath + "/configuration/" + configId + "/bpmusers/"+ bpmUserId + "/display/"+ displayName, "", function(data, status) {
	          if (status === 'success') {
	            response = !data.result;
	          } else {
	            response = false;
	          }
	          }, false);
	        return response;
	      }, "Duplicate display name.");
			
			$.validator.addMethod("uniqueBpmUserName", function(value, element) {
        var response = true;
        var configId = $("#bpmUserForm #configId").val(); 
        var bpmUserId = $("#bpmUserForm #bpmUserId").val();
        var bpmUserName= $("#bpmUserForm #userName").val();  
        if(bpmUserId == "" || bpmUserId.length == 0){
          bpmUserId = "-1";
        }
        getAjax(contextPath + "/configuration/" + configId + "/bpmusers/"+ bpmUserId + "/bpmusername/"+ bpmUserName, "", function(data, status) {
            if (status === 'success') {
              response = !data.result;
            } else {
              response = false;
            }
            }, false);
          return response;
        }, "The bpm user name has already been registered!");
			
			$.validator.addMethod("uniqueGroupName", function(value, element) {
				var response = true;
				var projectId = $("#projectId").val();
        var commandId = $("div.command_id input.ida-control").val();
				if (commandId==''){
					commandId = -1;				
				}
				getAjax(contextPath + "/projects/" + projectId + "/commands/"+ commandId+ "/customcommand/" + value, "", function(data, status) {
					if (status === 'success') {
						response = !data.result;
					} else {
						response = false;
					}
			    }, false);
				return response;
			}, "Duplicate custom group name.");
			
			$.validator.addMethod("editUniqueGroupName", function(value, element) {
				var response = true;			
				var projectId = $("#projectId").val();						
				var groupId = $("#groupForm #groupId").val();
				if (groupId==''){
					groupId = -1;				
				}			
				getAjax(contextPath + "/projects/" + projectId +"/commands/"+ groupId+"/customcommand/" + value, "", function(data, status) {
					if (status === 'success') {
						response = !data.result;
					} else {
						response = false;
					}
			    }, false);
				return response;
			}, "Duplicate custom group name.");

			$.validator.addMethod("uniqueCaseName", function(value, element) {  
				var response = true;
				var testSuiteId; 
				var testCaseId = $("#caseEditForm #testCaseId").val();
				var url = contextPath + "/testsuites/";
				if (testCaseId.length != 0) {
					testSuiteId = $("#caseEditForm #testSuiteId").val();
				} else {
					testCaseId = -1;
					testSuiteId = $("#addCaseForm #addTestSuiteId").val();
				}
				url +=   testSuiteId + "/cases/" + testCaseId + "/casename/" + value + "/";	
			    getAjax(url, "", function(data, status) {
					if (status === 'success') {
						response = !data.result;
					} else {
						response = false;
					}
			    }, false);
				return response;
			}, "Duplicate case name.");

			$.validator.addMethod("uniqueSuiteName", function(value, element) {    
			   var testSuiteId = $("#suiteEditForm #testSuiteId").val();  
				getAjax(contextPath + "/testsuites/" + testSuiteId + "/suitename/" + value + "/", "", function(data, status) {
					if (status === 'success') {
						response = !data.result;
					} else {
						response = false;
					}
			    }, false);
				return response;
			}, "Duplicate test suite name.");

			$.validator.addMethod("uniqueParaName", function(value, element) {
				var response;
				var paraName = $.trim($("#paraName").val());	
				var groupCmdId = $.trim($("#groupId").val());
				if (!groupCmdId) {
					groupCmdId = -1;
				}
			    var url = contextPath + "/groupcmds/" + groupCmdId + "/parameters/" + paraName;
				getAjax(url,"", function(data, status) {
					if (data.result === 'success') {
						response = true;
					} else {
						response = false;
					}
			    }, false);
				return response;
			}, "Duplicate parameter name.");

			$.validator.addMethod("atLeastOneChecked", function(value, element) {
				return ($('#sflist input:checked').length > 0);
			}, 'Please select at least one service flow.');
			
			$.validator.addMethod("nameCheck", function(value, element) {
				var re = new RegExp("[/:\*\?\"<>()=\|]");
				return !re.test(value);
			}, "Name does not support those characters like /:*?\"<>()=|.");
			
			$.validator.addMethod("jsCheck", function(value, element) {
        return JSHINT.errors == null || JSHINT.errors.length == 0;
      }, "Please fix script errors.");
			
			$.validator.addMethod("uniqueUserName", function(value, element) {
				var response = true;
				var userName = $("#userModal #userForm #userName").val();	
				getAjax(contextPath + "/configuration/userName/" + userName , "", function(data, status) {
					console.log("data:", data);
					console.log("status:", status);
					if (status === 'success') {
						response = data.result;
					} else {
						response = false;
					}
			    }, false);
				return response;
			}, "The user name has already been registered!");
			
			$.validator.addMethod("uniqueTeamName", function(value, element) {
        var response = true;
        var teamId = $("#teamModal #teamForm #teamId").val(); 
        if (!teamId){
          teamId = -1;
        }
        var teamName = $("#teamModal #teamForm #teamName").val(); 
        console.log("teamForm:", teamForm);
        getAjax(contextPath + "/configuration/teams/"+ teamId +"/teamName/" + teamName , "", function(data, status) {
          console.log("data:", data);
          console.log("status:", status);
          if (status === 'success') {
            response = data.result;
          } else {
            response = false;
          }
          }, false);
        return response;
      }, "The team name has already been registered!");
			
	
	  var updateProjectTeamError = "";
      $.validator.addMethod("canUpdateProjectTeam", function(value, element) {
        var response = true;
        var form = $("#projectForm");
        var projectId = $("#projectForm #projectId").val(); 
        if (projectId && value) {
          getAjax(contextPath + "/projects/" + projectId + "/teams/" + value + "/updatecheck", "", function(data, status) {
            if (status === 'success') {
              response = data.result;
              updateProjectTeamError = data.msg;
            } else {
              response = false;
            }
          }, false);
        }
        return response;
      }, function(){
        return updateProjectTeamError;
      });

      $.validator.addMethod("processAppNotNull", function(value, element) {
        var isEmpty = true;
        if($("#processAppName").val() == null || $("#processAppName").val() == ""){
          isEmpty = false;
        }
        return isEmpty;
      }, "You do not have permission to access <strong>Hiring Sample</strong> in the server, please contact Administrator to add <strong>Hiring Sample</strong> to your team.");
      

      $.validator.addMethod("globalCustomCommandNameCheck", function(value, element) {
        var response = true; 
        var commandId = $("div.command_id input.ida-control").val();
        if (!commandId) {
          commandId = -1;
        }
        getAjax(contextPath + "/customcommands/"+commandId+"/name/" + value, "", function(data, status) {
          if (status === 'success') {
            response = !data.result;
          } else {
            response = false;
          }
        }, false);
        return response;
      }, function(){
        return "Duplicate command name!";
      });
		},
		validateForm: function() {
			console.log("validating form ...");
			$('form').each(function() {
			  var formValidatorOptions = {
	          rules: {
	              processAppId: {
	                require_from_group: [1, ".process-group"]
	              },
	              toolkitId: {
	                require_from_group: [1, ".process-group"]
	              },
	              snapshotId: {
	                    require_from_group: [1, ".snapshot-group"]
	              },
	              isTip: {
	                    require_from_group: [1, ".snapshot-group"]
	              },
	              "instanceStatus[0].checked": {
	                  require_from_group: [1, ".status"]
	              },
	              "instanceStatus[1].checked": {
	                    require_from_group: [1, ".status"]
	              },
	              pipelineSnapshotId: {
	                require_from_group: [1, ".pipeline-snapshot-group"]
	              },
	              namingConvention: {
	                require_from_group: [1, ".pipeline-snapshot-group"]
	              }
	            },
	            messages: {
	                processAppId: {
	                    require_from_group: "Please fill at least 1 of fields Process App and Toolkit."
	                },
	                toolkitId: {
	                    require_from_group: "Please fill at least 1 of fields Process App and Toolkit."
	                },
	                snapshotId: {
	                    require_from_group: "Please fill at least 1 of fields Snapshot and Tip."
	                },
	                isTip: {
	                    require_from_group: "Please fill at least 1 of fields Snapshot and Tip."
	                },
	                "instanceStatus[0].checked": {
	                    require_from_group: "Please select at least 1 status."
	                },
	                "instanceStatus[1].checked": {
	                    require_from_group: ""
	                },
	                pipelineSnapshotId: {
	                  require_from_group: "Please select at least 1 of fields Snapshot Naming Convertion and Snapshot."
	                },
	                namingConvention: {
	                  require_from_group: "Please select at least 1 of fields Snapshot Naming Convertion and Snapshot."
	                }
	            },
	          submitHandler: function(form) {
	            if ($(form).attr("action")){
	              $(':submit', form).attr('disabled','disabled');
	              if ($("#checkstyle-dashboard").length) {
	              $('#loading-indicator').toggleClass('checkstyle');
	            } 
	              $('#loading-indicator').show();
	              form.submit();
	            } 
	          },
	          highlight: function(element, errorClass, validClass) {
	            $(element).closest('.form-group').addClass('has-error');
	            if($(element).parents("#bpmUnitTest").length || $(element).parents("#bpmSnapshot").length 
	                || $(element).parents("#qaFunctionalTest").length || $(element).parents("#stageFunctionalTest").length 
	                || $(element).parents("#sendEmail").length) {
	              $("#pipelineTab li").removeClass("active");
	              $("#pipelineTab div.tab-content > div").addClass("fade");
	              $("#pipelineTab div.tab-content > div").removeClass("active in");
	              
	              var pipelineDivId = $(element).parents().eq(2).attr("id");
	              
	              $("#" + pipelineDivId + "Tab").parent().addClass("active");
	              $("#" + pipelineDivId).addClass("active in");
	              $("#" + pipelineDivId).removeClass("fade");
	            }
	            if ($(element).hasClass("select2-hidden-accessible")) {
	              $(element).parent().find(".select2-selection").addClass('has-error');
  	          }
	          },
	          unhighlight: function(element, errorClass) {
	            $(element).closest('.form-group').removeClass('has-error');
              $(element).closest('.form-group').find(".help-block").hide();
              if ($(element).hasClass("select2-hidden-accessible")) {
                $(element).parent().find(".select2-selection").removeClass('has-error');
	            }
	          },
	          ignore: ":hidden:not(.need-validation)",
	          ignoreTitle: true,
	          onclick: false,
	          onfocusout: function(element) {
	            if (!$(element).hasClass("select2-search__field")){
                $(element).valid();
	            }
	          },
	          onkeyup: false,
	          invalidHandler: function(e, validator) {
	          },
	          errorElement: 'span',
	          errorClass: 'help-block',
	          errorPlacement: function(error, element) {
	              if(element.parent('.input-group').length || element.is(":checkbox")) {
	                error.insertAfter(element.parent());
	              } else if ($(element).hasClass("select2-hidden-accessible")) {
                  error.insertAfter(element.next());
	              } else {
	                error.insertAfter(element);
	              }
	          }
	      };
			  var onfocusout = $(this).attr("onfocusout");
			  if (typeof onfocusout !== "undefined") {
			    formValidatorOptions.onfocusout = false;
			    formValidatorOptions.focusCleanup = true;
			    formValidatorOptions.focusInvalid = false;
			  }
				 $(this).validate(formValidatorOptions);
			});
		},
		unhighlight: function(form) {
		  $(form + ' .form-group').removeClass('has-error');
      $(form + ' .form-group').find(".help-block").hide();
		},
		
		// Notification level: success, info, warning, danger
		notification: function(text, callback, close_callback, style, onShown) {
			var time = '10000';
    		var $container = $('#notifications');
    		var icon = '<i class="fa fa-info-circle "></i>';
    		if (typeof style == 'undefined' ) style = 'warning'
    		var html = $('<div class="alert alert-' + style + '  hide">' + icon +  " " + text + '</div>');
    		$('<a>',{
    			text: '×',
    			class: 'button close',
    			style: 'padding-left: 10px;',
    			href: '#',
    			click: function(e){
    				e.preventDefault();
    				close_callback && close_callback();
    				remove_notice();
    			}
    		}).prependTo(html)
    		$container.prepend(html)
    		html.removeClass('hide').hide().fadeIn('slow')
    		function remove_notice() {
    			html.stop().fadeOut('slow').remove()
    		}
    		var timer =  setInterval(remove_notice, time);
    		$(html).hover(function(){
    			clearInterval(timer);
    		}, function(){
    			timer = setInterval(remove_notice, time);
    		});
    		html.on('click', function () {
    			clearInterval(timer);
    			callback && callback();
    			remove_notice();
    		});
    		
    		if (onShown){
    		  onShown();
    		}
		},


    fixedLength: function(num, length) {
      return ( "0000000000000000" + num ).substr( -length );
    },

    numToTimer: function(num) {
      if(num && num!="N/A") {
        var hours = Math.floor(num/3600);
        var minutes = Math.floor(num%3600/60);
        var seconds = Math.floor(num%3600%60);
        return this.fixedLength(hours, 2) + ":" + this.fixedLength(minutes,2) + ":" + this.fixedLength(seconds,2);
      } else {
        return "N/A";
      }
    },
	};
	$(document).ready(function(){
		util.init();
		loadImages();
	});
	return util;
});

function setDefaultValue(cssSelector, selectSelector) {
	var defValue = $(cssSelector).val();
	if($(cssSelector).length == 1 && defValue) {
		if (defValue) {
			if($(selectSelector).length == 1) {
				$.each($(selectSelector + " option"), function(index, option) {
					if($(option).attr("value") == defValue) {
						$(selectSelector).val(defValue);
						$(selectSelector).trigger("change");
					}
				});
			}
		}
	}
}


function showBpmServers(selectedTeam, serverInputId, seleniumId, mutipseleniumId){
  var selectedServerId = -1;
  var projectFormServerElementId = "pcServer";
  var importProjectFormServerElementId = "selectedServer";

  var oldServerId = $('#'+ serverInputId).val();
  $('#'+ serverInputId).empty();
  $('#'+ serverInputId).val('');
  var oldSeleniumId =  $('#'+ seleniumId).val();
  $('#'+ seleniumId).empty();
  $('#'+ seleniumId).val('');
  var oldMutipseleniumId =  $('#'+ mutipseleniumId).val();
  $('#'+ mutipseleniumId).empty();
  $('#'+ mutipseleniumId).val('');
  
  if (serverInputId == importProjectFormServerElementId) { 
	  $("#importProjectForm #processAppName").val('');
	  $("#importProjectForm #processAppName").removeAttr("readOnly");
	  $("#importProjectForm #selectedProcessAppId").val('');	  
	  if (selectedTeam.length == 0) { 
	    // import form
	    selectedTeam = -2;
	  }
  }else if (selectedTeam.length == 0 && serverInputId == projectFormServerElementId) {
    // create form
    selectedTeam = -1;
  }
  
  var url = contextPath + '/bpmservers/' + selectedTeam;
  $.ajax({
    type: "GET",
    headers: {
        Accept: "application/json"
    },
    url: url,
    dataType: "json",
    success: function(data, textStatus, jqXHR) {
      var bpmServers = JSON.parse(data.bpmServers);
      $('#'+ serverInputId).append("<option value=''></option>");
      for (var j = 0; j < bpmServers.length; j++) {     
        if (oldServerId != "" && oldServerId == bpmServers[j].id) {
          $('#' + serverInputId).append("<option value='" + bpmServers[j].id + "' selected>" + bpmServers[j].configName + "</option>"); 
          selectedServerId = bpmServers[j].id;
        } else {
          $('#' + serverInputId).append("<option value='" + bpmServers[j].id + "'>" + bpmServers[j].configName + "</option>");    
        }  
      }
      if(selectedServerId == -1){
        $('#processAppId').empty();
        $('#processAppId').val('');
        $('#toolkitId').empty();      
        $('#toolkitId').val('');
        $('#branchId').empty();     
        $('#branchId').val('');
        $('#snapshotId').empty();     
        $('#snapshotId').val(''); 
      }else if(serverInputId == projectFormServerElementId){
        showProcessApps(selectedServerId);
      }else if(serverInputId == importProjectFormServerElementId){
    	showSampleProjectName();
      }
      var seleniumGridConfigurations = JSON.parse(data.seleniumGridConfigurations);
      $('#'+ seleniumId).append("<option value=''></option>");
      for (var j = 0; j < seleniumGridConfigurations.length; j++) {
        if (oldSeleniumId != "" && oldSeleniumId == seleniumGridConfigurations[j].id) {
          $('#' + seleniumId).append("<option value='" + seleniumGridConfigurations[j].id + "' selected>" + seleniumGridConfigurations[j].serverName + "</option>");    
        } else {
          $('#' + seleniumId).append("<option value='" + seleniumGridConfigurations[j].id + "'>" + seleniumGridConfigurations[j].serverName + "</option>");
        }
      }
      var multipleSeleniumGridConfigurations = JSON.parse(data.multipleSeleniumGridConfigurations);
      $('#'+ mutipseleniumId).append("<option value=''></option>");
      for (var j = 0; j < multipleSeleniumGridConfigurations.length; j++) {
        if (oldMutipseleniumId != "" && oldMutipseleniumId.indexOf((seleniumGridConfigurations[j].id).toString())!=-1) {
          $('#' + mutipseleniumId).append("<option value='" + multipleSeleniumGridConfigurations[j].id + "' selected>" + multipleSeleniumGridConfigurations[j].text + "</option>");    
        } else if((seleniumGridConfigurations[j].id).toString() === oldSeleniumId){
          $('#' + mutipseleniumId).append("<option value='" + multipleSeleniumGridConfigurations[j].id + "' disabled>" + multipleSeleniumGridConfigurations[j].text + "</option>");    
        } else{
          $('#' + mutipseleniumId).append("<option value='" + multipleSeleniumGridConfigurations[j].id + "'>" + multipleSeleniumGridConfigurations[j].text + "</option>");        
        }
      }    
    },  
    error: function(data, textStatus, errorThrown) {
      console.log(data);
    }
  });
}

function showProcessApps(selectedServer) {
  var processAppIdVal = $("#processAppId").val();
  var bpmUserIdVal= $("#bpmUserId").val();
  $('#bpmUserId').empty();
  $('#bpmUserId').val('');  
  $('#processAppId').empty();
  $('#processAppId').val('');
  var toolkitIdVal = $("#toolkitId").val();
  $('#toolkitId').empty();
  $('#toolkitId').val('');  
  
  $('#branchId').empty();
  $('#branchId').val('');  
  $('#snapshotId').empty();
  $('#snapshotId').val('');

  if (selectedServer.length == 0) {
    return;
  }
  
  var teamId =  $('#teamId').val();
  if(teamId == null || teamId == ""){
    teamId = -1;
  }
  
  var url = contextPath + '/processapp/' + selectedServer + '/teamId/' + teamId;
  $.ajax({
    type: "GET",
    headers: {
      Accept: "application/json"
    },
    url: url,
    dataType: "json",
    success: function(data, textStatus, jqXHR) {
      var processApps = JSON.parse(data.processApps);
      var toolkits = JSON.parse(data.toolkits);
      var bpmUsers = JSON.parse(data.bpmUserList);    
      $('#bpmUserId').empty();   
      for (var j = 0; j < bpmUsers.length; j++) {  
    	   if (bpmUserIdVal != "" && bpmUserIdVal == bpmUsers[j].id) {    	       
    	      $("#bpmUserId").append("<option value='" + bpmUsers[j].id + "' selected>" + bpmUsers[j].displayName + "</option>");
    	    } else {
               $("#bpmUserId").append("<option value='" + bpmUsers[j].id + "'>" + bpmUsers[j].displayName + "</option>");
    	     }
         
       }      
      
      $('#toolkitId').empty();
      $('#toolkitId').append("<option value=''></option>");
      for (var j = 0; j < toolkits.length; j++) {
        if (toolkitIdVal != "" && toolkitIdVal == toolkits[j].appId) {
          $("#toolkitId").append("<option value='" + toolkits[j].appId + "' selected>" + toolkits[j].name + "</option>");
          if ($('#processAppId').length > 0) {
            $('#processAppId').val('');
          }
          showBranchsByToolkit();
        } else {
          $("#toolkitId").append("<option value='" + toolkits[j].appId + "'>" + toolkits[j].name + "</option>");
        }
      }
      setDefaultValue("input[name='toolkitId'].projectInfo", "#toolkitId");

      $('#processAppId').empty();
      $('#processAppId').append("<option value=''></option>");
      for (var j = 0; j < processApps.length; j++) {
        if (processAppIdVal != "" && processAppIdVal == processApps[j].appId) {
          $("#processAppId").append("<option value='" + processApps[j].appId + "' selected>" + processApps[j].name + "</option>");
          if ($('#toolkitId').length > 0) {
            $('#toolkitId').val('');
          }
          showBranchesByProcessApp();
        } else {
          $("#processAppId").append("<option value='" + processApps[j].appId + "'>" + processApps[j].name + "</option>");
        }
      }
      setDefaultValue("input[name='processAppId'].projectInfo", "#processAppId");
    },
    error: function(data, textStatus, errorThrown) {
      console.log(data);
    }
  });
}

function showBranchesByProcessApp() {
    var selectedServer = $('#pcServer').val();
    var processAppId = $('#processAppId').val();
    var branchSelect = $('#branchId');	
    
    if (selectedServer.length == 0 || (processAppId && processAppId.length == 0)) {
    	branchSelect.empty();
    	branchSelect.val('');
		showSnapshots();
    	return;
    }
    
    if (processAppId && processAppId.length > 0) {
    	$("#toolkitId").val('');
    }
    
    var url = contextPath + '/processapp/' + selectedServer + '/branch/' + processAppId;
    $.ajax({
        type: "GET",
        headers: {
            Accept: "application/json"
        },
        url: url,
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            var branches = JSON.parse(data.branches);            
            var val = branchSelect.val();
            if(branchSelect.length>0){
            	branchSelect.empty();
            }    	
            for (var j = 0; j < branches.length; j++) {
            	if(branchSelect.length>0) {
            		if(val != "" && val == branches[j].branchId) {
            			branchSelect.append("<option value='" + branches[j].branchId + "' selected>" + branches[j].branchName + "</option>");
                	} else {
                		branchSelect.append("<option value='" + branches[j].branchId + "'>" + branches[j].branchName + "</option>");
                	}            		
            	}
            }
            setDefaultValue("input[name='branchId'].projectInfo", "#branchId");
            var selectedBranch = $("input#selectedBranch").val();
            if(selectedBranch) {
              $('select#branchId').val(selectedBranch);
              $('select#branchId').trigger("change");
            }
            if(val === "" || val === undefined) {
            	if(branchSelect.length>0){
                	branchSelect.val($("#branchId option:first").val());
               }
            }
            showSnapshots();
        },
        error: function(data, textStatus, errorThrown) {
            console.log(data);
        }
    });
}

function showSnapshots() {
	if($("#snapshotId").length > 0) {
		_showSnapshots("snapshotId");
	}
	if($("#pipelineSnapshotId").length > 0) {
		_showSnapshots("pipelineSnapshotId");
	}
}

function _showSnapshots(snapshotId) {
	if ($('#' + snapshotId).length) {
		  var selectedServer = $('#pcServer').val();
	    var processAppId = $('#processAppId').val();
	    var toolkitId = $('#toolkitId').val() || "";
	    var select = $('#' + snapshotId);
	    
	    if (selectedServer.length == 0 ||( (processAppId && processAppId.length == 0) && (toolkitId&&toolkitId.length == 0))) {
	    	select.empty();
	    	select.val('');
	    	return;
	    }
	    
	    var url = contextPath + '/processapp/' + selectedServer;
	    var branchId = $('#branchId').val();
	    if (processAppId !== null && processAppId !== "") {
	        url = url + '/branch/' + processAppId + '/snapshot/' + branchId + "?isToolkit=false";
	    } else {
	        url = url + '/branch/' + toolkitId + '/snapshot/' + branchId + "?isToolkit=true";
	    }
	    if(branchId) {
	        $.ajax({
		        type: "GET",
		        headers: {
		            Accept: "application/json"
		        },
		        url: url,
		        dataType: "json",
		        success: function(data, textStatus, jqXHR) {
		            var snapshots = JSON.parse(data.snapshots);
		            var val = select.val();
		            select.empty();			           
		            for (var j = 0; j < snapshots.length; j++) {
		            	if(val != "" && val == snapshots[j].snapshotId) {
		            		select.append("<option value='" + snapshots[j].snapshotId + "' selected>" + snapshots[j].snapshotName + "</option>");
		            	} else {
		            		select.append("<option value='" + snapshots[j].snapshotId + "'>" + snapshots[j].snapshotName + "</option>");
		            	}
		            }
		            if ("true" !== $("input[name='isTip'].projectInfo").val()) {
		            	setDefaultValue("input[name='snapshotId'].projectInfo", '#' + snapshotId);
		            	var selectedSnapshot = $("input#selectedSnapshot").val();
                  if (selectedSnapshot) {
                    $('select#snapshotId').val(selectedSnapshot);
                    $('select#snapshotId').trigger("change");
                  }
		            }
		            onClickTip($("#isTip")[0]);
		            if ($('#sflist').length)
		            	showServiceFlows();
		        },
		        error: function(data, textStatus, errorThrown) {
		            console.log(data);
		        }
		    });
	    }
	}
}

function showBranchsByToolkit() {
	var selectedServer = $('#pcServer').val();
	var toolkitId = $('#toolkitId').val();
	var select = $('#branchId');
	
	if (selectedServer.length == 0 || toolkitId.length == 0) {
		select.empty();
		select.val('');
		showSnapshots();
    	return;
    }
	
    if (toolkitId.length > 0) {
    	$("#processAppId").val('');
    }
	var url = contextPath + '/processapp/' + selectedServer + '/branch/' + toolkitId;
	$.ajax({
		type : "GET",
		headers : {
			Accept : "application/json"
		},
		url : url,
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			var branches = JSON.parse(data.branches);
			select.empty();
			for (var j = 0; j < branches.length; j++) {
				select.append("<option value='" + branches[j].branchId + "'>"
						+ branches[j].branchName + "</option>");
			}
			select.val($("#branchId option:first").val());
			showSnapshots();
		},
		error : function(data, textStatus, errorThrown) {
			console.log(data);
		}
	});
}

function onClickTip(checkbox){
   var snapshotSelect = $("#snapshotId");
   var snapshotSelectOptions = $("#snapshotId option");
   if (checkbox && checkbox.checked && snapshotSelectOptions.length > 0){
	   snapshotSelect.val(snapshotSelectOptions[0].value);
	   snapshotSelect.addClass('disabled');
	}else{	
	   snapshotSelect.removeClass('disabled');
	}
}

/* Utils */
function getAjax(url, data, success, async) {
    var asyncSet = true;
    if (false == async)
        asyncSet = async;
    $.ajax({
        async: asyncSet,
        type: 'GET',
        url: url,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        data: {
            param: data
        },
        success: function(data, status, request) {
            success(data, status, request);
        },
        error: function(xhr, state, err) {
            console.debug('Fail to communicate with backend：' + err);
        }
    });
}

function postAjax(url, data, success, async) {
    var asyncSet = true;
    if (false == async)
        asyncSet = async;
    $.ajax({
        async: asyncSet,
        type: 'POST',
        url: url,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        data: data,
        success: function(data, status, request) {
            success(data, status, request);
        },
        error: function(xhr, state, err) {
            console.debug('Fail to communicate with backend：' + err);
        }
    });
}

function putAjax(url, data, success, async) {
    $('#loadingimg').show();
    var asyncSet = true;
    if (false == async)
        asyncSet = async;
    var type = "PUT";
    $.ajax({
        async: asyncSet,
        type: type,
        url: url,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        data: data,
        success: function(data, status, request) {
            $('#loadingimg').hide();
            success(data, status, request);
        },
        error: function(xhr, state, err) {
            $('#loadingimg').hide();
            console.debug('Fail to communicate with backend：' + err);
        }
    });
}

function deleteAjax(url, data, success, async) {
    var asyncSet = true;
    if (false == async)
        asyncSet = async;
    $.ajax({
        async: asyncSet,
        type: 'DELETE',
        url: url,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        data: {
            param: data
        },
        success: function(data, status, request) {
            success(data, status, request);
        },
        error: function(xhr, state, err) {
            console.debug('Fail to communicate with backend：' + err);
        }
    });
}

function hideMenuCover() {
  var menuCover = window.top.$(".menu_cover");
  if (menuCover) {
    menuCover.addClass("hidden");
  }
}
function showMenuCover() {
  var menuCover = window.top.$(".menu_cover");
  if (menuCover) {
    menuCover.removeClass("hidden");
  }
}

function displayCaseTrace(trace,title) {
	
  $("#contentModal").on('hide.bs.modal', function (e) {
    hideMenuCover();
  });
  $("#contentModal").on('show.bs.modal', function (e) {
    showMenuCover();
  });
	$("#contentModalLabel").text(title);
  $('#contentModal').modal('show');
  $("#contentModalText").html("<pre>" + trace + "</pre>");
}

function formatJson(parameter) {
  var parameterJson = JSON.parse(parameter);
  if (parameterJson.params) {
    var formatedParams = parameterJson.params;
    try {
    	formatedParams = JSON.stringify(JSON.parse(formatedParams), null, 2);
    } catch(e) {
    	console.log(e);
    }
  	parameterJson.params = formatedParams;
  }
  parameter = JSON.stringify(parameterJson, null, 2);
  parameter =  parameter.replace(/\\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
  parameter =  parameter.replace(/\\r/g, "");
  parameter =  parameter.replace(/\\\"/g, "\"");
  return parameter;
}


function displayParameter(para,title,category,description) {
  var parameter = unescape(para);
  parameter =  formatJson(parameter);
  var content =unescape(description);
  $("#contentModal").on('hide.bs.modal', function (e) {
    hideMenuCover();
  });
  $("#contentModal").on('show.bs.modal', function (e) {
    showMenuCover();
  });
	$("#contentModalLabel").text(title);
  $('#contentModal').modal('show');
   content = content + "<br/><p class='details'>" + category + "</p><pre><code>" +  parameter + "</code></pre>";
  $("#contentModalText").html(content);
}


function viewScreenshots(activeIndex, caseInfoId) {
  require(['jquery', "common/alert_modal"], function($, AlertModal) { 
    if($("span[active-index='" + activeIndex + "']").hasClass("image-downloading")) {
        var alertModal = new AlertModal({
            title: "Warning",
            body: "Screenshot is still being loaded."
        });

        alertModal.show();
        return;
    };
    
    
    var items = $('div.carousel-screenshots').find('.item, .hidden');
    if (items.length > 0) {
      items.removeClass('active');
      $.each(items, function(index, ele) {
        var _this = $(this);
        var img = $("img.img-responsive", ele);
        if($(ele).hasClass("item")) {
          var imgSrc = $(img).attr("src");
          if(imgSrc.indexOf(activeIndex) > 0) {
            _this.addClass('active');
            var cssSelector = "div#"+caseInfoId+".screenshotsModal";
            $("div#"+caseInfoId+"img-modal").modal();
          } 
        }
      });
    } else {
      var alertModal = new AlertModal({
        title: "Warning",
        body: "No screenshots taken for this case."
      });

      alertModal.show();
    }
  });
	
}

function loadImages() {
  $(".img-responsive").each(function(index) {
    var imgSrc = $(this).attr('img-src');
    if (imgSrc){
      imgSrc = imgSrc.substring(4, imgSrc.length);
      
      var activeIndex = imgSrc.substring(imgSrc.indexOf('.')-36, imgSrc.indexOf('.'));
      
      var image = $(this);
      var downloadingImage = new Image();
      downloadingImage.onload = function(){
          image.attr("src", this.src);   
          $("span[active-index='" + activeIndex + "']").removeClass("image-downloading");
      };
      downloadingImage.src = contextPath + imgSrc;
    }
  });
  
  expectedImageTooltip();
  
}

function loadDiagrams(projectId, caseId) {
  if(!$("#diagram").attr('loaded')) {
    var url =  contextPath + '/projects/'+ projectId +'/cases/' + caseId + '/diagrams';

    $("#diagram").load(url);
    
    $("#diagram").attr('loaded', true);
  }
}

var expectedImageTooltip = function() {
  var mouseLeaveTimer = null;
  if ($("a.expected-image").length) {
      $("a.expected-image").each(function() {
          var _this = $(this);
          var expectedImagePath = $(_this).find("input:nth-child(1)").val();
          $(this).tooltip({
              items: "a.expected-image",
              tooltipClass: "expected-image-content",
              content: function(callback) {
                if (expectedImagePath){
                  var imgUrl = contextPath + "/screenshots?path=" + expectedImagePath;
                  var element = '<div><img src="' +imgUrl + '"/></div>';
                  callback(element);
                }
              }
          }).on('mouseleave', function(e) {
              mouseLeaveTimer = setTimeout(function() {
                  $("a.expected-image").tooltip('close');
              }, 100);
              e.stopImmediatePropagation();
          }).on('mouseenter', function(){
            $('a.expected-image').tooltip({
              position: {
                my: "left-775 top-632",
                at: "top"
              }
            });
          });

      });

      $(document).on('mouseenter', '.ui-tooltip', function(e) {
          if (mouseLeaveTimer) {
              clearTimeout(mouseLeaveTimer);
              mouseLeaveTimer = null;
          }
      });
      $(document).on('mouseleave', '.ui-tooltip', function() {
          $('a.expected-image').tooltip('close');
      });
  }
};

function showServiceFlows() {
	console.debug("getting service flow...");
	var serverId = $("#pcServer").val();
	var appId = $("#processAppId").val();
	var branchId = $("#branchId").val();
	var snapshotId = $("#snapshotId").val();

	$.ajax({
		type : "GET",
		url : contextPath + "/monitor/" + serverId + "/app/" + appId
				+ "/branch/" + branchId + "/snapshot/" + snapshotId,
		success : function(responseHTML, status, xhr) {
			var container = $('#sflist');
			container.empty();
			$("#sflist").prepend(responseHTML);
		},
		error : function(response, status, xhr) {
			console.error("failed to get componentNames...");
		}
	});
}
