import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import bunnyPath from '../assets/bunny.ply?url'

function MeshViewer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        // 1. Create scene (container for everything)
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xe0e0e0)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5,5,5)
        scene.add(directionalLight)

        // 2. Create camera (viewpoint)
        const camera = new THREE.PerspectiveCamera(
            75,  // field of view in degrees
            window.innerWidth / window.innerHeight,  // aspect ratio
            0.1,  // near clipping plane
            1000  // far clipping plane
        )
        camera.position.z = .25  // Move camera back so we can see objects

        // 3. Create renderer (draws the scene)
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })
        const container = canvasRef.current.parentElement
        if (container) {                                 
            renderer.setSize(container.clientWidth, container.clientHeight)                             
            camera.aspect = container.clientWidth / container.clientHeight 
            camera.updateProjectionMatrix()                                                             
        } 

        // Create orbit controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05

        // Animation loop
        function animate() {
            requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }

        // Load bunny
        const loader = new PLYLoader()
        loader.load(
            bunnyPath,
            (geometry) => {
                const material = new THREE.MeshStandardMaterial({ color: 0x888888 })
                const mesh = new THREE.Mesh(geometry, material)

                // Center the mesh in main view tsx
                geometry.computeBoundingBox()
                if (geometry.boundingBox) {
                    const center = geometry.boundingBox.getCenter(new THREE.Vector3())
                    geometry.translate(-center.x, -center.y, -center.z)
                }

                scene.add(mesh)
            },
            undefined,
            (error) => {
                console.error('Error loading bunny:', error)
            }
        )

        // Start animation loop
        animate()

        // Cleanup
        return () => {
            renderer.dispose()
            controls.dispose()
        }
    }, [])

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
}

export default MeshViewer 