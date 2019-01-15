var express = require('express');
var cmd = require('node-cmd');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});

 
    cmd.get(
        'ffmpeg -fflags +genpts -i 1.webm -i audio.mp3 -r 24 -c:a copy 1.mp4',
        function(err, data, stderr){
            console.log('the current working dir is : ',data)
            console.log('ERROR : ',err)
            console.log(' kabhdcnja : ',stderr)
        }
    );

    // ffmpeg -fflags +genpts -i 1.webm -i audio.mp3 -r 24 -c:a copy 1.mp4
    // $  ffmpeg -i aaa.webm -i bbb.mp3 -r 10 -cpu-used 5 -c:v libx264 -crf 20 -c:a aac -strict experimental -loglevel error one1111.mp4

    // ffmpeg -i video.mp4 -i audio.m4a -c:v copy -c:a copy output.mp4
    // ffmpeg -fflags +genpts -i 1.webm -r 24 1.mp4
    // ffmpeg -i one.webm -r 10 -cpu-used 5 -c:v libx264 -crf 20 -c:a aac -strict experimental -loglevel error /tmp/one.mp4

    //cmd.run('touch example.created.file');
 
    // cmd.get(
    //     'ls',
    //     function(err, data, stderr){
    //         console.log('the current dir contains these files :\n\n',data)
    //     }
    // );
 
    // cmd.get(
    //     `
    //         git clone https://github.com/RIAEvangelist/node-cmd.git
    //         cd node-cmd
    //         ls
    //     `,
    //     function(err, data, stderr){
    //         if (!err) {
    //            console.log('the node-cmd cloned dir contains these files :\n\n',data)
    //         } else {
    //            console.log('error', err)
    //         }
 
    //     }
    // );
 

module.exports = router;
