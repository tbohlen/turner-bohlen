/********************************************************************\
Project: turnerbohlen.com
File: home.js
Description: constructor, model, and view for home panel
Author: Turner Bohlen (www.turnerbohlen.com)
Created: 08/16/2012
Copyright 2012 Turner Bohlen
\********************************************************************/

(function() {
    var env = this;
    /*
     * Constructor: HomeView
     * home view
     */

    function HomeView(element, model) {
        env.PanelView.call(this, element, model);
    }

    env.inherits(HomeView, env.PanelView);

    /*
     * Constructor: HomeModel
     * model for home panel
     */
    function HomeModel() {
        env.PanelModel.call(this);
    }

    env.inherits(HomeModel, env.PanelModel);


    function homeLoader(html) {
        function homeBuilder() {
            var newModel = new HomeModel();
            return new HomeView($(html), newModel);
        };
        return homeBuilder;
    }

    env.homeLoader = homeLoader;

}).call(FIND_MAIN_OBJECT());
