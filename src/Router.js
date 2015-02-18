define([
    'config',
    'states',
    'backbone',
    './Rock',
    'underscore'
], function (config, states, Backbone, Rock, _) {

    'use strict';

    return Backbone.Router.extend(_.extend({}, Rock, {
        cid: _.uniqueId('router'),

        _name: 'Router',

        _routesOriginal: {
            '404': 'notFound'
        },

        routes: {},

        /**
         * Foundation router constructor
         */
        constructor: function (options) {
            // Build routes
            this._routesOriginal = _.extend(this._routesOriginal, states);
            _.each(this._routesOriginal, function (val, key) {
                this.routes[key] = this._stateManager.bind(this, val, key);
            }.bind(this));

            // Run the backbone constructor
            Backbone.Router.prototype.constructor.call(this, options);
        },

        /**
         * Bedrock router initialize
         */
        initialize: function () {
            Backbone.Router.prototype.initialize.apply(this, arguments);

            return this;
        },

        /**
         * Starts the router
         */
        start: function () {
            !this._siblings.length && this._logger.warn(this._name, 'There are no siblings. State won\'t be handled.');

            // Listens for the changes
            var historyStart = Backbone.history.start({ pushState: true });

            // No history is 404
            !historyStart && this.navigate('404', { trigger: true });
        },

        // -----------------------------------

        /**
         * Manages the states of the routes
         */
        _stateManager: function (state, route) {
            var routeArr,
                routeAdded,
                args,
                params,
                stateParsed,
                hasParams,
                paramsObj,
                i;

            // TODO: Support * and ? in the routes

            // Take care of routes besides the index one
            if (route !== '') {
                routeArr = route.split('/');
                routeAdded = [];
                args = arguments;

                // Get all params
                i = 1;
                params = routeArr.map(function (val) {
                    // Check if there is a param in the route bit
                    if (val.replace(':', '') === val) {
                        return;
                    }

                    i += 1;
                    return {
                        param: val.replace(':', ''),
                        value: args[i]
                    };
                }).filter(function (val) { return !!val; });

                // Build the routes added
                _.each(routeArr, function (val, i) {
                    routeAdded.push((i !== 0 && (routeAdded[i - 1] + '/') || '') + routeArr[i]);
                });

                // Go through each from the child
                _.each(routeAdded.reverse(), function (routeUrl, i) {
                    // State may not exist
                    if (!this._routesOriginal[routeUrl]) {
                        return;
                    }

                    // Map to the right params
                    paramsObj = {};
                    hasParams = !!(params.map(function (val) {
                        // Check if there is a param in the route
                        if (routeUrl.replace(':' + val.param, '') === routeUrl) {
                            return false;
                        }

                        // Add the param
                        paramsObj[val.param] = val.value;

                        // Used later to see if there are params in the route
                        return true;
                    }).filter(function (val) { return val; }).length);

                    // Build the state object
                    stateParsed = {
                        name: this._routesOriginal[routeUrl],
                        route: routeUrl,
                        params: hasParams && paramsObj || undefined,
                        child: stateParsed
                    };
                }.bind(this));
            }

            // Add the index
            stateParsed = {
                name: this._routesOriginal[''],
                route: '',
                child: stateParsed
            };

            // Handle state
            this._handleState(stateParsed);

        },

        /**
         * Handle state
         */
        _handleState: function (state) {
            !this._siblings.length && this._logger.warn(this._name, 'There are no siblings. State won\'t be handled.');

            _.each(this._siblings, function (child) {
                child.setState(state);
            });

            // Finally trigger the statechange
            this.trigger('statechange', state);
        }
    }));
});