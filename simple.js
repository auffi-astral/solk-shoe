var scene, camera, renderer, model, controls;
var scrollPosition = 0;

function startApp() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    var light1 = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(light1);
    
    var light2 = new THREE.DirectionalLight(0xffffff, 0.8);
    light2.position.set(10, 10, 5);
    scene.add(light2);
    
    loadModel();
    
    window.addEventListener('scroll', function() {
        scrollPosition = window.pageYOffset;
    });
    
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    render();
}

function loadModel() {
    var loader = new THREE.GLTFLoader();
    
    loader.load('SOLK 2025Q1 FADE 101 Ivory for GLB_2025-07-24 (1).glb', 
        function(gltf) {
            console.log('Model loaded successfully');
            model = gltf.scene;
            
            model.traverse(function(child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        wireframe: true
                    });
                }
            });
            
            var box = new THREE.Box3().setFromObject(model);
            var center = box.getCenter(new THREE.Vector3());
            var size = box.getSize(new THREE.Vector3());
            var maxSize = Math.max(size.x, size.y, size.z);
            var scale = 3 / maxSize;
            
            model.position.sub(center);
            model.scale.setScalar(scale);
            
            scene.add(model);
        },
        function(progress) {
            console.log('Loading progress: ' + (progress.loaded / progress.total * 100) + '%');
        },
        function(error) {
            console.log('Model failed to load, using cube');
            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var material = new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                wireframe: true 
            });
            model = new THREE.Mesh(geometry, material);
            scene.add(model);
        }
    );
}

function render() {
    requestAnimationFrame(render);
    
    if (model) {
        var rotation = scrollPosition * 0.005;
        model.rotation.y = rotation;
        model.rotation.x = rotation * 0.3;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

window.onload = startApp;