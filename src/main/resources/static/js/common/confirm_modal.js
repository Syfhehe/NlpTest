define(["jquery", "bootstrap", "common/bootstrap_modal"], function($, bootstrap, BootstrapModal) {
	var ConfirmModal = function(options) {
	    this.title = options.title || "";
	    this.body = options.body || "";
	    this.okBtnText = options.okBtnText || "OK";
	    this.cancelBtnText = options.cancelBtnText || "Cancel";
		this.buttons = [
			{ value: this.okBtnText, css: "btn-primary", callback: function(){
				if (this.onConfirm) {
					this.onConfirm();
				}
				this.close();
			}},
			{ value: this.cancelBtnText, css: "btn-default", callback: function() {
        if (this.onCancel) {
          this.onCancel();
        }
        this.close();
			}}
		];
    this.onShown = options.onShown;
    this.onHidden = options.onHidden;
    this.onShow = options.onShow;
    this.onHide = options.onHide;
		this.onConfirm = options.onConfirm;
		this.onCancel = options.onCancel;
	};
	ConfirmModal.prototype = new BootstrapModal({});
	return ConfirmModal;
});
