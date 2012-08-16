/********************************************************************\
Project: turnerbohlen.com
File: index.js
Description: homepage script
Author: Turner Bohlen (www.turnerbohlen.com)
Created: 08/15/2012
Copyright 2012 Turner Bohlen
\********************************************************************/

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Internal Link //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

(function() {
    var env = this
        , PageView
        , PageModel
        , PanelView
        , PanelModel;

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// PageModel ///////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
   
    /*
     * Constructor: PageModel
     * Model for the page. Contains the list of all individual panel models that
     * exist and their names.
     */
    function PageModel() {
        env.Model.call(this);
        this.panels = {};
        this.currentPanel = null;
    }

    env.inherits(PageModel, env.Model);

    /*
     * Method: addPanel
     * Adds a panel described by the given name and model to the page view.
     *
     * Parameters:
     * name - string uniquely identifying the panel
     * model - the model containing data end emitting events about the panel
     *
     * Member Of: PageModel
     */
    PageModel.prototype.addPanel = function(name, model) {
        this.panels[name] = model;
    };

    /*
     * Method: changePanel
     * Goes to the panel described by the given name.
     *
     * Parameters:
     * name - name of the panel that should be shown next
     *
     * Member Of: PageModel
     */
    PageModel.prototype.changePanel = function(name) {
        // variables
        var thisPanel = this.panels[this.currentPanel]
            , nextPanel
            , direction;

        // parameters
        if (name === null || typof(name) !== 'string') {
            name = 'home';
        }

        // calculations
        direction = thisPanel.directionTo(nextPanel);
        if (!direction) {
            // defaults to right
            direction = 'right';
        }

        // updates
        this.currentPanel = name;

        // notifications
        this.emit('show-panel', name, direction);
    };

    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////// PageView ///////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    /*
     * Constructor: PageView
     * Builds the page view which deals with showing the user the correct panel
     * at the correct time.
     */
    function PageView(element, model) {
        env.View.call(this, element, model);
        this.currentPanel = null;
        this.panels = {};
    }

    env.inherits(PageView, env.View);

    /*
     * Method: addPanel
     * Adds a panel described by the given name and model to the page view.
     *
     * Parameters:
     * name - string uniquely identifying the panel
     * view - the view for the panel
     *
     * Member Of: PageView
     */
    PageView.prototype.addPanel = function(name, view) {
        this.panels[name] = view;
    };

    /*
     * Method: loadPanel
     * Retrieves content of the named panel from the server and adds it to the
     * page.
     *
     * Parameters:
     * name - name of the panel to be added
     * callback - function to call when view has been retrieved
     *
     * Member Of: PageView
     */
    PageView.prototype.loadPanel = function(name, callback) {
        var self = this;
        env.loadView(name, function(builder) {
            if (builder !== null && typeof(builder) !== 'undefined') {
                // construct one view and add it to our list
                var newPanelView = builder();
                self.model.addPanel(name, newPanelView.model);
                newPanelView.parent = self;
                console.log('this: ' + self.element.attr('id'));
                console.log('other: ' + newPanelView.element);
                self.element.append(newPanelView.element);
                self.panels[name] = newPanelView;
            }
        });
    };

    /*
     * Method: slideToThe
     * Slides the page view port in the given direction to view a new panel.
     *
     * Parameters:
     * direction - direction to slide the view port.
     *
     * Member Of: PageView
     */
    PageView.prototype.slideToThe = function(direction, name) {
        var self = this
            , newPanel;
        if (this.panels[name] === null || typeof(this.panels[name]) === 'undefined') {
            this.loadPanel(name, function(error) {
                if (error !== null && typeof(error) !== 'undefined') {
                    console.log('error loading view ' + name);
                }
                else {
                    self.slideToThe(direction, name);
                }
            });
        }
        else {
            newPanel = this.panels[name];
            if (this.currentPanel === null || typeof(this.currentPanel) === 'undefined') {
                newPanel.showView();
            }
            else {
                newPanel.slideIn(direction, function() {
                    self.currentPanel = newPanel;
                });
                this.currentPanel.slideOut(direction);
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// PanelModel //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    
    /*
     * Constructor: PanelModel
     * Models a single panel on the screen.
     */
    function PanelModel() {
        env.Model.call(this);
        this.surroundings = {
            'left':null
            , 'right':null
            , 'top':null
            , 'bottom':null
        };
    }

    env.inherits(PanelModel, env.Model);

    /*
     * Method: directionTo
     * Finds the direction to the panel identified by name.
     *
     * Parameters:
     * name - identifier of the panel
     *
     * Member Of: PanelModel
     */
    PanelModel.prototype.directionTo = function(name) {
        for(direcion in this.surroundings) {
            if (this.surroundings[direction] === name) {
                return direction;
            }
        }
        return null;
    };


    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// PanelView ///////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    

    /*
     * Constructor: PanelView
     * View for a single panel of the website
     */
    function PanelView(element, model) {
        env.View.call(this, element, model);
        this.position = 'none';
    };

    env.inherits(PanelView, env.View);

    // expose
    env.PageModel = PageModel;
    env.PageView = PageView;
    env.PanelModel = PanelModel;
    env.PanelView = PanelView;

    // build a page!
    $(document).ready(function() {
        var pageModel = new PageModel();
        var pageView = new PageView($('#page-container'), pageModel);
        pageView.loadPanel('home', function() {
            console.log('panel load');
            pageModel.changePanel('home');
        });
    });

}).call(FIND_MAIN_OBJECT());
