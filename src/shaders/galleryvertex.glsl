uniform vec2 uFrequency;
uniform float uDistance;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * uDistance;
    modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * uDistance;
    modelPosition.x += sin(modelPosition.x * uFrequency.x + uTime) * uDistance;
    modelPosition.x += sin(modelPosition.y * uFrequency.y + uTime) * uDistance;
    modelPosition.y += sin(modelPosition.x * uFrequency.x + uTime) * uDistance;
    modelPosition.y += sin(modelPosition.y * uFrequency.y + uTime) * uDistance;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}