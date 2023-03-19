import {  useCallback } from 'react'
import {  Color3,Texture } from '@babylonjs/core'
import {  useScene } from 'react-babylonjs';


const Cuboid = ({ url }: { url: string }) => {
    const scene = useScene()
    const textureRef = useCallback((node) => {
        if (node != null) {
            const texture = new Texture(url = url, scene)
            const material = node
            material.diffuseTexture = texture
        }
    }, [url])
    return (
        <box name="test-box" size={2} wrap>
            <standardMaterial ref={textureRef} name="test" specularColor={Color3.Black()} />
        </box>
    )
}
export default Cuboid