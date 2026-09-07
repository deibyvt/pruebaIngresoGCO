-- MySQL dump 10.13  Distrib 26.7.0, for macos26.6 (arm64)
--
-- Host: localhost    Database: gco_fidelizacion
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '61cccbd2-a955-11f1-94ac-8fdeaab89de7:1-25';

--
-- Table structure for table `ciudades`
--

DROP TABLE IF EXISTS `ciudades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4a087507o9j9ksh1tuw7ed4up` (`departamento_id`),
  CONSTRAINT `FK4a087507o9j9ksh1tuw7ed4up` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudades`
--

LOCK TABLES `ciudades` WRITE;
/*!40000 ALTER TABLE `ciudades` DISABLE KEYS */;
INSERT INTO `ciudades` VALUES (1,'Medellín',1),(2,'Envigado',1),(3,'Itagüí',1),(4,'Bello',1),(5,'Sabaneta',1),(6,'Rionegro',1),(7,'Bogotá D.C.',2),(8,'Soacha',2),(9,'Chía',2),(10,'Zipaquirá',2),(11,'Facatativá',2),(12,'Cali',3),(13,'Palmira',3),(14,'Buenaventura',3),(15,'Tuluá',3),(16,'Buga',3),(17,'Barranquilla',4),(18,'Soledad',4),(19,'Malambo',4),(20,'Bucaramanga',5),(21,'Floridablanca',5),(22,'Girón',5),(23,'Piedecuesta',5),(24,'Cartagena',6),(25,'Magangué',6),(26,'Pereira',7),(27,'Dosquebradas',7),(28,'Santa Rosa de Cabal',7),(29,'Manizales',8),(30,'Villamaría',8),(31,'Chinchiná',8);
/*!40000 ALTER TABLE `ciudades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `autoriza_tratamiento_datos` bit(1) NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ciudad_id` bigint NOT NULL,
  `marca_id` bigint NOT NULL,
  `tipo_documento_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cliente_doc_marca` (`tipo_documento_id`,`numero_documento`,`marca_id`),
  KEY `FKoj210o00ykfmkdi2ale1v25v4` (`ciudad_id`),
  KEY `FKpxa3ng41fdyym0kr2392l8ukc` (`marca_id`),
  CONSTRAINT `FK7kip9sonhtidtyvk9vw33ng0x` FOREIGN KEY (`tipo_documento_id`) REFERENCES `tipos_documento` (`id`),
  CONSTRAINT `FKoj210o00ykfmkdi2ale1v25v4` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`),
  CONSTRAINT `FKpxa3ng41fdyym0kr2392l8ukc` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Gómez Pérez',_binary '','Calle 10 # 43E - 25 El Poblado','1998-05-14','2026-09-05 17:27:31.249774','Carlos Andrés','1037654321',1,3,1),(2,'Valencia Tobon',_binary '','Carrera 19 # 13 - 44','1997-08-01','2026-09-05 17:48:34.486322','Jhon Deiby','1035234122',1,1,1),(3,'Acevedo Valenzuela',_binary '','Calle 59 # 22c 24','2003-04-18','2026-09-05 17:52:45.089348','Carolina','1000190593',1,5,1),(4,'Tobon Florez',_binary '','carrera 19 # 13 - 44','1972-11-01','2026-09-05 18:13:03.697932','Maria Licinia','39211027',1,4,1),(5,'Valencia',_binary '','Carrera 19 # 13 - 44','0007-08-01','2026-09-06 19:03:12.127608','Jhon','1035234122',1,3,1),(6,'Tobon',_binary '','carrera 12','1997-08-01','2026-09-06 19:06:21.286601','Deiby','1035234123',1,3,1),(7,'Valencia',_binary '','calle 9','1997-08-01','2026-09-06 19:20:19.885140','jhon','1035234122',1,2,1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pais_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpmxt507p1yp3ldiweejl35iiy` (`pais_id`),
  CONSTRAINT `FKpmxt507p1yp3ldiweejl35iiy` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
INSERT INTO `departamentos` VALUES (1,'Antioquia',1),(2,'Cundinamarca',1),(3,'Valle del Cauca',1),(4,'Atlántico',1),(5,'Santander',1),(6,'Bolívar',1),(7,'Risaralda',1),(8,'Caldas',1);
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `codigo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjffpjd0wlsteym78r0heieklc` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (1,_binary '','AMERICANINO','Moda juvenil urbana y denim auténtico.','Americanino'),(2,_binary '','AMERICAN_EAGLE','Denim de alta calidad, comodidad y estilo relajado.','American Eagle'),(3,_binary '','CHEVIGNON','Herencia francesa, prendas de cuero y mezclilla icónica.','Chevignon'),(4,_binary '','ESPRIT','Estilo californiano, frescura y moda casual contemporánea.','Esprit'),(5,_binary '','NAF_NAF','Moda femenina sofisticada, audaz y vanguardista.','Naf Naf'),(6,_binary '','RIFLE','Tradición y durabilidad en jeans y prendas casuales.','Rifle');
/*!40000 ALTER TABLE `marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paises`
--

DROP TABLE IF EXISTS `paises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paises` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKl8ega4hy4w789l3913tgw71tk` (`codigo`),
  UNIQUE KEY `UKn886r7od5ecn9soo5n5cxn032` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paises`
--

LOCK TABLES `paises` WRITE;
/*!40000 ALTER TABLE `paises` DISABLE KEYS */;
INSERT INTO `paises` VALUES (1,'CO','Colombia');
/*!40000 ALTER TABLE `paises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_documento`
--

DROP TABLE IF EXISTS `tipos_documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_documento` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqwk4pj04oauj8o63fo07obxqv` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_documento`
--

LOCK TABLES `tipos_documento` WRITE;
/*!40000 ALTER TABLE `tipos_documento` DISABLE KEYS */;
INSERT INTO `tipos_documento` VALUES (1,_binary '','CC','Cédula de Ciudadanía'),(2,_binary '','CE','Cédula de Extranjería'),(3,_binary '','PA','Pasaporte'),(4,_binary '','TI','Tarjeta de Identidad'),(5,_binary '','PEP','Permiso Especial de Permanencia');
/*!40000 ALTER TABLE `tipos_documento` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-06 19:21:03
