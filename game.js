alert("Game JS loaded!");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light);

// Grass
const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(100,500),
    new THREE.MeshLambertMaterial({color:0x228B22})
);
grass.rotation.x = -Math.PI/2;
scene.add(grass);

// Road
const road = new THREE.Mesh(
    new THREE.PlaneGeometry(12,500),
    new THREE.MeshLambertMaterial({color:0x333333})
);
road.rotation.x = -Math.PI/2;
road.position.y = 0.01;
scene.add(road);

// Lane lines
for(let i=-200;i<250;i+=10){
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.2,0.1,5),
        new THREE.MeshBasicMaterial({color:0xffffff})
    );
    line.position.set(0,0.05,i);
    scene.add(line);
}

// Trees
for(let i=-200;i<250;i+=12){

    const trunk1 = new THREE.Mesh(
        new THREE.CylinderGeometry(.3,.3,2),
        new THREE.MeshLambertMaterial({color:0x8B4513})
    );
    trunk1.position.set(-10,1,i);
    scene.add(trunk1);

    const leaves1 = new THREE.Mesh(
        new THREE.SphereGeometry(1.5),
        new THREE.MeshLambertMaterial({color:0x00aa00})
    );
    leaves1.position.set(-10,3,i);
    scene.add(leaves1);

    const trunk2 = trunk1.clone();
    trunk2.position.x = 10;
    scene.add(trunk2);

    const leaves2 = leaves1.clone();
    leaves2.position.x = 10;
    scene.add(leaves2);
}

// Player car
const car = new THREE.Mesh(
    new THREE.BoxGeometry(1.5,1,3),
    new THREE.MeshLambertMaterial({color:0xff0000})
);

car.position.set(0,0.5,10);
scene.add(car);

camera.position.set(0,6,15);
camera.lookAt(0,0,0);

const lanes=[-3,0,3];
let laneIndex=1;

// Buttons
document.getElementById("leftBtn").onclick=()=>{
    if(laneIndex>0) laneIndex--;
};

document.getElementById("rightBtn").onclick=()=>{
    if(laneIndex<2) laneIndex++;
};

// Obstacles
const obstacles=[];

function createObstacle(){

    const obstacle=new THREE.Mesh(
        new THREE.BoxGeometry(1.5,1,3),
        new THREE.MeshLambertMaterial({color:0x0000ff})
    );

    obstacle.position.set(
        lanes[Math.floor(Math.random()*3)],
        0.5,
        -80
    );

    scene.add(obstacle);
    obstacles.push(obstacle);
}

setInterval(createObstacle,1200);

let score=0;

function animate(){

    requestAnimationFrame(animate);

    car.position.x+=(lanes[laneIndex]-car.position.x)*0.15;

    obstacles.forEach((o,index)=>{

        o.position.z+=0.8;

        if(o.position.z>20){
            scene.remove(o);
            obstacles.splice(index,1);
            score+=10;
        }

        if(
            Math.abs(o.position.z-car.position.z)<2 &&
            Math.abs(o.position.x-car.position.x)<1
        ){
            alert("Game Over! Score: "+score);
            location.reload();
        }

    });

    score++;
    document.getElementById("score").innerHTML="Score: "+score;

    renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});
console.log("Game loaded");
