$.fn.gVideo = function(options) {
    // 요소 순회를 하기 전에 메인 옵션 빌드
    var defaults = {
        theme: 'simpledark',
        childtheme: '',
        target:''
    };
    var options = $.extend(defaults, options);
    var vdo = document.getElementById(options.target); 
    var $gVideo = $(this);
    // 매칭되는 요소를 찾아서 포맷 재설정
    return this.each(function() {
        $gVideo = $(this);
        // HTML 구조 생성
        // 메인 래퍼
        var $video_wrap = $('<div></div>').addClass('pp-video-player').addClass(options.theme).addClass(options.childtheme);
        // 컨트롤 래퍼
        var $video_controls = $('<div class="pp-video-controls"><a class="pp-video-play" title="Play/Pause"></a><div class="pp-video-seek"></div><div id="pp-video-timer" class="pp-video-timer">00:00</div><div class="pp-volume-box"><div class="pp-volume-slider"></div><a class="pp-volume-button" title="Mute/Unmute"></a></div></div>');
        $gVideo.wrap($video_wrap);
        $gVideo.after($video_controls);

        var $video_container = $('.pp-video-player');
        var $video_controls = $('.pp-video-controls', $video_container);
        var $pp_play_btn = $('.pp-video-play', $video_container);
        var $pp_video_seek = $('.pp-video-seek', $video_container);
        var $pp_video_timer = $('#pp-video-timer');
        var $pp_volume = $('.pp-volume-slider', $video_container);
        var $pp_volume_btn = $('.pp-volume-button', $video_container);
        var seeksliding = false;
        //$video_controls.hide(); // 컨트롤은 숨겨둡니다
        var gPlay = function() {
            if(vdo.paused == false) {
                $gVideo[0].pause();
            } else {
                $gVideo[0].play();
            }
        };

        $pp_play_btn.click(gPlay);
        $gVideo.click(gPlay);

        $gVideo.bind('play', function() {
            $pp_play_btn.addClass('pp-paused-button');
        });

        $gVideo.bind('pause', function() {
            $pp_play_btn.removeClass('pp-paused-button');
        });

        $gVideo.bind('ended', function() {
            $pp_play_btn.removeClass('pp-paused-button');
        });

        var createSeek = function() {
            if($gVideo.attr('readyState')) {
                var video_duration = $gVideo.attr('duration');
                $pp_video_seek.slider({
                    value: 0,
                    step: 0.01,
                    orientation: 'horizontal',
                    range: 'min',
                    max: video_duration,
                    animate: true,
                    slide: function(){
                        seeksliding = true;
                    },
                    stop:function(e, ui){
                        seeksliding = false;
                        console.log(ui.value);
                        vdo.currentTime = ui.value;
                    }
                });
                $video_controls.show();
            } else {
                setTimeout(createSeek, 150);
            }
        };

        createSeek();

        var gTimeFormat = function(sec){
            var seconds = parseInt(sec);
            var m = Math.floor(seconds / 60) < 10 ? '0' + Math.floor(seconds / 60) : Math.floor(seconds / 60);
            var s = Math.floor(seconds - (m * 60)) < 10 ? '0' + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
            return m + ':' + s;
        };

        var seekUpdate = function() {
            var current = Math.floor(vdo.currentTime);
            if(!seeksliding) $pp_video_seek.slider('value', current);
            $pp_video_timer.text(gTimeFormat(current));
        };

        $gVideo.bind('timeupdate', seekUpdate);

        $pp_volume.slider({
            value: 1,
            orientation: 'vertical',
            range: 'min',
            min: 0,
            max: 1,
            step: 0.05,
            animate: true,
            change:function(e, ui){
                video_volume = ui.value;
                $gVideo.attr('volume', ui.value);
            },
            slide:function(e, ui){
                $gVideo.attr('muted', false);
                video_volume = ui.value;
                $gVideo.attr('volume', ui.value);
            }
        });

        var muteVolume = function() {
            if($gVideo.attr('muted')==true) {
                $gVideo.attr('muted', false);
                $pp_volume.slider('value', video_volume);

                $pp_volume_btn.removeClass('pp-volume-mute');
            } else {
                $gVideo.attr('muted', true);
                $pp_volume.slider('value', '0');

                $pp_volume_btn.addClass('pp-volume-mute');
            };
        };

        $pp_volume_btn.click(muteVolume);
    });
};