# Prueba Tecnica GCO - Fidelizacion de Clientes

Proyecto desarrollado para el proceso de seleccion de desarrollador en GCO (Grupo Uribe). Es una aplicacion web fullstack para el registro de clientes en el programa de fidelizacion de las marcas del grupo (Americanino, American Eagle, Chevignon, Esprit, Naf Naf y Rifle).

## Tecnologias utilizadas

- Backend: Java 21, Spring Boot, Spring Data JPA, Hibernate, MySQL, Gradle.
- Frontend: React, Vite, CSS.
- Documentacion: Swagger / OpenAPI.

## Requisitos

- Java 21
- MySQL 8+
- Node.js 18+

## Configuracion y ejecucion

### 1. Base de datos
Crear la base de datos en MySQL:
```sql
CREATE DATABASE gco_fidelizacion;
```

En la raiz del proyecto se encuentra el archivo `dump-gco-fidelizacion.sql` para importar los datos:
```bash
mysql -u root -p gco_fidelizacion < dump-gco-fidelizacion.sql
```

Nota: La aplicacion tambien incluye un seeder en Spring Boot que carga los catalogos iniciales (marcas, tipos de documento y ciudades) si la base de datos esta vacia.

Revisar las credenciales en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gco_fidelizacion?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

### 2. Backend
Ejecutar el proyecto con Gradle:
```bash
./gradlew bootRun
```
El servidor queda corriendo en `http://localhost:8080`.

Swagger UI disponible en:
`http://localhost:8080/swagger-ui/index.html`

### 3. Frontend
Entrar a la carpeta `frontend`, instalar dependencias y levantar el servidor de desarrollo:
```bash
cd frontend
npm install
npm run dev
```
La interfaz se abre en `http://localhost:5173`.

## Endpoints principales

### Catalogos
- `GET /api/catalogos/tipos-documento` - Lista de tipos de documento
- `GET /api/catalogos/marcas` - Lista de marcas
- `GET /api/catalogos/paises` - Lista de paises
- `GET /api/catalogos/departamentos/{paisId}` - Departamentos por pais
- `GET /api/catalogos/ciudades/{departamentoId}` - Ciudades por departamento

### Clientes
- `POST /api/clientes` - Registro de cliente en el programa de fidelizacion
- `GET /api/clientes` - Listar clientes registrados
- `GET /api/clientes/{id}` - Consultar cliente por ID

## Reglas implementadas
- Un cliente no se puede registrar dos veces en la misma marca con el mismo numero de identificacion.
- Un mismo cliente si puede registrarse en marcas diferentes del grupo.
- Los selects de ubicacion (Pais, Departamento, Ciudad) funcionan en cascada.
- Checkbox de autorizacion de tratamiento de datos personales (Ley 1581 de 2012).
