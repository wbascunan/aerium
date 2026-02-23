# Instrucciones para subir a GitHub

## Pasos para hacer Push al repositorio

### 1. Abre Terminal / PowerShell en la carpeta del proyecto
```powershell
cd C:\Users\willi\Desktop\Proyectos\páginas\dron
```

### 2. Inicializa git (si no está ya inicializado)
```powershell
git init
```

### 3. Añade el remoto de GitHub
```powershell
git remote add origin https://github.com/wbascunan/aerium.git
```

### 4. Verifica que el remoto esté configurado
```powershell
git remote -v
```

### 5. Añade todos los archivos
```powershell
git add .
```

### 6. Haz el commit inicial
```powershell
git commit -m "Initial commit: Aerium landing page profesional"
```

### 7. Sube a GitHub
```powershell
git branch -M main
git push -u origin main
```

---

## Configurar GitHub Pages

1. Ve a tu repositorio en GitHub: https://github.com/wbascunan/aerium
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, selecciona **Pages**
4. Bajo "Build and deployment":
   - **Source**: selecciona "Deploy from a branch"
   - **Branch**: selecciona `main` y la carpeta `/ (root)`
   - Haz clic en **Save**

5. Espera 2-3 minutos y tu sitio estará disponible en:
   **https://wbascunan.github.io/aerium/**

---

## Actualizaciones futuras

Para hacer cambios después del push inicial:

```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

---

## Solución de problemas

**Si te sale error de autenticación:**
- GitHub ya no acepta contraseña: usa un **Personal Access Token**
- O configura SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**Si la página no se ve correctamente:**
- Espera 5 minutos (GitHub Pages actualiza con retraso)
- Abre en modo incógnito para evitar caché
- Verifica que los archivos `index.html`, `styles.css`, `script.js` e `imagenes/` estén en la raíz

---

¡Éxito! 🚀
