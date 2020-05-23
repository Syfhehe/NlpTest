define(["jquery", "bootstrap"], function($, bootstrap) {
	
	$('#updatePassButton').bind("click", function() {
	    var oldPassword = $(" #oldPassword ").val();
	    var newPassword = $(" #newPassword ").val();
	    var data = {
	    		oldPassword : oldPassword,
	    		newPassword : newPassword
	    };
	    putAjax(contextPath + '/password', data,
	        function(data) {
	            var obj = eval(data);
	            alert(obj.result);
	            $("#updatePasswordModal").modal("hide");
	        }, true);
	});
	$('#newPasswordAgain').bind("blur", function() {
	    var firstPass = $("#newPassword").val();
	    var secondPass = $("#newPasswordAgain").val();
	    if (firstPass !== secondPass) {
	        $("#newPasswordAgainBlock").removeClass("has-success");
	        $("#newPasswordAgainBlock").addClass("has-error");
	        $("#passwordAgainMsg").text("Two input passwords must be consistent!");
	        $("#updatePassButton").attr("disabled", true);
	    } else {
	        $("#newPasswordAgainBlock").removeClass("has-error");
	        $("#newPasswordAgainBlock").addClass("has-success");
	        $("#passwordAgainMsg").text("Passed validation!");
	        $("#updatePassButton").removeAttr("disabled");
	    }
	});
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
});

