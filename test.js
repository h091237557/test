
var  Lmv = require('view-and-data'),
  path = require('path');
  
var config = {
  defaultBucketKey: 'adn-bucket',

  credentials: {
    ConsumerKey: "qP37uo9gUNSccJep71cproPHfTN988js ", // use env variables or replace by consumer key
    ConsumerSecret: "K77ac4NkGeJq40HN" // use env variables or replace by consumer secret
  }
};

  var urn = '';
(function(){
	var lmv = new Lmv(config);
  console.log(lmv);
    function onError(error) {
    
    }

    function onInitialized(response) {

      var createIfNotExists = true;

      var bucketCreationData = {
        bucketKey: config.defaultBucketKey,
        servicesAllowed: [],
        policy: "transient"
      };

      lmv.getBucket(config.defaultBucketKey,
        createIfNotExists,
        bucketCreationData).then(
          onBucketCreated,
          onError);
    }

    function onBucketCreated(response) {

      lmv.upload(
        path.join("", 'data/test.dwf'),
        config.defaultBucketKey,
        'test.dwf').then(onUploadCompleted, onError);

      //lmv.resumableUpload(
      //  path.join(__dirname, './data/test.dwf'),
      //  config.defaultBucketKey,
      //  'test.dwf').then(onResumableUploadCompleted, onError);
    }

    function onUploadCompleted(response) {

      var fileId = response.objects[0].id;

      urn = lmv.toBase64(fileId);

      lmv.register(urn, true).then(onRegister, onError);
    }

    function onResumableUploadCompleted(response) {

      response.forEach(function(result){

        console.log(result.objects);
      });

      var fileId = response[0].objects[0].id;

      urn = lmv.toBase64(fileId);

      lmv.register(urn, true).then(onRegister, onError);
    }

    function onRegister(response) {

      if (response.Result === "Success") {

        console.log('Translating file...');

        lmv.checkTranslationStatus(
          urn, 1000 * 60 * 5, 1000 * 10,
          progressCallback).then(
            onTranslationCompleted,
            onError);
      }
      else {
       
      }
    }

    function progressCallback(progress) {

      console.log(progress);
    }

    function onTranslationCompleted(response) {

      console.log('URN: ' + response.urn);

      lmv.getThumbnail(urn).then(onThumbnail, onError);
    }

    function onThumbnail(response) {

      
    }

    //start the test
    lmv.initialize().then(onInitialized, onError);
	
	
})();