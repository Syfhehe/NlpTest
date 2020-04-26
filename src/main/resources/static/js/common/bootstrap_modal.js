define(["jquery", "bootstrap", "common/form_controls"], function($, bootstrap, formControls) {
	var BstrapModal = function(options) {
	    this.title = options.title || "";
	    this.body = options.body || "";
	    this.buttons = options.buttons || [{ value: "Close", css: "btn-default"}];
	    this.onShown = options.onShown;
      this.onHidden = options.onHidden;
      this.onShow = options.onShow;
      this.onHide = options.onHide;
      this.labelCol = options.labelCol;
      this.controlCol = options.controlCol;
      this.id = options.id || "";
	};
	BstrapModal.prototype = {
		createCustomModal: function() {
			var body = "";
			if (typeof this.body === "string") {
				body = this.body;
			}
			if (!this.id) {
			  this.id = Math.random();
			}
	        var buttonshtml = "";
	        for (var i = 0; i < this.buttons.length; i++) {
	        	var button = this.buttons[i];
	        	var buttonType = button.type || "button";
	            buttonshtml += "<button type='"+buttonType+"' class='btn " + button.css + "'>" + button.value + "</button>";
	        }
	        var html = "<div class='modal fade custom-modal' id='" + this.id + "' tabindex='-1' role='dialog'>"
	        + "<div class='modal-dialog'><div class='modal-content'>"
	        + "<form class='form-horizontal'>"
	        + "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button>"
	        + "<h4 class='modal-title'>" + this.title + "</h4></div>"
	        + "<div class='modal-body'>" + body + "</div>"
	        + "<div class='modal-footer'>" + buttonshtml + "</div></form></div></div></div>";
	        this.customModal = $(html);
	    	$('body').append(this.customModal);
	    	this.customModal.on('hidden.bs.modal', function(e){
          if (this.onHidden) {
            this.onHidden();
          }
	     		this.customModal.remove();
	    	}.bind(this));

	    	this.customModal.on('shown.bs.modal', function(e) {
	    		this.renderBody();
	    		if (this.onShown) {
	    			this.onShown();
	    		}
	    	}.bind(this));
	    	this.customModal.on('hide.bs.modal', function(e){
          if (this.onHide) {
            this.onHide();
          }
        }.bind(this));

        this.customModal.on('show.bs.modal', function(e) {
          if (this.onShow) {
            this.onShow();
          }
        }.bind(this));
	    	return this.customModal;
		},
		renderBody: function() {
			if (typeof this.body === "object") {
				var bodyContainer = this.customModal.find(".modal-body");
				formControls.render(bodyContainer, this.body, {labelCol: this.labelCol, controlCol: this.controlCol});
			}
		},
		show: function () {
	    	this.createCustomModal();
	    	var btns = this.customModal.find(".modal-footer button");
	        for (var i = 0; i < btns.length; i++) {
	        	var callback = this.buttons[i].callback;
	        	if (!callback) {
	        		callback = function (event) { 
	        			this.close(); 
	        		};
	        	}
	        	$(btns[i]).bind("click", callback.bind(this));
	        }
	        this.customModal.modal('show');
	    },
	    close: function() {
	        this.customModal.modal('hide');
	    }
	};
	
	return BstrapModal;
});
