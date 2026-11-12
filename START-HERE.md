# Empieza aquí

Vas a salir de aquí con un título animado hecho en código y con fondo transparente, listo para poner encima de tu video.

No necesitas saber programar ni animar. Tu agente escribe el código y saca el video. Tú eliges el texto y los colores, y dices si te gusta.

## Antes de empezar

**Usa la app de escritorio de tu agente, no el navegador.** En el navegador el agente te responde, pero no puede crear archivos de video en tu computador. Abre la app y entra al modo que trabaja en tu máquina:

| Agente | Dónde se abre | Modo |
|---|---|---|
| Claude | App de escritorio de Claude | Pestaña **Code**, en una carpeta local |
| ChatGPT | App de escritorio de ChatGPT | **Codex**, en una carpeta que tú eliges |
| Cursor | Cursor | **Agent** |
| Grok | Terminal | **Grok Build** |

Ten a mano el texto de tu título (pocas palabras) y, si los tienes, tus colores y tu fuente. Si no, se usan los del ejemplo.

**Qué cuesta.** Node, Remotion y ffmpeg son gratis para ti si trabajas solo. Remotion tiene licencia propia y las empresas pagan: si esto es para una empresa, revisa [remotion.pro/license](https://www.remotion.pro/license). El trabajo del agente gasta del plan que ya tengas. En disco ocupa cerca de 1,5 GB.

**Qué se probó.** Esto se hizo en macOS con Claude Code, Remotion 4.0.537, Node 20 y ffmpeg. Así salieron los cuatro videos de [`examples/`](examples/). El 12 de noviembre de 2026, un agente de Claude sin más contexto que esta página llegó a los tres archivos en unos 10 minutos. En ChatGPT, Cursor, Grok, Windows y Linux todavía no está probado: tu agente debe decirte si algo no le funciona en vez de inventar un resultado.

## Instrucciones para el agente que está leyendo esta página

Lleva a la persona hasta su primer video. No le entregues una lista de comandos para que se las arregle sola. En cada paso dile qué acabas de comprobar y cuál es la única decisión que le toca.

1. **Comprueba dónde puedes trabajar.** Necesitas crear archivos y ejecutar comandos en el computador de la persona. Si estás en un chat de navegador o en una sesión en la nube, dilo con claridad, explícale cómo abrir una sesión local en su app de escritorio (tabla de arriba) y detente ahí. No simules el resultado ni describas un video que no existe.
2. **Revisa lo que ya tiene.** `node --version` (18 o más; probado con 20), `ffmpeg -version` y `df -h .` para el espacio libre: hacen falta unos 3 GB. Dile en palabras simples qué falta, cuánto pesa y dónde quedará, y espera su permiso antes de instalar. No instales nada global sin avisar.
3. **Pregunta tres cosas, una a la vez.** El texto del título. Los colores y la fuente, o si usa los del ejemplo. El formato: vertical 9:16 si no dice otra cosa.
4. **Crea el proyecto en una carpeta nueva**, fuera de cualquier otro proyecto. Baja este repositorio a una carpeta temporal con `git clone --depth 1 https://github.com/lara-industries/motion-con-codigo.git`; si no hay git, usa el ZIP de `https://github.com/lara-industries/motion-con-codigo/archive/refs/heads/main.zip`. Copia [`plantilla/`](plantilla/) a la carpeta del proyecto y corre `npm install`. Trae las versiones probadas y el título de serigrafía ya funcionando. Avísale que el primer video tarda unos 3 minutos más, porque se descarga solo un navegador sin ventana, y que no es un error.
5. **Pon su texto y sus colores** en la parte de arriba de `src/Titulo.tsx`. El pedido completo está en [`prompts/01-titulo-serigrafia.md`](prompts/01-titulo-serigrafia.md). Si escribes otra animación, todo movimiento sale del número de cuadro: nada de animaciones CSS, `Date` ni azar sin semilla. Así el render sale igual cada vez.
6. **Saca los tres archivos** con `npm run revision`, `npm run alfa` y `npm run png`: un MP4 sobre fondo claro para revisar, un `.mov` con transparencia y una carpeta de imágenes sin fondo, una por cuadro. Los detalles están en [`skills/motion-con-codigo/SKILL.md`](skills/motion-con-codigo/SKILL.md).
7. **Mira lo que salió antes de mostrarlo.** `npm run revisar` deja tres cuadros del video y un cuadro del `.mov` sobre magenta. Ábrelos: si se ve magenta alrededor de las letras, la transparencia existe. Si algo no coincide con lo pedido, dilo.
8. **Muéstrale el MP4** (`open out/review.mp4` en macOS) y dile en qué carpeta quedaron los archivos. Explícale que el `.mov` pesa cientos de MB porque guarda la transparencia, y que la carpeta `png` son las mismas imágenes sueltas. Pídele una opinión concreta: tamaño, ritmo o color. Si quiere explorar, haz dos versiones y mejora la que elija.
9. **Cierra con cómo volver.** Dile qué frase usar la próxima vez y que los otros tres prompts están en [`prompts/`](prompts/). Si su editor no lee el `.mov` con transparencia, pregúntale cuál usa y conviértelo.

No publiques nada, no gastes dinero y no abras archivos fuera de la carpeta del proyecto sin que la persona lo pida.

## La próxima vez

```text
Usa motion-con-codigo. Quiero un título animado que diga "<tu texto>",
con estos colores: <colores>. Vertical 9:16 y con fondo transparente.
Primero muéstrame el MP4 de revisión.
```

La guía completa, con lo que funcionó y lo que no, está en [https://sebastianlara.io/guias/motion-con-claude/](https://sebastianlara.io/guias/motion-con-claude/).
