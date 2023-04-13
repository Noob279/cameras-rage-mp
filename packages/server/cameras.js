const camList = require('./camcoord.json');

class Cameras {

  constructor() {

    this.camList = camList;
    this.inCam = [];

    mp.events.add({
      "specCam": (player, id) => this.spectate(player, id),

      "destroyCam": (player) => this.destroy(player),

      "pedShot": (player, entity) => this.takeDamage(player, entity),

      "playerDeath": (player) => this.destroy(player),

      "playerQuit": (player) => this.destroy(player),
    });

    this.init();
  }

  init() {
    this.camList.forEach(cam => {
      mp.objects.new('prop_cctv_cam_03a', new mp.Vector3(cam.position.x, cam.position.y, cam.position.z),
        {
          rotation: new mp.Vector3(cam.rotation.x, cam.rotation.y, cam.rotation.z),
          alpha: 250,
          dimension: 0
        });
    });
  }

  spectate(player, id) {
    if (this.inCam[player.id]) return;
    player.call('watchCam', [this.camList[id]]);
    this.newPed(player);
    player.alpha = 0;
    this.staticPed.setVariable('pedID', player.id);

    player.position = new mp.Vector3(this.camList[id].position.x, this.camList[id].position.y, this.camList[id].position.z - 5);
  }


  destroy(player) {
    this.destroyPed(player);
    player.alpha = 255;
  }


  takeDamage(player, entity) {

    if (!entity && !entity.getVariable('pedID')) return;
    console.log(JSON.stringify(entity));

    if (player.health > 0) player.health -= 20;

  }

  newPed(player) {
    this.staticPed = mp.peds.new(mp.joaat('csb_mp_agent14'), player.position, {
      dynamic: false,
      frozen: true,
      invincible: true
    });

    this.staticPed.textLabel = mp.labels.new(`Гражданин ${player.id} просматривает камеры.`, new mp.Vector3(this.staticPed.position.x, this.staticPed.position.y, this.staticPed.position.z), {
      los: false,
      font: 4,
      drawDistance: 15,
      color: [255, 255, 255, 255],
      dimension: 0,
      virtualWorld: 0
    });

    this.inCam[player.id] = this.staticPed;
  }

  destroyPed(player) {
    if (!this.inCam[player.id]) return;

    player.position = this.inCam[player.id].position;


    this.inCam[player.id].textLabel.destroy();
    this.inCam[player.id].destroy();
    delete this.inCam[player.id];
  }

}
new Cameras();





