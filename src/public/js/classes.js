/********************************************************************\
Project: turnerbohlen.com
File: classes.js
Description: Base classes for the website
Author: Turner Bohlen (www.turnerbohlen.com)
Created: 08/15/2012
Copyright 2012 Turner Bohlen
\********************************************************************/

// defines a FIND_MAIN_OBJECT function if it is not defined. This has to be
// defined once for each page
if (FIND_MAIN_OBJECT === null || typeof(FIND_MAIN_OBJECT) === 'undefined') {
    var FIND_MAIN_OBJECT = function() {
        if (window !== null && typeof(window) !== 'undefined') {
            if (window.pageEnv === null || typeof(window.pageEnv) === 'undefined') {
                window.pageEnv = {};
            }
            return window.pageEnv
        }
        return this;
    };
}

(function() {
    var env = this;

    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////// Helpers ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    function inherits(child, parent) {
        function f() {
            this.constructor = child;
        }
        f.prototype = parent.prototype;
        child.prototype = new f;
    }

    env.loadView = function(name, callback) {
        var scriptTag
            , styleTag
            , done;
        // we just got some css, some html, and some js
        // load the css right away
        // load the js right away
        // when the js is ready call the function name + 'Loader' and pass
        // it the html
        styleTag = $(document.createElement('link'))
            .attr('rel', 'stylesheet')
            .attr('type', 'text/css')
            .attr('charset', 'utf-8')
            .attr('href', '/css/' +  name + '.css');
        scriptTag = $(document.createElement('script'))
            .attr('onload', scriptLoaded)
            .attr('onreadystatechange', scriptLoaded)
            .attr('type', 'text/javascript')
            .attr('charset', 'utf-8')
            .attr('src', '/js/' + name + '.js');
        $('head').append(styleTag);
        $('head').append(scriptTag);

        function scriptLoaded() {
            if (!done) {
                done = true;
                var htmlCall = $.get('/html/' + name + '.html', 'text/html')
                    , constructor;
                htmlCall.success(function(data) {
                    constructor = env[name.toLowerCase() + 'Loader'](data);
                    callback(constructor);
                });

                htmlCall.error(function(error) {
                    console.log('Error retrieving view ' + name + 'html: ' + error.toString());
                });
            }
        }
    }

    /*
     * Constructor: View
     * Super class of all views. Doesn't do much on its own.
     */
    function View(element, model) {
        this.element = element;
        this.model = model;
    }

    /*
     * Constructor: Model
     * Superclass for all Models.
     */
    function Model() {
        Emitter.call(this);
    }
    
    inherits(Model, Emitter);

    /*
     * Constructor: Emitter
     * Simple event emitter
     */
    function Emitter() {
        this.listeners = {};
    }

    /*
     * Method: attach
     * Attaches a listener to a given event.
     *
     * Parameters:
     * event- the name of the event
     * listener - the listening function. Takes a single parameter
     *
     * Member Of: Emitter
     */
    Emitter.prototype.on = function(event, listener) {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    };

    /*
     * Method: emit
     * Emits an event to all listeners
     *
     * Parameters:
     * event - the name of the event
     *
     * Member Of: Emitter
     */
    Emitter.prototype.emit = function(event) {
        var key
            , i
            , j
            , eventListeners
            , argsArray = [];
        for (j = 1; j < arguments.length; j++) {
            argsArray.push(arguments[j]);
        }
        if (event in this.listeners) {
            eventListeners = this.listeners[event];
            for (i = 0; i < eventListeners.length; i++) {
                eventListeners[i].apply(this, argsArray);
            }
        }
    };

    // expose
    env.Emitter = Emitter;
    env.inherits = inherits;
    env.Model = Model;
    env.View = View;

}).call(FIND_MAIN_OBJECT());
