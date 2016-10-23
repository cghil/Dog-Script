var requestp = require('request-promise'),
    request = require('request'),
    _ = require('underscore'),
    fs = require('fs'),
    async = require("async");

function clearDogData(ids) {
    function deleteADog(id) {
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
    }

    async.each(
        ids,
        function(id, logID) {
            deleteADog(id);
        },
        function(err) {
            console.log('deleted dogs... now starting to create new dogs');
            startCreatingDogs();
        }
    );

    ids.forEach(function(id) {
        deleteADog(id);
    });
}

function getDogs() {
    var options = {
        method: 'GET',
        uri: 'https://agile-crag-29150.herokuapp.com/api/v1/dogs',
        headers: { 'content-type': 'application/json' },
        json: true
    };

    requestp(options).then(function(body) {
            var dogData = body;
            var dogIDs = filterForDogIDs(dogData);
            clearDogData(dogIDs);
        })
        .catch(function(err) {
            console.log(err);
        });

}

function createDog(dog) {

    var options = {
        method: 'POST',
        url: 'https://agile-crag-29150.herokuapp.com/api/v1/dogs',
        headers: { 'content-type': 'application/json' },
        body: dog,
        json: true
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}

function startCreatingDogs() {
    var dogs = JSON.parse(fs.readFileSync('./dogs.json', 'utf8'));
    
    function getNewDogs() {
        var options = {
            method: 'GET',
            uri: 'https://agile-crag-29150.herokuapp.com/api/v1/dogs',
            headers: { 'content-type': 'application/json' },
            json: true
        };

        requestp(options).then(function(body) {
                var dogData = body;
                console.log(dogData);
            })
            .catch(function(err) {
                console.log(err);
            });

    }

    async.each(dogs,
        function(dog) {
            createDog(dog);
        },
        function(err) {
            getNewDogs();
        }
    )
};


function filterForDogIDs(data) {
    var dogIDs = _.pluck(data, "_id");
    console.log(dogIDs);
    return dogIDs;
}

function start() {
    getDogs();
};

start();
