# Router Config App

Una aplicación móvil para acceder fácilmente a la configuración de tu router.

## Características

- Detección automática de la dirección del router
- Acceso directo a la interfaz de configuración del router
- Interfaz de usuario intuitiva y moderna
- Soporte para iOS y Android

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app en tu dispositivo móvil (disponible en App Store y Google Play)

## Instalación

1. Clona este repositorio:
```bash
git clone <url-del-repositorio>
cd router-config
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Inicia la aplicación:
```bash
npm start
# o
yarn start
```

4. Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil.

## Uso

1. Abre la aplicación en tu dispositivo móvil
2. Toca el botón "Acceder al Router"
3. La aplicación detectará automáticamente la dirección de tu router
4. Se abrirá la interfaz de configuración del router directamente en la aplicación
5. Si tienes problemas para acceder, puedes usar el botón "Abrir en Navegador"

## Solución de Problemas

Si encuentras algún problema:

1. Asegúrate de estar conectado a la red del router
2. Verifica que tu dispositivo móvil tenga acceso a la red local
3. Intenta abrir la configuración del router en el navegador
4. Reinicia el router si es necesario

## Tecnologías Utilizadas

- React Native
- Expo
- react-native-webview
- expo-network

## Licencia

MIT
