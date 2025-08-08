let scene, camera, renderer, shoe, controls;
let scrollY = 0;

function init() {
    console.log('Initializing Three.js scene...');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Load GLB model
    loadShoeModel();
    
    // Event listeners
    window.addEventListener('scroll', onScroll, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation loop
    animate();
}

function loadShoeModel() {
    const loadingElement = document.getElementById('loading');
    
    // Check if GLTFLoader is available
    if (!THREE.GLTFLoader) {
        console.error('GLTFLoader not available');
        loadingElement.textContent = 'GLTFLoader not found - using fallback';
        createFallbackCube();
        return;
    }
    
    const loader = new THREE.GLTFLoader();
    console.log('GLTFLoader initialized, attempting to load GLB...');
    
    // Try different filename variations
    const filenames = [
        'SOLK 2025Q1 FADE 101 Ivory for GLB_2025-07-24 (1).glb',
        './SOLK 2025Q1 FADE 101 Ivory for GLB_2025-07-24 (1).glb',
        encodeURIComponent('SOLK 2025Q1 FADE 101 Ivory for GLB_2025-07-24 (1).glb')
    ];
    
    let currentIndex = 0;
    
    function tryNextFile() {
        if (currentIndex >= filenames.length) {
            console.error('All file paths failed');
            loadingElement.textContent = 'Model not found - using fallback';
            createFallbackCube();
            return;
        }
        
        const filename = filenames[currentIndex];
        console.log('Trying to load: ' + filename);
        loadingElement.textContent = 'Loading model (attempt ' + (currentIndex + 1) + '/3)...';
        
        loader.load(
            filename,
            function(gltf) {
                console.log('GLB loaded successfully:', gltf);
                loadingElement.style.display = 'none';
                
                shoe = gltf.scene;
                console.log('Scene object:', shoe);
                console.log('Scene children:', shoe.children);
                
                // Apply wireframe material to all meshes
                let meshCount = 0;
                shoe.traverse(function(child) {
                    if (child.isMesh) {
                        meshCount++;
                        console.log('Found mesh:', child.name || ('unnamed_' + meshCount), child);
                        child.material = new THREE.MeshBasicMaterial({
                            color: 0xffffff,
                            wireframe: true
                        });
                    }
                });
                
                console.log('Total meshes found: ' + meshCount);
                
                if (meshCount === 0) {
                    console.warn('No meshes found in GLB model');
                    createFallbackCube();
                    return;
                }
                
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(shoe);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxSize = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxSize;
                
                console.log('Model bounds:', { center: center, size: size, maxSize: maxSize, scale: scale });
                
                shoe.position.sub(center);
                shoe.scale.setScalar(scale);
                
                scene.add(shoe);
                console.log('Shoe model added to scene successfully!');
            },
            function(progress) {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log('Loading progress:', percent + '%');
                    loadingElement.textContent = 'Loading model... ' + percent + '%';
                }
            },
            function(error) {
                console.error('Error loading GLB with filename "' + filename + '":', error);
                currentIndex++;
                tryNextFile();
            }
        );
    }
    
    tryNextFile();
}

function createFallbackCube() {
    const loadingElement = document.getElementById('loading');
    loadingElement.textContent = 'Using wireframe cube (model failed to load)';
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        wireframe: true 
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    shoe = cube;
    console.log('Added fallback cube');
    
    // Remove setTimeout to avoid CSP issues
    loadingElement.style.display = 'none';
}

function onScroll() {
    scrollY = window.scrollY;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate based on scroll position
    if (shoe) {
        const rotationSpeed = scrollY * 0.005;
        shoe.rotation.y = rotationSpeed;
        shoe.rotation.x = rotationSpeed * 0.3;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.error('THREE.js failed to load');
        document.getElementById('loading').innerHTML = 'THREE.js failed to load<br>Check your internet connection';
        return;
    }
    
    console.log('THREE.js loaded successfully, version:', THREE.REVISION);
    init();
});