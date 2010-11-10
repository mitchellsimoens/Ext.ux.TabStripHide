Ext.ns("Ext.ux");
Ext.ux.TabStripHide = Ext.extend(Object, {
	autoHide: true,
	stripHideAnim: true,
	constructor: function(config) {
		config = config || {};
		Ext.apply(this, config);
	},
	init: function(tabpanel) {
		this.tabpanel = tabpanel;
		
		this.tabpanel.autoHide = this.autoHide;
		this.tabpanel.stripHideAnim = this.stripHideAnim;
		this.tabpanel.toggleHideStrip = this.toggleHideStrip;
		this.tabpanel.hideStrip = this.hideStrip;
		this.tabpanel.showStrip = this.showStrip;
		
		this.tabpanel.on("afterrender", this.onAfterRender);
		if (this.autoHide === true) {
			this.tabpanel.on("remove", this.onRemove);
			this.tabpanel.on("add", this.onAdd);
		}
	},
	onAfterRender: function() {
		this.header.setVisibilityMode(Ext.Element.DISPLAY);
		this.header.hidden = false;
		if (this.autoHide === true) {
			var numTabs = this.strip.query("li{display!=none}:not([className^=x-tab-edge])").length;
			this.header.hidden = (numTabs > 1) ? false : true;
			if (this.header.hidden === true) {this.hideStrip();}
		}
	},
	hideStrip: function(doAnim) {
		doAnim = (doAnim === undefined) ? this.stripHideAnim : doAnim;
		if (doAnim === true) {
			this.header.slideOut("t", {
			    easing: "easeOut",
			    duration: .5,
			    remove: false
			});
		} else {
			this.header.hide();
		}
		this.bwrap.removeClass("x-tab-panel-body-top");
		this.bwrap.addClass("x-panel-body-noheader");
		this.header.hidden = true;
	},
	showStrip: function(doAnim) {
		doAnim = (doAnim === undefined) ? this.stripHideAnim : doAnim;
		if (doAnim === true) {
			this.header.slideIn("t", {
			    easing: "easeOut",
			    duration: .5
			});
		} else {
			this.header.show();
		}
		this.bwrap.addClass("x-tab-panel-body-top");
		this.bwrap.removeClass("x-panel-body-noheader");
		this.header.hidden = false;
	},
	toggleHideStrip: function(doAnim) {
		if (this.header.hidden === false) {
			this.hideStrip(doAnim);
		} else {
			this.showStrip(doAnim);
		}
	},
	onRemove: function(tabpanel, tab) {
		if (tab.ownerCt instanceof Ext.TabPanel && this.items.items.length === 1) {
			this.hideStrip(this.stripHideAnim);
		}
	},
	onAdd: function(tabpanel, tab) {
		if (tab.ownerCt instanceof Ext.TabPanel && this.header.hidden === true) {
			this.hideTabStripItem(tab);
			this.showStrip(this.stripHideAnim);
			new Ext.util.DelayedTask(function(){
				this.unhideTabStripItem(tab);
				tab.show();
			}, this).delay(500);
		}
	}
});

Ext.reg("tabstriphide", Ext.ux.TabStripHide);