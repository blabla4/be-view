define(["init", "tv", "light", "door", "player", "weather"], function(init, tv, light, door, player, weather) {
  var nbr = "";
  var timer = 0;
  var timer2 = Math.floor(Date.now() / 1000);

  init.remote.on('num', function(event, param) {
    if (Math.floor(Date.now() / 1000) - timer2 > 1) {
      if (Math.floor(Date.now() / 1000) - timer < 4) {
        nbr = nbr + param;
        $("#channel h1").html(nbr);
      } else {
        timer = 0;
        nbr = "";
      }
      if (timer == 0) {
        nbr = nbr + param;
        $("#channel").show();
        $("#channel h1").html(nbr);
        timer = Math.floor(Date.now() / 1000);
        setTimeout(function() {
          $("#channel").hide();
          player.vlc.playlist.playItem(parseInt(nbr));
          player.currentChannel = parseInt(nbr);
        }, 3000);
      }
      timer2 = Math.floor(Date.now() / 1000);
    }
  });

  init.remote.on('blue', function(event, param) {
    if (!init.weather.is(":visible")) {
      weather.load();
      init.weather.show();
      setTimeout(function() {
        init.weather.hide();
      }, 8000);
    } else {
      init.weather.hide();
    }
  });

  init.remote.on('green', function(event, param) {
    if (tv.currentState === tv.STATE.BELL) {
      door.switchToAccept();
    }
  });

  init.remote.on('red', function(event, param) {
    if (tv.currentState === tv.STATE.BELL) {
      door.switchToRefuse();
    }
  });

  init.remote.on('p+', function(event, param) {
    if (tv.currentState === tv.STATE.TV) {
      if (player.currentChannel === player.channelMax) {
        player.currentChannel = player.channelMin;
      } else {
        player.currentChannel++;
      }
      player.vlc.playlist.playItem(player.currentChannel);
    }
  });

  init.remote.on('p-', function(event, param) {
    if (tv.currentState === tv.STATE.TV) {
      if (player.currentChannel === player.channelMin) {
        player.currentChannel = player.channelMax;
      } else {
        player.currentChannel--;
      }
      player.vlc.playlist.playItem(player.currentChannel);
    }
  });

  init.remote.on('ok', function(event, param) {
    if (tv.currentState === tv.STATE.ALARM) {
      init.alarm.hide();
      player.vlc.playlist.playItem(player.currentChannel);
      light.stopBlink('65000');
    } else if (tv.currentState === tv.STATE.BELL) {
      door.validateChoice();
    }
    tv.currentState = tv.STATE.TV;
  });

  init.remote.on('v-', function(event, param) {
    tv.soap('AAAAAQAAAAEAAAATAw==');
  });

  init.remote.on('v+', function(event, param) {
    tv.soap('AAAAAQAAAAEAAAASAw==');
  });

  init.remote.on('mute', function(event, param) {
    tv.soap('AAAAAQAAAAEAAAAUAw==');
  });
});