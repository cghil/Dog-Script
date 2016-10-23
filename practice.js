var request = require('request'),
    rq = require('request-promise'),
    _ = require('underscore'),
    fs = require('fs'),
    async = require("async");

var MYSCRIPT = MYSCRIPT || {};

MYSCRIPT.dog = {
    getDogs: function(callback) {
        var options = {
            method: 'GET',
            uri: 'https://agile-crag-29150.herokuapp.com/api/v1/dogs',
            headers: { 'content-type': 'application/json' },
            json: true
        };
        var that = this;
        rq(options).then(function(body) {
            var dogData = body;
            callback(that, body);
        });
    },

    deleteADog: function(id) {
        var dogID = id;
        var options = {
            method: 'DELETE',
            url: 'https://agile-crag-29150.herokuapp.com/api/v1/dogs/' + dogID,
            headers: { 'content-type': 'application/json' }
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            console.log('Dog deleted : ' + dogID);
        });
    },

    createADog: function(dogData) {
        var options = {
            method: 'POST',
            url: 'https://agile-crag-29150.herokuapp.com/api/v1/dogs',
            headers: { 'content-type': 'application/json' },
            body: dogData,
            json: true
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
    },

    filterForExistingDogIDs: function(data) {
        var dogIDs = _.pluck(data, "_id");
        return dogIDs;
    },

    createNewDogs: function(){
        var dogs = JSON.parse(fs.readFileSync('./dogs.json', 'utf8'));
        var that = this;
        dogs.forEach(function(dog){
            that.createADog(dog);
        })
    },

    removeDogData: function(data) {},

    start: function() {
        function mainCallBack(that, data) {
            var ids = that.filterForExistingDogIDs(data);
            if(ids.length > 0){
                async.each(
                    ids,
                    function(id, callback){
                        that.deleteADog(id);
                    }, function(err){
                        that.createNewDogs();
                        console.log('finished...')
                    }
                )   
            } else {
                that.createNewDogs();
            }
        }
        this.getDogs(mainCallBack);
    }
};

MYSCRIPT.dog.start();