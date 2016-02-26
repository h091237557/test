
var  Lmv = require('view-and-data'),
  path = require('path');
  
var config = {
  defaultBucketKey: 'bimgo',

  credentials: {
    ConsumerKey: "", // use env variables or replace by consumer key
    ConsumerSecret: "" // use env variables or replace by consumer secret
  }
};

  var urn = '';
  
  
(function(){
   var lmv = new Lmv(config);

    function onError(error) {
      console.log(error);
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
        path.join(__dirname, 'data/test.dwf'),
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
      donwload();
     
    }

    //start the test
    lmv.initialize().then(onInitialized, onError);
  
})();  
  
function donwload() {
  
  var lmv = new Lmv(config);

    function onError(error) {
      console.log(error);
    }

    function onInitialized(response) {

      if(!urn.length) {

        return;
      }

      lmv.download(urn, 'data/download').then(
        onDataDownloaded,
        onError
      );
    }

    function onDataDownloaded(items) {

      console.log('Model downloaded successfully');

      var path3d = items.filter(function(item){
        return item.type === '3d';
      });

      console.log('3D Viewable path:');
      console.log(path3d);

      var path2d = items.filter(function(item){
        return item.type === '2d';
      });

      console.log('2D Viewable path:');
      console.log(path2d);

   
    }

    //start the test
    lmv.initialize().then(onInitialized, onError);
  
  
};