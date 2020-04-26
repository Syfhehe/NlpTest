define(
		[ "jquery", "jqueryui", "bootstrap" ],
		function($, jqueryui, bootstrap) {
			return {
				render : function(container, controls, options) {
					this.container = container;
					this.labelCol = 5;
					this.controlCol = 7;
					if (options && options.labelCol) {
						this.labelCol = options.labelCol;
					}
					if (options && options.controlCol) {
						this.controlCol = options.controlCol;
					}
					for ( var key in controls) {
						var control = controls[key];
						var controlElement = this.getControlByName(key);
						if (!controlElement) {
							if (control.type === "text") {
								container.append(this.text(key, control));
							} else if (control.type === "select") {
								container.append(this.select(key, control));
							} else if (control.type === "checkbox") {
								container.append(this.checkbox(key, control));
							} else if (control.type === "textarea") {
								container.append(this.textarea(key, control));
							} else if (control.type === "hidden") {
								container.append(this.hidden(key, control));
							} else if (control.type === "div") {
								container.append(this.div(key, control));
							} else if (control.type === "radioGroup") {
								container.append(this.radioGroup(key, control));
							} else if (control.type === "image") {
								container.append(this.image(key, control));
							} else if (control.type === "nameValuePairs") {
								container.append(this.nameValuePairs(key,
										control));
							} else if (control.type === "select2") {
								container.append(this.select2(key, control));
							}
							if (control.validator) {
								if (typeof control.validator == "string") {
									control.validator = [ control.validator ];
								}
								for (var i = 0; i < control.validator.length; i++) {
									this.setControlValidator(key,
											control.validator[i]);
								}
							}
							if (control.required) {
								this.setControlRequired(key, control.required);
							}
							if (control.readonly) {
								this.setControlReadonly(key, control.readonly);
							}
							if (control.disabled) {
								this.setControlDisabled(key, control.disabled);
							}
							if (control.inVisible) {
								this.setControlInVisible(key,
										control.inVisible, control.type);
							}

							controlElement = this.getControlByName(key);
						}

						if (control.type === "nameValuePairs") {
							var _this = this;
							var removeLineEvent = function(event) {
								var ele = event.target || event.srcElement;
								var container = $(ele).parents(
										".name-value-pairs");
								var row = $(ele).parents(
										".name-value-pairs-content");
								var controlNameEle = row.find("input[name='"
										+ this.name + "']");
								row.remove();
								if (this.onBlur) {
									this.onBlur.bind(container)();
								}
								if (this.onDelete) {
									this.onDelete.bind(controlNameEle.val())();
								}
							};
							var nameBlueEvent = function(event) {
								var ele = event.target || event.srcElement;
								var row = $(ele).parents(
										".name-value-pairs-content");
								var controlValue = this.value;
								row.find("input[name='" + controlValue + "']")
										.val(ele.value);
								if (this.onBlur) {
									this.onBlur.bind(ele)();
								}
							};
							// bind event for nameValuePair controls
							controlElement.find(".remove-line").bind("click",
									removeLineEvent);
							controlElement.find(
									"input[name='" + control.name + "']").bind(
									"blur", nameBlueEvent.bind(control));
							controlElement.find(".add-line").bind(
									"click",
									function(event) {
										var ele = event.target
												|| event.srcElement;
										var controlParent = $(ele).parents(
												".name-value-pairs");
										var controlName = this.name;
										var controlValue = this.value;

										var html = _this
												._createNameValuePairsContent(
														controlName,
														controlValue, null,
														true);
										var newLine = $(html);
										controlParent.append(newLine);
										newLine.find(".remove-line").bind(
												"click",
												removeLineEvent.bind(this));
										var nameEle = newLine
												.find("input[name='"
														+ controlName + "']");
										nameEle.focus();
										nameEle.bind("blur", nameBlueEvent
												.bind(this));
									}.bind(control));
						}
					}
					for ( var key in controls) {
						var control = controls[key];
						if (control.type === "select"
								|| control.type === "radioGroup") {
							// trigger onchange event
							if (control.onChange) {
								control.onChange.bind(this)();
							}
						}
						if (control.onInit) {
							control.onInit.bind(this)();
						}
					}
				},
				removeControls : function(css) {
					this.container.find(css).remove();
				},
				setControlValidator : function(name, validator) {
					var controlElement = this.getControlByName(name);
					if (controlElement) {
						if (validator) {
							controlElement.attr("data-rule-" + validator,
									"true");
						}
					}
				},
				setControlRequired : function(name, required) {
					var controlElement = this.getControlByName(name);
					if (controlElement) {
						if (required) {
							controlElement.attr("required", "required");
							$(controlElement.parents(".form-group")[0])
									.addClass("required");
						} else {
							controlElement.removeAttr("required");
							$(controlElement.parents(".form-group")[0])
									.removeClass("required");
						}
					}
				},
				setControlReadonly : function(name, readonly) {
					var controlElement = this.getControlByName(name);
					if (controlElement && readonly) {
						controlElement.attr("readonly", "readonly");
					}
				},
				setControlDisabled : function(name, disabled) {
					var controlElement = this.getControlByName(name);
					if (controlElement && disabled) {
						controlElement.attr("disabled", "true");
					}
				},
				setControlInVisible : function(name, inVisible, type) {
					if (inVisible) {
						this.hideControl(name, type);
					} else {
						this.showControl(name, type);
					}
				},
				getControlByName : function(name) {
					var controlElement = this.container
							.find(".ida-control[name='" + name + "']");
					if (controlElement.length > 0) {
						return controlElement;
					} else {
						return null;
					}
				},
				getControlById : function(id) {
					var controlElement = this.container.find("#" + id);
					if (controlElement.length > 0) {
						return controlElement;
					} else {
						return null;
					}
				},
				getControlValue : function(name) {
					var controlElements = this.getControlByName(name);
					if (controlElements && controlElements.length === 1) {
						var element = controlElements[0];
						var tagName = element.tagName;
						if (tagName.toUpperCase() === "INPUT") {
							return element.value;
						} else if (tagName.toUpperCase() === "SELECT") {
							var selectedOption = $(element).find(
									"option:selected");
							return selectedOption.val();
						}
					} else if (controlElements && controlElements.length > 1) {
						// get value for radio
						for (var i = 0; i < controlElements.length; i++) {
							var element = controlElements[i];
							if (element.tagName.toUpperCase() === "INPUT"
									&& element.type === "radio"
									&& element.checked) {
								return element.value;
							}
						}
					}
					return null;
				},
				setControlValue : function(name, value) {
					var controlElement = this.getControlByName(name);
					if (controlElement.length > 0) {
						controlElement.val(value);
					}
					return null;
				},
				uncheckControl : function(name) {
					var controlElement = this.getControlByName(name);
					if (controlElement.length > 0) {
						$(controlElement).prop('checked', false);
					}
					return null;
				},
				setControlLabel : function(name, label) {
					var controlContainer = this.getControlContainer(name);
					if (controlContainer) {
						controlContainer.find("label").text(label);
					}
				},
				getControlContainer : function(name) {
					var controlElement = this.getControlByName(name);
					if (controlElement) {
						var controlContainer = $(controlElement
								.parents(".form-group")[0]);
						return controlContainer;
					}
					return null;
				},
				hideControl : function(name, type) {
					var controlContainer = this.getControlContainer(name);
					if (type === "nameValuePairs") {
						controlContainer = this.container
								.find(".name-value-pairs");
					}
					if (controlContainer) {
						controlContainer.addClass("hidden");
					}
				},
				showControl : function(name, type) {
					var controlContainer = this.getControlContainer(name);
					if (type === "nameValuePairs") {
						controlContainer = this.container
								.find(".name-value-pairs");
					}
					if (controlContainer) {
						controlContainer.removeClass("hidden");
					}
				},
				isControlVisible : function(name) {
					var controlContainer = this.getControlContainer(name);
					if (controlContainer) {
						return !controlContainer.hasClass("hidden");
					}
					return false;
				},
				div : function(name, control) {
					var label = control.label;
					var className = control.className || "";
					var id = control.id;
					var collapseTableId = control.collapseTableId || "";
					var html = "<div class='form-group " + className + "'>";
					html = html + "<div id='" + id
							+ "' class='ida-control' name='" + name
							+ "'></div></div>";
					return $(html);
				},
				hidden : function(name, control) {
					var label = control.label;
					var defaultValue = control.defaultValue || "";
					var required = control.required || false;
					var className = control.className || "";
					var html = "<div class='form-group " + className
							+ "' style='margin: 0;'>";
					html += "<div><input class='ida-control form-control' type='hidden' name='"
							+ name
							+ "' value='"
							+ defaultValue
							+ "' maxlength='50'/></div></div>";
					return $(html);
				},
				nameValuePairs : function(name, control) {
					var label = control.label;
					var defaultValue = control.defaultValue || "";
					var required = control.required || false;
					var className = control.className || "";
					var nameLabel = control.nameLabel;
					var valueLabel = control.valueLabel;
					var controlName = control.name;
					var controlValue = control.value;
					var html = "<div class='ida-control name-value-pairs "
							+ className
							+ "' name='"
							+ name
							+ "'><div class='form-group name-value-pairs-header'>";
					html += "<div class='col-md-" + this.labelCol
							+ "'><label class='control-label'>" + label
							+ "</label></div>";
					html += "<div class='col-md-" + this.controlCol + "'>";
					html += "<div class='row has-form-row-controls'><div class='col-md-6 control-label'><label>"
							+ nameLabel
							+ "</label></div><div class='col-md-6 control-label'><label>"
							+ valueLabel
							+ "</label></div><div class='form-row-controls'><i class='add-line glyphicon glyphicon-plus'></i></div></div>";
					html += "</div></div>";
					if (defaultValue && defaultValue.length > 0) {
						for ( var index in defaultValue) {
							html += this._createNameValuePairsContent(
									controlName, controlValue,
									defaultValue[index], true);
						}
					} else {
						html += this._createNameValuePairsContent(controlName,
								controlValue, null, true);
					}
					html += "</div>";
					return $(html);
				},
				_createNameValuePairsContent : function(controlName,
						controlValue, nameValuePair, hasControls) {
					var nameDefaultValue = "";
					var valueDefaultValue = "";
					if (nameValuePair) {
						nameDefaultValue = nameValuePair[controlName];
						valueDefaultValue = nameValuePair[controlValue];
					}
					var html = "<div class='form-group name-value-pairs-content'>";
					html += "<div class='col-md-" + this.labelCol + "'></div>";
					html += "<div class='col-md-" + this.controlCol + "'>";
					html += "<div class='row has-form-row-controls'><div class='col-md-6'><input class='form-control' name='"
							+ controlName
							+ "' value='"
							+ nameDefaultValue
							+ "' type='text'/></div><div class='col-md-6'><input class='form-control' name='"
							+ controlValue
							+ "' value='"
							+ valueDefaultValue
							+ "' type='text'/></div>";
					if (hasControls) {
						html += "<div class='form-row-controls'><i class='remove-line glyphicon glyphicon-remove'/></div>";
					}
					html += "</div></div></div>";
					return html;
				},
				image : function(name, control) {
					var className = control.className || "";
					var defaultValue = control.defaultValue || "";
					var src = control.src || "";
					var html = "<div class='form-group " + className + "'>";
					html += "<img class='ida-control' name=\"" + name
							+ "\" src=\"data:image/png;base64," + src + "\"/>";
					html += "</div>";
					return $(html);
				},
				text : function(name, control) {
					var label = control.label;
					var defaultValue = control.defaultValue || "";
					var required = control.required || false;
					var className = control.className || "";
					var tooltip = control.tooltip || "";
					if (tooltip != "") {
						var html = "<div class='form-group " + className
								+ "'><div class='col-md-" + this.labelCol
								+ "'><label class='control-label'>" + label
								+ "</label>";
						html += "<span class='glyphicon glyphicon-info-sign' title='"
								+ tooltip + "'></span></div>"
					} else {
						var html = "<div class='form-group " + className
								+ "'><label class='col-md-" + this.labelCol
								+ " control-label'>" + label + "</label>";
					}
					html += "<div class='col-md-"
							+ this.controlCol
							+ "'><input class='ida-control form-control' type='text' name='"
							+ name + "' value='" + defaultValue
							+ "'/></div></div>";
					return $(html);
				},
				textarea : function(name, control) {
					var label = control.label;
					var defaultValue = control.defaultValue || "";
					var required = control.required || false;
					var className = control.className || "";
					var tooltip = control.tooltip || "";

					if (tooltip != "") {
						var html = "<div class='form-group " + className
								+ "'><div class='col-md-" + this.labelCol
								+ "'><label class='control-label'>" + label
								+ "</label>  ";
						html += "<a href='"
								+ tooltip
								+ "' target='_blank'>"
								+ "<span class='glyphicon glyphicon-info-sign' title='Click to see more details.'></span></a></div>"
					} else {
						var html = "<div class='form-group " + className
								+ "'><label class='col-md-" + this.labelCol
								+ " control-label'>" + label + "</label>";
					}
					if (className.includes("need-validation")) {
						html += "<div class='col-md-"
								+ this.controlCol
								+ "'><textarea class='ida-control form-control need-validation' type='text' name='"
								+ name + "' row='3'>" + defaultValue
								+ "</textarea></div></div>";
					} else {
						html += "<div class='col-md-"
								+ this.controlCol
								+ "'><textarea class='ida-control form-control' type='text' name='"
								+ name + "' row='3'>" + defaultValue
								+ "</textarea></div></div>";
					}

					return $(html);
				},
				checkbox : function(name, control) {
					var label = control.label;
					var defaultValue = control.defaultValue || "";
					var required = control.required || false;
					var className = control.className || "";
					var html = "<div class='form-group " + className + "'>";
					html += "<div class='col-md-12'><div class='checkbox'><label><input class='ida-control' type='checkbox' name='"
							+ name + "' id='" + name + "' value='true'"
					if (defaultValue && (defaultValue.toString() === "true")) {
						html += " checked='checked'"
					}
					html += "/>" + label + "</label></div></div></div>";
					var controlElement = $(html);
					var checkbox = controlElement
							.find('input[type="checkbox"]');
					if (control.onChange) {
						var _this = this;
						$(checkbox).bind("change", function() {
							control.onChange.bind(_this)();
						});
					}
					return controlElement;
				},
				radioGroup : function(name, control) {
					var defaultValue = control.defaultValue;
					var required = control.required || false;
					var className = control.className || "";
					var offlineDeploymentRequired = control.offlineDeploymentRequired;
					var html = "<div class='form-group " + className + "'>";
					html += "<div class='col-md-12'><div class='radio'>";
					if (offlineDeploymentRequired) {
						html += "<label class='radio-inline'><input class='ida-control' type='radio' name='"
								+ name + "' value='true' checked='checked'";
						html += "/>" + control.options[0].label + "</label>";
					} else {
						$
								.each(
										control.options,
										function(index, item) {
											html += "<label class='radio-inline'><input class='ida-control' type='radio' name='"
													+ name
													+ "' value='"
													+ item.value + "'";
											if (defaultValue.toString() === item.value) {
												html += " checked='checked'";
											}
											html += "/>" + item.label
													+ "</label>";
										});
					}

					html += "</div></div></div>";
					var controlElement = $(html);
					var radio = controlElement.find('input[type="radio"]');
					if (control.onChange) {
						var _this = this;
						$(radio).bind("change", function() {
							control.onChange.bind(_this)();
						});
					}
					return controlElement;
				},
				_loadOptions : function(select, control, options, fireChange) {
					if (select) {
						var defaultValue = control.defaultValue || "";
						var emptyOptionName = control.emptyOptionName || "";
						select.empty();
						if (emptyOptionName) {
							select.append("<option value=''>" + emptyOptionName
									+ "</option>");
						}
						for (var i = 0; i < options.length; i++) {
							var option = options[i];
							var optionValue = "";
							var optionName = "";
							var optionServerType = "";
							if (typeof option === "string") {
								optionValue = option;
								optionName = option;
							} else {
								optionValue = option.value;
								optionName = option.name;
							}
							var optionHtml = "<option value='" + optionValue
									+ "'";
							if (defaultValue.toString() === optionValue
									.toString()) {
								optionHtml += " selected='selected'";
								selected = true;
								if (option.type) {
									optionServerType = option.type;
									$("#selectedServerType").val(
											optionServerType);
								}
							}
							optionHtml += ">" + optionName + "</option>";
							select.append(optionHtml);
						}
						if (fireChange && control.onChange) {
							control.onChange.bind(this)();
						}
					}
				},
				_ajaxOptions : function(select, control, url, fireChange) {
					if (select) {
						$.ajax({
							type : "GET",
							headers : {
								Accept : "application/json"
							},
							url : url,
							dataType : "json",
							success : function(data, textStatus, jqXHR) {
								this._loadOptions(select, control, data,
										fireChange);
							}.bind(this),
							error : function(xhr, state, err) {
								console.error(err);
							}
						});
					}
				},
				_ajaxGet : function(url) {
					$.ajax({
						type : "GET",
						headers : {
							Accept : "application/json"
						},
						async : false,
						url : url,
						dataType : "json",
						success : function(data, textStatus, jqXHR) {
							$("#selectedServerType").val(
									data.selectedServerType);
						},
						error : function(xhr, state, err) {
							console.error(err);
						}
					});
				},
				select : function(name, control) {
					var label = control.label;
					var id = control.id;
					var required = control.required || false;
					var className = control.className || "";
					var validationClass = control.validationClass || "";
					var tooltip = control.tooltip;
					var html = "<div class='form-group " + className + "'>";
					if (tooltip) {
						html += "<div class='col-md-"
								+ this.labelCol
								+ "'><label class='control-label'>"
								+ label
								+ "</label><span class='glyphicon glyphicon-info-sign' title='"
								+ tooltip + "'></span></div>";
					} else {
						html += "<label class='col-md-" + this.labelCol
								+ " control-label'>" + label + "</label>";
					}
					if (id) {
						html += "<div class='col-md-" + this.controlCol
								+ "'><select class='ida-control form-control "
								+ validationClass + "' type='text' id='" + id
								+ "' name='" + name + "'></select></div></div>";
					} else {
						html += "<div class='col-md-" + this.controlCol
								+ "'><select class='ida-control form-control "
								+ validationClass + "' type='text' name='"
								+ name + "'></select></div></div>";
					}
					var controlElement = $(html);
					var select = controlElement.find("select");
					if (control.onChange) {
						var _this = this;
						$(select).bind("change", function() {
							control.onChange.bind(_this)();
						});
					}
					if (control.data) {
						this._loadOptions(select, control, control.data, true);
					} else if (control.url) {
						this._ajaxOptions(select, control, control.url, true);
					}
					return controlElement;
				},
				select2 : function(name, control) {
					var _this = this;
					var label = control.label;
					var id = control.id;
					var required = control.required || false;
					var className = control.className || "";
					var html = "<div class='form-group " + className
							+ "'><label class='col-md-" + this.labelCol
							+ " control-label'>" + label + "</label>";
					if (id) {
						html += "<div class='col-md-"
								+ this.controlCol
								+ "'><select class='ida-control form-control' type='text' id='"
								+ id + "' name='" + name
								+ "'><option></option></select></div></div>";
					} else {
						html += "<div class='col-md-"
								+ this.controlCol
								+ "'><select class='ida-control form-control' type='text' name='"
								+ name
								+ "'><option></option></select></div></div>";
					}
					var controlElement = $(html);
					var select = controlElement.find("select");

					$(select).empty();
					if (control.data) {
						this.initSelect2(select, control);
					} else if (control.url) {
						$.ajax({
							type : "GET",
							headers : {
								Accept : "application/json"
							},
							url : control.url,
							dataType : "json",
							success : function(data, textStatus, jqXHR) {
								var options = JSON.parse(data.commands);
								control.data = options;
								_this.initSelect2(select, control);
							},
							error : function(data, textStatus, errorThrown) {
								console.log(data);
							}
						});
					}
					return controlElement;
				},
				initSelect2 : function(select, control) {
					var defaultValue = control.defaultValue || "";
					var placeholder = "";
					if (control.placeholder) {
						placeholder = control.placeholder;
					}
					var select2Options = {
						placeholder : placeholder,
						width : '100%',
						allowClear : true,
						data : control.data,
					};
					if (control.dropdownParent) {
						select2Options.dropdownParent = $(control.dropdownParent);
					}
					var _this = this;
					$(select).select2(select2Options);
					var firstValidation = true;
					if (control.onChange) {
						$(select).on("change", function(a, b) {
							control.onChange.bind(_this)();
							if (firstValidation) {
								firstValidation = false;
							} else {
								$(select).valid();
							}
						});
					}
					$(select).val("").trigger("change");
					if (defaultValue) {
						$(select).val(defaultValue).trigger("change");
					}
				}
			};
		});
