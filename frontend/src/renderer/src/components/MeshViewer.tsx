import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import bunnyPath from '../assets/bunny.ply?url'

function MeshViewer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [hitPoint, setHitPoint] = useState<THREE.Vector3 | null>(null)
    const [radius, setRadius] = useState(0.02)
    const [height, setHeight] = useState(0.01)

    const handleAddToDb = async () => {
            if (!hitPoint) return
            const result = await window.api.saveCoords({
                x: hitPoint.x,
                y: hitPoint.y,
                z: hitPoint.z
            })
            console.log('Saved coords!', result)
    }

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

        let mesh: THREE.Mesh | null = null
        const raycaster = new THREE.Raycaster()

        // Load bunny
        const loader = new PLYLoader()
        loader.load(
            bunnyPath,
            (geometry) => {
                const material = new THREE.MeshStandardMaterial({ color: 0x888888 })
                mesh = new THREE.Mesh(geometry, material)

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

        const markerGeometry = new THREE.SphereGeometry(0.005,16,16)
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const marker = new THREE.Mesh(markerGeometry,markerMaterial)
        marker.visible = false
        scene.add(marker)

        const handleClick = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const ndcX = (x / rect.width) * 2 - 1
            const ndcY = -(y / rect.height) * 2 + 1
            const vec2 = new THREE.Vector2(ndcX, ndcY)
            raycaster.setFromCamera(vec2,camera)
            if (!mesh) return
            const intersects = raycaster.intersectObject(mesh)
            if (intersects.length > 0) {
                const hitPoint = intersects[0].point
                console.log('Hit Point:', hitPoint.x, hitPoint.y, hitPoint.z)
                marker.position.copy(hitPoint)
                marker.visible = true
                setHitPoint(hitPoint.clone())
                
            }
        }

        renderer.domElement.addEventListener('click', handleClick)

        // Start animation loop
        animate()

        // Cleanup
        return () => {
            renderer.dispose()
            controls.dispose()
            renderer.domElement.removeEventListener('click', handleClick)
        }
    }, [])

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
            
            {hitPoint && (
                <div style = {{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '4px'
                }}>
                    <p>X: {hitPoint.x.toFixed(4)}</p>
                    <p>Y: {hitPoint.y.toFixed(4)}</p>
                    <p>Z: {hitPoint.z.toFixed(4)}</p>
                    <button onClick={handleAddToDb}>Add Coords to DB</button>
                </div>
            )}
        </div>
    )
}

export default MeshViewer 