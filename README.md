🧩 1️⃣ Almacenamiento local (sin conexión)
🧩 2️⃣ Servidor backend (archivo local)
🧩 3️⃣ Repositorio de GitHub (control de versiones)

| Nivel      | Dónde se guarda               | Cuándo se guarda         | Ventaja principal                         |
| ---------- | ----------------------------- | ------------------------ | ----------------------------------------- |
| 🏠 Local   | Navegador del usuario         | Inmediatamente (offline) | No se pierde nada sin conexión            |
| 💾 Backend | Servidor (archivo JSON local) | Durante la ejecución     | Rápido acceso y sincronización            |
| ☁️ GitHub  | Repositorio remoto            | Después de cada cambio   | Respaldo, control de versiones, historial |

    
    
         "name": "Carr sn nombre",
        "oneway": "yes",
        "sentido": "doble-sentido" 
        
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


/*CODIGO PARA SUBIR NUEVOS CAMBIOS A GITHUB Y VERSEL*/

git status  
git add .  
git commit -m "Actualizo mapa protector con cambios recientes"  
git push   

/*FIN CODIGO PARA SUBIR NUEVOS CAMBIOS A GITHUB Y VERSEL*/

https://fontawesome.com/search?q=tree&o=r  /*ICONOS DE FONTAWESOME*/ 
https://icons.getbootstrap.com/            /*ICONOS DE BOSTRAP REACT*/
        
https://tools.paintmaps.com/es/recorte-de-mapa/MX/4-102078363/muestras /* DESCARGAR JSON TETELA DE COAMPO IMAGENES MUY BUENO*/
https://geojson.io/#map=2/0/20 /*MUY BUENO CARGA EL ARCHIVO JSON Y LO PUEDE EDITAR*/
https://overpass-turbo.eu/ /*El mejor el que use*/

        {/*<TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

          />*/}

        
/** CODIGO PARA EXTRAER DATOS DE TETELA DE COAMPO EN https://overpass-turbo.eu/
 [out:json][timeout:25];
area["name"="Tetela de Ocampo"]["admin_level"="8"]->.searchArea;
(
  way["highway"](area.searchArea);
);
out body;
>;
out skel qt; 
*TERMINA CODIGO*/     