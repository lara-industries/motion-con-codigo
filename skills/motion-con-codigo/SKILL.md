---
name: motion-con-codigo
description: Crear títulos, tipografía cinética y gráficas animadas en código (React + Remotion) y exportarlos como video, con fondo transparente cuando se pide. Usar cuando la persona pide un título animado, una gráfica en movimiento o "motion" para poner sobre su video, sin After Effects ni un editor.
---

# Motion con código

Una animación hecha en código se edita como un texto: se cambia una palabra, un número o un tiempo y el resto queda igual. Esta skill lleva de un pedido en palabras a tres archivos de video.

Si es la primera vez de la persona, sigue [START-HERE.md](../../START-HERE.md).

## Cómo pedir (y cómo leer un pedido)

1. **Medidas primero.** Formato, duración y qué pasa segundo a segundo: "9:16, 1080×1920, 30 fps, 5 segundos" y después "0 a 2,3 s: el tambor gira rápido".
2. **El gusto con nombre.** Fuentes, colores con su código y una referencia. No adjetivos como "bonito" o "limpio".
3. **Dos opciones.** Haz dos versiones y mejora la que gane.
4. **Transparencia.** Los títulos salen sin fondo para ponerlos sobre otro video.
5. **Archivos propios.** Usa las fuentes y el logo de la persona en vez de recrearlos.
6. **La voz marca el tiempo.** Si hay narración, mide en qué segundo cae cada palabra y amarra cada movimiento a una palabra.

Si falta alguna medida, pregúntala antes de escribir código.

## Reglas del código

- Cada componente recibe el número de cuadro y calcula todo desde ahí. Sin animaciones CSS, sin `Date`, sin azar sin semilla.
- Diseña al tamaño nativo (1080×1920 o 1080×1080) y escala por dentro.
- Carga las fuentes antes de renderizar y retén el render hasta que estén listas.
- Deja márgenes: un golpe que crece al 116 % no debe cortarse contra el borde.

## El proyecto

Parte de [`plantilla/`](../../plantilla/): cópiala a una carpeta nueva y corre `npm install`. Trae `package.json` con las versiones probadas, `tsconfig.json` (sin él, Remotion falla con "Could not find a tsconfig.json"), `src/index.ts`, `src/Root.tsx` con las dos composiciones y `src/Titulo.tsx`, que es el título de serigrafía ya funcionando.

En `Titulo.tsx`, lo que cambia la persona está arriba: las líneas del texto, cuál va al ancho completo, cuál lleva el color de acento y los tres colores. Con un título de otro largo, reparte las palabras en dos a cuatro líneas, pon al ancho completo las que cargan el sentido y deja el acento para la última.

Las fuentes se instalan con `@fontsource/<nombre>` y se importan como `import '@fontsource/anton/400.css'`. El render espera a la fuente con `delayRender` y `document.fonts.load`, como en la plantilla.

Peso, para avisarlo antes: `npm install` ocupa cerca de 1 GB. El primer render descarga solo un navegador sin ventana (unos 170 MB de descarga, cerca de 600 MB en disco) y tarda unos 3 minutos sin mostrar avance. Un título de 5 segundos pesa unos 340 MB en `.mov` y 100 MB en PNG. En total, cerca de 1,5 GB: comprueba con `df -h .` que haya al menos 3 GB libres.

## Render (probado con Remotion 4.0.537)

```bash
npm run revision   # out/review.mp4, sobre fondo claro
npm run alfa       # out/alpha.mov, ProRes 4444 con transparencia
npm run png        # out/png/, una imagen sin fondo por cuadro
```

Son estos comandos:

```bash
npx remotion render src/index.ts TituloOnPaper out/review.mp4 --concurrency=2
npx remotion render src/index.ts Titulo out/alpha.mov \
  --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --concurrency=2
npx remotion render src/index.ts Titulo out/png --sequence --image-format=png --concurrency=2
```

La composición `Titulo` no tiene fondo. `TituloOnPaper` es la misma sobre un color claro, solo para revisar.

Si el proyecto tiene un `remotion.config.ts` que fija un CRF, el render ProRes falla: ProRes no acepta CRF. En ese caso usa una configuración aparte para el `.mov` con `--config`. La plantilla no trae ese archivo y no lo necesita.

Cada render tarda cerca de un minuto. `ffprobe` informa `yuva444p12le` en el `.mov` aunque se pidan 10 bits: es normal y la transparencia está.

## Revisión antes de entregar

`npm run revisar` (o `sh revisar.sh`) deja en `out/check/` tres cuadros del MP4 y un cuadro del `.mov` sobre magenta. Ábrelos y míralos:

- En los tres cuadros: nada cortado contra el borde, texto correcto, colores pedidos.
- Sobre magenta: se ve magenta alrededor de las letras. Si el fondo sale negro o blanco, no hay transparencia.
- Di qué se desvió del pedido y por qué.

Para mostrarle el video a la persona: `open out/review.mp4` en macOS, `start out\review.mp4` en Windows o `xdg-open out/review.mp4` en Linux.

## Los cuatro prompts

| Prompt | Qué sale |
|---|---|
| [Título de serigrafía](../../prompts/01-titulo-serigrafia.md) | Título que parece impreso a mano |
| [Tambor 3D](../../prompts/02-tambor-3d.md) | Una palabra que gira, frena y recibe un corte |
| [Una palabra a la vez](../../prompts/03-una-palabra-a-la-vez.md) | Una frase que pasa palabra por palabra |
| [Toma de interfaz](../../prompts/04-toma-de-interfaz.md) | Una app inventada que genera gráficas en bucle |

## Lo que esto no hace

No genera video realista ni personas: eso es trabajo de un modelo de video. Aquí todo es tipografía, formas e interfaz dibujadas en código.
