
class Cameras {
    constructor() {
        mp.events.add({
            "watchCam": (camera) => this.watchCam(camera),          
            "playerWeaponShot": () => this.pedShot(),
            "playerQuit": () => this.destroyCam(),
        })

        mp.keys.bind(8, true, () => this.destroyCam());

        mp.keys.bind(69, true, ()=> mp.events.callRemote('specCam', 1));

        this.cam;
        this.inCam;
    }

    watchCam(camera) {
        if (camera.position === undefined || camera.rotation === undefined) return;

        cam = mp.cameras.new('default', camera.position, camera.rotation, 40);
        cam.setActive(true);
        mp.game.cam.renderScriptCams(true, true, 200000000000, false, false);

        cam.pointAtCoord(camera.playerPos.x, camera.playerPos.y, camera.playerPos.z);

        mp.players.local.freezePosition(true);
    }

    destroyCam () {
        if (cam){        
            cam.setActive(false);
            mp.game.cam.renderScriptCams(false, true, 0, true, false);
            cam.destroy()    
            mp.events.callRemote('destroyCam')

            mp.players.local.freezePosition(false);
        }
    }

    pedShot() {
        let entity = mp.game.player.getEntityIsFreeAimingAt();
        if (!entity) return;
        mp.events.callRemote('pedShot', mp.peds.atHandle(entity));
    }
}

new Cameras();

//     /weapon smg




