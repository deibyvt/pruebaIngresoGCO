# Plataforma de Fidelización Multimarca — Grupo Uribe (GCO)

> **Evaluación Técnica de Desarrollo Fullstack**  
> Aplicación web integral para la inscripción y gestión de clientes en los programas de fidelización de las marcas de **Grupo Uribe (GCO)**: *Americanino, American Eagle, Chevignon, Esprit, Naf Naf y Rifle*.

---

## 📋 Tabla de Contenido
1. [Descripción General](#-descripción-general)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Arquitectura del Sistema](#-arquitectura-del-sistema)
4. [Reglas de Negocio & Valor Agregado](#-reglas-de-negocio--valor-agregado)
5. [Requisitos Previos](#-requisitos-previos)
6. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
7. [Documentación de la API (OpenAPI / Swagger)](#-documentación-de-la-api-openapi--swagger)
8. [Endpoints RESTful](#-endpoints-restful)
9. [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🌟 Descripción General

La solución permite a los usuarios registrarse en el programa de lealtad de cualquiera de las marcas icónicas del conglomerado textil **Grupo Uribe (GCO)**. Cuenta con una experiencia de usuario inmersiva estilo estudio fotográfico en pantalla completa (`100vh`, sin scroll vertical), validación de negocio en dos niveles, catálogos geográficos en cascada y emisión instantánea de una **Tarjeta de Membresía Digital VIP**.

---

## 💻 Stack Tecnológico

### Backend
- **Lenguaje:** Java 21 (LTS)
- **Framework:** Spring Boot 4.1.1
- **Persistencia:** Spring Data JPA / Hibernate
- **Base de Datos:** MySQL 8.0+
- **Validaciones:** Jakarta Bean Validation (`@NotBlank`, `@Past`, `@Pattern`, `@Size`)
- **Documentación API:** Springdoc OpenAPI 2.8.5 (Swagger UI)
- **Productividad:** Project Lombok
- **Herramienta de Construcción:** Gradle

### Frontend
- **Librería UI:** React 19 (Hooks: `useState`, `useEffect`)
- **Bundler:** Vite 8.2+
- **Tipografía Oficial:** Google Fonts (*Bebas Neue* para títulos editoriales y *Montserrat Alternates* para textos y formularios)
- **Estilos:** CSS3 puro con degradado radial de estudio fotográfico, variables CSS y diseño responsive (`100vh`)
- **Comunicación HTTP:** Fetch API nativo con servicio centralizado y manejo de CORS

---

## 🏗️ Arquitectura del Sistema

La solución implementa una arquitectura en capas desacopladas siguiendo las mejores prácticas de la industria:

```
[ Frontend: React 19 + Vite ] (Puerto 5173)
       │
       │ HTTP / JSON (REST + CORS)
       ▼
[ Spring Boot Controller Layer ]
       │ (DTOs + Bean Validation)
       ▼
[ Service Layer: Lógica de Negocio ]
       │ (Validación de duplicados por marca + Excepciones de dominio)
       ▼
[ Repository Layer: Spring Data JPA ]
       │
       ▼
[ Base de Datos: MySQL (gco_fidelizacion) ] (Puerto 3306)
```

---

## 🎯 Reglas de Negocio & Valor Agregado

1. **Prevención Inteligente de Duplicados por Marca (`uk_cliente_doc_marca`):**
   - Un cliente **NO** puede registrarse dos veces en la misma marca con el mismo número de identificación.
   - Sin embargo, un mismo cliente **SÍ** puede pertenecer a los programas de fidelidad de marcas distintas (ej. *Americanino* y *Chevignon*), reflejando la realidad de un conglomerado multimarca.
   - Implementado mediante restricción de unicidad compuesta en base de datos y validación previa en la capa de servicios con código `HTTP 409 Conflict`.

2. **Geografía en Cascada en Tiempo Real:**
   - La selección de **País** filtra y actualiza dinámicamente los **Departamentos**, y la selección del departamento actualiza los municipios o **Ciudades** mediante endpoints REST parametrizados.

3. **Cumplimiento de Habeas Data (Ley 1581 de 2012):**
   - Consentimiento informado obligatorio con checkbox validado en backend (`@AssertTrue`) y frontend.
   - Ventana modal interactiva con el resumen legal del tratamiento de datos personales para Grupo Uribe.

4. **Seeder Automático de Datos (`DataInitializer`):**
   - Al iniciar la aplicación por primera vez, Spring Boot puebla automáticamente las 6 marcas del grupo, los 5 tipos de identificación y la jerarquía geográfica de Colombia (departamentos y ciudades principales), sin requerir scripts manuales obligatorios.

5. **Tarjeta de Membresía Digital VIP:**
   - Al completarse el registro, se presenta una tarjeta digital con diseño VIP que incluye nombre del titular, documento, marca seleccionada, código de socio y código de barras único.

---

## ⚙️ Requisitos Previos

Asegúrate de contar con el siguiente software instalado en tu equipo:
- **Java Development Kit (JDK):** Versión 21 o superior.
- **MySQL Server:** Versión 8.0 o superior (puerto local `3306`).
- **Node.js:** Versión 18 o superior con `npm`.
- **Git**

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el Repositorio
```bash
git clone https://github.com/valenciadeiby/pruebaIngresoGCO.git
cd pruebaIngresoGCO
```

### 2. Configurar la Base de Datos MySQL
Crea la base de datos en tu servidor local de MySQL:
```sql
CREATE DATABASE IF NOT EXISTS gco_fidelizacion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

*(Opcional)* Puedes importar el volcado preexistente si lo deseas:
```bash
mysql -u root -p gco_fidelizacion < dump-gco-fidelizacion.sql
```
> **Nota:** Si la base de datos se inicia vacía, el seeder automático `DataInitializer` de Spring Boot creará y poblará automáticamente todas las tablas al primer arranque.

Revisa las credenciales de conexión en [`src/main/resources/application.properties`](src/main/resources/application.properties):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gco_fidelizacion?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

### 3. Ejecutar el Backend (Spring Boot)
En la raíz del proyecto:
```bash
# En macOS/Linux:
./gradlew bootRun

# En Windows:
gradlew.bat bootRun
```
El servidor backend iniciará en el puerto **`8080`**.

### 4. Ejecutar el Frontend (React + Vite)
En una nueva terminal, ingresa a la carpeta `frontend`:
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en **`http://localhost:5173`**.

---

## 📖 Documentación de la API (OpenAPI / Swagger)

Una vez que el backend esté en ejecución, puedes explorar, probar e interactuar con todos los endpoints mediante la interfaz Swagger UI:
- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Especificación OpenAPI (JSON):** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🔌 Endpoints RESTful

### Catálogos (`/api/catalogos`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/catalogos/tipos-documento` | Lista los tipos de documento activos (CC, CE, TI, PA, PEP) |
| `GET` | `/api/catalogos/marcas` | Lista las 6 marcas de GCO |
| `GET` | `/api/catalogos/paises` | Lista los países registrados |
| `GET` | `/api/catalogos/departamentos/{paisId}` | Lista los departamentos del país especificado |
| `GET` | `/api/catalogos/ciudades/{departamentoId}` | Lista las ciudades del departamento especificado |

### Clientes (`/api/clientes`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/clientes` | Registra un nuevo cliente en el programa de fidelización |
| `GET` | `/api/clientes` | Retorna el listado de clientes registrados |
| `GET` | `/api/clientes/{id}` | Retorna el detalle de un cliente específico |

#### Ejemplo de Petición de Registro (`POST /api/clientes`):
```json
{
  "tipoDocumentoId": 1,
  "numeroDocumento": "1037654321",
  "nombres": "Mateo",
  "apellidos": "Gómez Pérez",
  "fechaNacimiento": "1998-05-14",
  "direccion": "Calle 10 # 43E-22, El Poblado",
  "ciudadId": 1,
  "marcaId": 6,
  "autorizaTratamientoDatos": true
}
```

#### Respuestas HTTP:
- `201 Created`: Cliente creado exitosamente con DTO enriquecido.
- `400 Bad Request`: Error de validación de campos con detalles específicos por atributo.
- `404 Not Found`: Cuando el tipo de documento, marca o ciudad no existen.
- `409 Conflict`: Cuando el cliente ya está registrado en esa marca específica.

---

## 📁 Estructura del Proyecto

```
gco/
├── dump-gco-fidelizacion.sql        # Volcado de la base de datos MySQL
├── build.gradle                     # Configuración de dependencias Gradle
├── src/main/java/com/prueba/gco/
│   ├── config/                      # Configuración CORS, OpenAPI y Seeder DataInitializer
│   ├── controller/                  # Controladores REST (CatalogoController, ClienteController)
│   ├── dto/                         # Data Transfer Objects y validaciones
│   ├── exception/                   # Excepciones de dominio y GlobalExceptionHandler
│   ├── model/                       # Entidades JPA (Cliente, Marca, TipoDocumento, Pais...)
│   ├── repository/                  # Repositorios Spring Data JPA
│   └── service/                     # Lógica de negocio (ClienteService, CatalogoService)
└── frontend/
    ├── public/
    │   ├── images/                  # Fotografías originales de modelos (788x963 px)
    │   └── svg/                     # Logos vectoriales oficiales de las marcas
    ├── src/
    │   ├── components/
    │   │   ├── VistaBienvenida.jsx      # Vista 1: Hero y mosaico editorial
    │   │   ├── VistaSeleccionMarca.jsx  # Vista 2: Selector interactivo de marcas
    │   │   ├── VistaFormulario.jsx      # Vista 3: Formulario con cascada y Habeas Data
    │   │   └── VistaExito.jsx           # Vista 4: Tarjeta de Membresía Digital VIP
    │   ├── data/
    │   │   └── marcasData.js            # Metadatos y mapping visual de marcas
    │   ├── services/
    │   │   └── api.js                   # Cliente HTTP centralizado hacia Spring Boot
    │   ├── App.jsx                      # Orquestador del flujo de vistas
    │   └── App.css                      # Estilos de estudio fotográfico (100vh)
    └── package.json
```

---
**Desarrollado con dedicación para el proceso de selección de Grupo Uribe (GCO).**
